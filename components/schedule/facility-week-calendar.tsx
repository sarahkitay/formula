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

/** Native tooltip: full label + details (line breaks show in many browsers). */
function calendarBlockHoverTitle(b: CalendarFeedBlock): string {
  const time = `${formatHm(b.startMinute)} – ${formatHm(b.endMinute)}`
  return [b.label.trim(), b.sublabel?.trim(), time].filter(Boolean).join('\n')
}

const SNAP_MIN = 15

export interface FacilityWeekCalendarProps {
  weekStart: string
  blocks: CalendarFeedBlock[]
  /** YYYY-MM-DD → holiday label (US major holidays) for column tint + header */
  holidayLabelsByYmd?: Record<string, string>
  /** Used to resolve program slot clicks (`slot-*` ids). */
  week: GeneratedWeek | null
  onProgramSlotClick?: (slot: ScheduleSlot, opts?: { relatedSlots: ScheduleSlot[] }) => void
  /** Assessments, rentals, agreements, etc. */
  onFeedBlockClick?: (block: CalendarFeedBlock) => void
  /** Empty grid — adds a draft override (parent wires save + tab switch). */
  onEmptySlotClick?: (payload: { dayIndex: DayIndex; startMinute: number; endMinute: number }) => void
  /** Vertical drag on field-rental booking blocks commits new wall times (minutes from midnight). */
  onRentalBookingTimeCommit?: (payload: { bookingId: string; startMinute: number; endMinute: number }) => void | Promise<void>
}

