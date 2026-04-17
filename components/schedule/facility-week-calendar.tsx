'use client'

import * as React from 'react'
import Link from 'next/link'
import type { DayIndex } from '@/types/schedule'
import type { CalendarFeedBlock, CalendarFeedCategory } from '@/lib/schedule/calendar-feed'
import { DAY_LABELS } from '@/components/schedule/control-schedule-grid'
import { isoDateForWeekDay } from '@/lib/schedule/generator'
import { cn } from '@/lib/utils'

const DISPLAY_START = 6 * 60
const DISPLAY_END = 23 * 60
const PX_PER_HOUR = 44

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

export interface FacilityWeekCalendarProps {
  weekStart: string
  blocks: CalendarFeedBlock[]
}

export function FacilityWeekCalendar({ weekStart, blocks }: FacilityWeekCalendarProps) {
  const hours = React.useMemo(() => {
    const out: number[] = []
    for (let h = Math.floor(DISPLAY_START / 60); h <= Math.floor(DISPLAY_END / 60); h++) out.push(h)
    return out
  }, [])

  const totalPx = ((DISPLAY_END - DISPLAY_START) / 60) * PX_PER_HOUR

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

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10px] text-formula-mist">
          Week of {weekStart} · Los Angeles wall time · program + assessments + rentals + parties
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
          className="sticky left-0 z-10 w-10 shrink-0 border-r border-formula-frost/12 bg-formula-deep/60 font-mono text-[9px] text-formula-mist"
          style={{ minHeight: totalPx + 28 }}
        >
          <div className="h-7 border-b border-formula-frost/10" />
          {hours.map(h => (
            <div
              key={h}
              className="border-b border-formula-frost/8 text-right pr-1"
              style={{ height: PX_PER_HOUR }}
            >
              {h > 12 ? h - 12 : h === 0 ? 12 : h}
              {h >= 12 ? 'p' : 'a'}
            </div>
          ))}
        </div>

        {([0, 1, 2, 3, 4, 5, 6] as const).map(d => {
          const di = d as DayIndex
          const iso = isoDateForWeekDay(weekStart, di)
          const dayBlocks = byDay.get(di) ?? []
          return (
            <div
              key={d}
              className="relative min-w-[104px] flex-1 border-r border-formula-frost/10 last:border-r-0"
              style={{ minHeight: totalPx + 28 }}
            >
              <div className="sticky top-0 z-[5] border-b border-formula-frost/12 bg-formula-deep/50 px-1 py-1 text-center font-mono text-[9px] font-bold uppercase text-formula-paper">
                <div>{DAY_LABELS[di]}</div>
                <div className="text-[8px] font-normal text-formula-mist">{iso.slice(5)}</div>
              </div>
              <div className="relative" style={{ height: totalPx }}>
                {hours.map(h => (
                  <div
                    key={h}
                    className="border-b border-formula-frost/[0.06]"
                    style={{ height: PX_PER_HOUR }}
                  />
                ))}
                {dayBlocks.map(b => {
                  const topMin = Math.max(DISPLAY_START, b.startMinute)
                  const botMin = Math.min(DISPLAY_END, b.endMinute)
                  if (botMin <= topMin) return null
                  const top = ((topMin - DISPLAY_START) / 60) * PX_PER_HOUR
                  const h = Math.max(18, ((botMin - topMin) / 60) * PX_PER_HOUR)
                  return (
                    <div
                      key={b.id}
                      className={cn(
                        'absolute left-0.5 right-0.5 overflow-hidden rounded-sm border px-1 py-0.5 text-[8px] font-semibold leading-tight shadow-sm',
                        categoryStyle(b.category)
                      )}
                      style={{ top, height: h }}
                      title={`${b.label}${b.sublabel ? ` · ${b.sublabel}` : ''}`}
                    >
                      <span className="line-clamp-3">{b.label}</span>
                      <span className="block font-mono text-[7px] font-normal opacity-90">
                        {formatHm(b.startMinute)}–{formatHm(b.endMinute)}
                      </span>
                    </div>
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
