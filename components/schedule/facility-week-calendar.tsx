'use client'

import * as React from 'react'
import Link from 'next/link'
import type { DayIndex } from '@/types/schedule'
import type { GeneratedWeek, ScheduleSlot } from '@/types/schedule'
import type { CalendarFeedBlock, CalendarFeedCategory } from '@/lib/schedule/calendar-feed'
import { DAY_LABELS } from '@/components/schedule/control-schedule-grid'
import { isoDateForWeekDay } from '@/lib/schedule/generator'
import { cn } from '@/lib/utils'
import {
  CAL_DISPLAY_END,
  CAL_DISPLAY_START,
  CAL_PX_PER_HOUR,
  layoutCalendarBlocksForDay,
  type LaidOutCalendarBlock,
} from '@/lib/schedule/calendar-day-layout'

function categoryStyle(cat: CalendarFeedCategory): string {
  switch (cat) {
    case 'youth_program':
      return 'border-emerald-500/40 bg-emerald-950/50 text-emerald-100'
    case 'party':
      return 'border-fuchsia-500/35 bg-fuchsia-950/40 text-fuchsia-100'
    case 'assessment':
      return 'border-sky-500/35 bg-sky-950/45 text-sky-100'
    case 'rental_booking':
      return 'border-amber-500/40 bg-amber-950/45 text-amber-100'
    case 'field_rental':
      return 'border-blue-400/30 bg-blue-950/40 text-blue-100'
    default:
      return 'border-formula-frost/20 bg-formula-paper/[0.08] text-formula-frost/90'
  }
}

function formatHm(minute: number) {
  const h = Math.floor(minute / 60)
  const m = minute % 60
  const am = h >= 12 ? 'p' : 'a'
  const hr = h > 12 ? h - 12 : h === 0 ? 12 : h
  return m === 0 ? `${hr}${am}` : `${hr}:${m.toString().padStart(2, '0')}${am}`
}

const SNAP_MIN = 15

export interface FacilityWeekCalendarProps {
  weekStart: string
  blocks: CalendarFeedBlock[]
  /** Used to resolve program slot clicks (`slot-*` ids). */
  week: GeneratedWeek | null
  onProgramSlotClick?: (slot: ScheduleSlot) => void
  /** Assessments, rentals, agreements, etc. */
  onFeedBlockClick?: (block: CalendarFeedBlock) => void
  /** Empty grid — adds a draft override (parent wires save + tab switch). */
  onEmptySlotClick?: (payload: { dayIndex: DayIndex; startMinute: number; endMinute: number }) => void
}