export function FacilityWeekCalendar({
  weekStart,
  blocks,
  holidayLabelsByYmd,
  week,
  onProgramSlotClick,
  onFeedBlockClick,
  onEmptySlotClick,
  onRentalBookingTimeCommit,
}: FacilityWeekCalendarProps) {
  const [draftDeltaMin, setDraftDeltaMin] = React.useState<Record<string, number>>({})
  const dragRef = React.useRef<{
    blockId: string
    bookingId: string
    baseStart: number
    baseEnd: number
    pointerId: number
    startClientY: number
  } | null>(null)
  const movedPxRef = React.useRef(0)

  const hours = React.useMemo(() => {
    const out: number[] = []
    for (let h = Math.floor(CAL_DISPLAY_START / 60); h <= Math.floor(CAL_DISPLAY_END / 60); h++) out.push(h)
    return out
  }, [])

  const totalPx = ((CAL_DISPLAY_END - CAL_DISPLAY_START) / 60) * CAL_PX_PER_HOUR

  const hasHolidayThisWeek = React.useMemo(() => {
    if (!holidayLabelsByYmd || Object.keys(holidayLabelsByYmd).length === 0) return false
    for (let d = 0; d < 7; d++) {
      const iso = isoDateForWeekDay(weekStart, d as DayIndex)
      if (holidayLabelsByYmd[iso]) return true
    }
    return false
  }, [weekStart, holidayLabelsByYmd])

  const blocksWithDraft = React.useMemo(() => {
    return blocks.map(b => {
      const dm = draftDeltaMin[b.id]
      if (dm == null) return b
      const dur = b.endMinute - b.startMinute
      let ns = b.startMinute + dm
      ns = Math.round(ns / SNAP_MIN) * SNAP_MIN
      ns = Math.max(CAL_DISPLAY_START, Math.min(CAL_DISPLAY_END - dur, ns))
      return { ...b, startMinute: ns, endMinute: ns + dur }
    })
  }, [blocks, draftDeltaMin])

  const byDay = React.useMemo(() => {
    const m = new Map<DayIndex, CalendarFeedBlock[]>()
    for (let d = 0; d < 7; d++) m.set(d as DayIndex, [])
    for (const b of blocksWithDraft) {
      const list = m.get(b.dayIndex) ?? []
      list.push(b)
      m.set(b.dayIndex, list)
    }
    for (const list of m.values()) {
      list.sort((a, b) => a.startMinute - b.startMinute)
    }
    return m
  }, [blocksWithDraft])

  const laidOutByDay = React.useMemo(() => {
    const m = new Map<DayIndex, LaidOutCalendarBlock[]>()
    for (let d = 0; d < 7; d++) {
      const di = d as DayIndex
      m.set(di, layoutCalendarBlocksForDay(byDay.get(di) ?? []))
    }
    return m
  }, [byDay])

  const handleBlockActivate = (b: CalendarFeedBlock) => {
    if (week && b.programSlotIds?.length) {
      const slots = b.programSlotIds
        .map(id => week.slots.find(s => s.id === id))
        .filter((s): s is ScheduleSlot => s != null)
      if (slots[0]) {
        onProgramSlotClick?.(slots[0]!, { relatedSlots: slots })
        return
      }
    }
    if (b.id.startsWith('slot-') && !b.id.startsWith('slot-group-') && week) {
      const sid = b.id.slice('slot-'.length)
      const slot = week.slots.find(s => s.id === sid)
      if (slot) {
        onProgramSlotClick?.(slot)
        return
      }
    }
    onFeedBlockClick?.(b)
  }

  async function endRentalDrag(e: React.PointerEvent, b: CalendarFeedBlock, kind: 'tap' | 'drag-end' | 'cancel') {
    const d = dragRef.current
    dragRef.current = null
    setDraftDeltaMin(prev => {
      const n = { ...prev }
      delete n[b.id]
      return n
    })
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      /* noop */
    }
    if (kind === 'tap') {
      handleBlockActivate(b)
      return
    }
    if (kind === 'cancel') return
    if (d && onRentalBookingTimeCommit) {
      const dur = d.baseEnd - d.baseStart
      const dy = e.clientY - d.startClientY
      const deltaMin = (dy / CAL_PX_PER_HOUR) * 60
      let newStart = d.baseStart + deltaMin
      newStart = Math.round(newStart / SNAP_MIN) * SNAP_MIN
      newStart = Math.max(CAL_DISPLAY_START, Math.min(CAL_DISPLAY_END - dur, newStart))
      const newEnd = newStart + dur
      try {
        await onRentalBookingTimeCommit({
          bookingId: d.bookingId,
          startMinute: newStart,
          endMinute: newEnd,
        })
      } catch (err) {
        window.alert(err instanceof Error ? err.message : 'Could not update rental time')
      }
    }
  }

  const handleRentalPointerDown = (e: React.PointerEvent, b: CalendarFeedBlock) => {
    if (b.category !== 'rental_booking' || !b.rentalBookingId || !onRentalBookingTimeCommit) return
    if (e.button !== 0) return
    movedPxRef.current = 0
    const base = blocks.find(x => x.id === b.id) ?? b
    dragRef.current = {
      blockId: b.id,
      bookingId: b.rentalBookingId,
      baseStart: base.startMinute,
      baseEnd: base.endMinute,
      pointerId: e.pointerId,
      startClientY: e.clientY,
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handleRentalPointerMove = (e: React.PointerEvent, b: CalendarFeedBlock) => {
    const d = dragRef.current
    if (!d || d.blockId !== b.id || e.pointerId !== d.pointerId) return
    movedPxRef.current += Math.abs(e.movementY)
    const dy = e.clientY - d.startClientY
    const deltaMin = (dy / CAL_PX_PER_HOUR) * 60
    setDraftDeltaMin(prev => ({ ...prev, [b.id]: deltaMin }))
  }

  const handleRentalPointerUp = (e: React.PointerEvent, b: CalendarFeedBlock) => {
    const d = dragRef.current
    if (!d || d.blockId !== b.id || e.pointerId !== d.pointerId) return
    const tap = movedPxRef.current < 10
    void endRentalDrag(e, b, tap ? 'tap' : 'drag-end')
  }

  const handleRentalPointerCancel = (e: React.PointerEvent, b: CalendarFeedBlock) => {
    const d = dragRef.current
    if (!d || d.blockId !== b.id || e.pointerId !== d.pointerId) return
    void endRentalDrag(e, b, 'cancel')
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
        <div className="font-mono text-[10px] text-formula-mist">
          <p>
            Week of {weekStart} · Los Angeles wall time · program + assessments + rentals + parties · overlapping blocks
            are split horizontally; click a block for details or empty space to add an override.
          </p>
          {hasHolidayThisWeek ? (
            <p className="mt-1 flex items-center gap-2 text-rose-200/95">
              <span
                className="h-2 w-2 shrink-0 rounded-sm border border-rose-400/45 bg-rose-950/55"
                aria-hidden
              />
              Rose column / header = US major holiday (federal-style observance + Easter, Christmas Eve, day after Thanksgiving).
            </p>
          ) : null}
          {onRentalBookingTimeCommit ? (
            <span className="mt-1 block text-formula-frost/85">
              Field rental holds: drag vertically to nudge start time (15-minute steps); short click still opens details.
            </span>
          ) : null}
        </div>
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
          const hol = holidayLabelsByYmd?.[iso]
          const dayBlocks = laidOutByDay.get(di) ?? []
          return (
            <div
              key={d}
              className={cn(
                'relative min-w-[104px] flex-1 border-r border-formula-frost/10 last:border-r-0',
                hol && 'bg-rose-950/[0.14]'
              )}
              style={{ minHeight: totalPx + 28 }}
            >
              <div
                className={cn(
                  'sticky top-0 z-[15] border-b px-1 py-1 text-center font-mono text-[9px] font-bold uppercase',
                  hol
                    ? 'border-rose-500/35 bg-rose-950/60 text-rose-50'
                    : 'border-formula-frost/12 bg-formula-deep/50 text-formula-paper'
                )}
              >
                <div>{DAY_LABELS[di]}</div>
                <div className={cn('text-[8px] font-normal', hol ? 'text-rose-100/85' : 'text-formula-mist')}>
                  {iso.slice(5)}
                </div>
                {hol ? (
                  <div className="mt-0.5 line-clamp-3 text-[7px] font-semibold normal-case leading-tight text-rose-100">
                    {hol}
                  </div>
                ) : null}
              </div>
              <div className="relative" style={{ height: totalPx }}>
                <div className="pointer-events-none absolute inset-0 z-0 flex flex-col">
                  {hours.map(h => (
                    <div
                      key={h}
                      className={cn('border-b border-formula-frost/[0.06]', hol && 'border-rose-500/[0.07]')}
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
                  const draggableRental =
                    b.category === 'rental_booking' && Boolean(b.rentalBookingId) && Boolean(onRentalBookingTimeCommit)
                  return (
                    <button
                      key={b.id}
                      type="button"
                      className={cn(
                        'absolute z-[2] overflow-hidden rounded-sm border px-1 py-0.5 text-left text-[8px] font-semibold leading-tight shadow-sm transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-formula-volt/50',
                        categoryStyle(b.category),
                        draggableRental && 'touch-none cursor-grab active:cursor-grabbing'
                      )}
                      style={{ top, height: h, left, width: w }}
                      title={calendarBlockHoverTitle(b)}
                      aria-label={`${b.label} ${formatHm(b.startMinute)} to ${formatHm(b.endMinute)}`}
                      onClick={e => {
                        e.stopPropagation()
                        if (!draggableRental) handleBlockActivate(b)
                      }}
                      onPointerDown={draggableRental ? e => handleRentalPointerDown(e, b) : undefined}
                      onPointerMove={draggableRental ? e => handleRentalPointerMove(e, b) : undefined}
                      onPointerUp={draggableRental ? e => void handleRentalPointerUp(e, b) : undefined}
                      onPointerCancel={draggableRental ? e => void handleRentalPointerCancel(e, b) : undefined}
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