export function FacilityWeekCalendar({
  weekStart,
  blocks,
  week,
  onProgramSlotClick,
  onFeedBlockClick,
  onEmptySlotClick,
}: FacilityWeekCalendarProps) {
  const hours = React.useMemo(() => {
    const out: number[] = []
    for (let h = Math.floor(CAL_DISPLAY_START / 60); h <= Math.floor(CAL_DISPLAY_END / 60); h++) out.push(h)
    return out
  }, [])

  const totalPx = ((CAL_DISPLAY_END - CAL_DISPLAY_START) / 60) * CAL_PX_PER_HOUR

  const byDay = React.useMemo(() => {
    const m = new Map<DayIndex, CalendarFeedBlock[]>()
    for (let d = 0; d < 7; d++) m.set(d as DayIndex, [])
    for (const b of blocks) {
      const list = m.get(b.dayIndex) ?? []
      list.push(b)
      m.set(b.dayIndex, list)
    }
    for (const list of m.values()) {
      list.sort((a, b) => a.startMinute - b.startMinute)
    }
    return m
  }, [blocks])

  const laidOutByDay = React.useMemo(() => {
    const m = new Map<DayIndex, LaidOutCalendarBlock[]>()
    for (let d = 0; d < 7; d++) {
      const di = d as DayIndex
      m.set(di, layoutCalendarBlocksForDay(byDay.get(di) ?? []))
    }
    return m
  }, [byDay])

  const handleBlockActivate = (b: CalendarFeedBlock) => {
    if (b.id.startsWith('slot-') && week) {
      const sid = b.id.slice('slot-'.length)
      const slot = week.slots.find(s => s.id === sid)
      if (slot) {
        onProgramSlotClick?.(slot)
        return
      }
    }
    onFeedBlockClick?.(b)
  }

  const handleGridClick = (e: React.MouseEvent<HTMLButtonElement>, di: DayIndex) => {
    if (!onEmptySlotClick) return
    const y = e.nativeEvent.offsetY
    const clamped = Math.max(0, Math.min(y, totalPx))
    const span = CAL_DISPLAY_END - CAL_DISPLAY_START
    const minuteRaw = CAL_DISPLAY_START + (clamped / totalPx) * span
    const snapped = Math.round(minuteRaw / SNAP_MIN) * SNAP_MIN
    const startMinute = Math.max(CAL_DISPLAY_START, Math.min(CAL_DISPLAY_END - 30, snapped))
    const endMinute = Math.min(CAL_DISPLAY_END, startMinute + 60)
    onEmptySlotClick({ dayIndex: di, startMinute, endMinute })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10px] text-formula-mist">
          Week of {weekStart} · Los Angeles wall time · program + assessments + rentals + parties · overlapping blocks
          are split horizontally; click a block for details or empty space to add an override.
        </p>
        <Link
          href="/events/parties"
          className="inline-flex items-center border border-fuchsia-500/35 bg-fuchsia-950/30 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-fuchsia-100 hover:border-fuchsia-400/50"
        >
          Book party
        </Link>
      </div>

      <div className="flex gap-0 overflow-x-auto border border-formula-frost/12 bg-formula-paper/[0.03] shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
        <div
          className="sticky left-0 z-20 w-10 shrink-0 border-r border-formula-frost/12 bg-formula-deep/60 font-mono text-[9px] text-formula-mist"
          style={{ minHeight: totalPx + 28 }}
        >
          <div className="h-7 border-b border-formula-frost/10" />
          {hours.map(h => (
            <div
              key={h}
              className="border-b border-formula-frost/8 text-right pr-1"
              style={{ height: CAL_PX_PER_HOUR }}
            >
              {h > 12 ? h - 12 : h === 0 ? 12 : h}
              {h >= 12 ? 'p' : 'a'}
            </div>
          ))}
        </div>

        {([0, 1, 2, 3, 4, 5, 6] as const).map(d => {
          const di = d as DayIndex
          const iso = isoDateForWeekDay(weekStart, di)
          const dayBlocks = laidOutByDay.get(di) ?? []
          return (
            <div
              key={d}
              className="relative min-w-[104px] flex-1 border-r border-formula-frost/10 last:border-r-0"
              style={{ minHeight: totalPx + 28 }}
            >
              <div className="sticky top-0 z-[15] border-b border-formula-frost/12 bg-formula-deep/50 px-1 py-1 text-center font-mono text-[9px] font-bold uppercase text-formula-paper">
                <div>{DAY_LABELS[di]}</div>
                <div className="text-[8px] font-normal text-formula-mist">{iso.slice(5)}</div>
              </div>
              <div className="relative" style={{ height: totalPx }}>
                <div className="pointer-events-none absolute inset-0 z-0 flex flex-col">
                  {hours.map(h => (
                    <div
                      key={h}
                      className="border-b border-formula-frost/[0.06]"
                      style={{ height: CAL_PX_PER_HOUR }}
                    />
                  ))}
                </div>
                {onEmptySlotClick ? (
                  <button
                    type="button"
                    className="absolute inset-0 z-[1] cursor-cell bg-transparent text-left outline-none hover:bg-formula-volt/[0.04] focus-visible:ring-1 focus-visible:ring-formula-volt/40"
                    aria-label={`Add or edit schedule for ${DAY_LABELS[di]} — click a time`}
                    onClick={e => handleGridClick(e, di)}
                  />
                ) : null}
                {dayBlocks.map(b => {
                  const topMin = Math.max(CAL_DISPLAY_START, b.startMinute)
                  const botMin = Math.min(CAL_DISPLAY_END, b.endMinute)
                  if (botMin <= topMin) return null
                  const top = ((topMin - CAL_DISPLAY_START) / 60) * CAL_PX_PER_HOUR
                  const h = Math.max(20, ((botMin - topMin) / 60) * CAL_PX_PER_HOUR)
                  const w = `calc(${b.widthPct}% - 3px)`
                  const left = `calc(${b.leftPct}% + 1px)`
                  return (
                    <button
                      key={b.id}
                      type="button"
                      className={cn(
                        'absolute z-[2] overflow-hidden rounded-sm border px-1 py-0.5 text-left text-[8px] font-semibold leading-tight shadow-sm transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-formula-volt/50',
                        categoryStyle(b.category)
                      )}
                      style={{ top, height: h, left, width: w }}
                      title={`${b.label}${b.sublabel ? ` · ${b.sublabel}` : ''}`}
                      aria-label={`${b.label} ${formatHm(b.startMinute)} to ${formatHm(b.endMinute)}`}
                      onClick={e => {
                        e.stopPropagation()
                        handleBlockActivate(b)
                      }}
                    >
                      <span className="line-clamp-2 block">{b.label}</span>
                      <span className="block font-mono text-[7px] font-normal opacity-90">
                        {formatHm(b.startMinute)}–{formatHm(b.endMinute)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
