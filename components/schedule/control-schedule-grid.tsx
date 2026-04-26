'use client'

import * as React from 'react'
import type { DayIndex, GeneratedWeek, ScheduleAgeBand, ScheduleProgramKind, ScheduleSlot } from '@/types/schedule'
import { scheduleSlotMatchesChildBand } from '@/lib/schedule/age-map'
import { SCHEDULE_ASSETS } from '@/lib/schedule/assets'
import { PROGRAM_UI, SCHEDULE_DAY_END_MINUTE, SCHEDULE_DAY_START_MINUTE } from '@/lib/schedule/rules'
import { cn } from '@/lib/utils'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const PX_PER_MIN = 0.78
const RANGE = SCHEDULE_DAY_END_MINUTE - SCHEDULE_DAY_START_MINUTE
const TRACK_WIDTH = RANGE * PX_PER_MIN

function formatMinute(m: number): string {
  const h = Math.floor(m / 60)
  const min = m % 60
  const am = h >= 12 ? 'p' : 'a'
  const hr = h > 12 ? h - 12 : h === 0 ? 12 : h
  return min === 0 ? `${hr}${am}` : `${hr}:${min.toString().padStart(2, '0')}${am}`
}

function slotStyle(
  s: ScheduleSlot,
  opts?: { neutral?: boolean; emphasizeGreen?: boolean; clickable?: boolean; soldOut?: boolean }
): React.CSSProperties {
  const ui = PROGRAM_UI[s.kind]
  const neutral = opts?.neutral === true
  const emphasizeGreen = opts?.emphasizeGreen === true
  const soldOut = opts?.soldOut === true
  const left = (s.startMinute - SCHEDULE_DAY_START_MINUTE) * PX_PER_MIN
  const w = (s.endMinute - s.startMinute) * PX_PER_MIN
  return {
    left,
    width: Math.max(w, 2),
    backgroundColor: emphasizeGreen ? 'rgb(0 87 0 / 0.9)' : neutral ? 'rgb(42 58 54 / 0.88)' : ui.bg,
    borderColor: emphasizeGreen ? 'rgb(0 87 0)' : neutral ? 'rgb(100 120 115 / 0.55)' : ui.border,
    color: emphasizeGreen ? '#ffffff' : neutral ? 'rgb(220 230 225)' : ui.text,
    borderWidth: soldOut ? 2 : 1,
    borderStyle: 'solid',
    boxShadow: soldOut ? 'inset 0 0 0 1px rgb(254 202 202)' : undefined,
    cursor: opts?.clickable ? 'pointer' : 'default',
  }
}

function simplifiedSlotLabel(s: ScheduleSlot): string {
  if ((s.kind === 'youth_training' || s.kind === 'preschool' || s.kind === 'littles') && s.ageBand) {
    return s.kind === 'littles' ? 'Minis' : 'Youth'
  }
  return s.label
}

function slotSecondRowLabel(s: ScheduleSlot): string | null {
  if ((s.kind === 'youth_training' || s.kind === 'preschool' || s.kind === 'littles') && s.ageBand) {
    return s.kind === 'littles' ? `${s.ageBand} · Minis` : s.ageBand
  }
  return null
}

export interface ControlScheduleGridProps {
  week: GeneratedWeek
  dayIndex: DayIndex
  /** When set, only these asset ids are shown (parent portal) */
  assetFilter?: string[]
  /**
   * Parent portal: only show youth / preschool blocks whose `ageBand` matches this value
   * (same ages as labels, e.g. `Station 2 // 9-11`).
   */
  scheduleAgeBand?: ScheduleAgeBand
  /** Parent view: mute non-eligible slots, highlight eligible/open gym in green */
  parentMode?: boolean
  /** Optional click handler for slot blocks */
  onSlotClick?: (slot: ScheduleSlot) => void
  /** Optional per-slot click enablement */
  isSlotInteractive?: (slot: ScheduleSlot) => boolean
  /** Optional override label renderer */
  getSlotLabel?: (slot: ScheduleSlot) => string
  /** Admin: show booking / check-in counts on bookable blocks */
  adminSlotFill?: (slot: ScheduleSlot) => {
    capacity: number
    enrolled: number
    checkedIn: number
    soldOut: boolean
  } | null
  className?: string
}

export function ControlScheduleGrid({
  week,
  dayIndex,
  assetFilter,
  scheduleAgeBand,
  parentMode = false,
  onSlotClick,
  isSlotInteractive,
  getSlotLabel,
  adminSlotFill,
  className,
}: ControlScheduleGridProps) {
  const adminFillMode = adminSlotFill != null
  const assets = React.useMemo(
    () =>
      assetFilter?.length
        ? SCHEDULE_ASSETS.filter(a => assetFilter.includes(a.id))
        : SCHEDULE_ASSETS,
    [assetFilter]
  )

  const byAsset = React.useMemo(() => {
    const map = new Map<string, ScheduleSlot[]>()
    for (const a of assets) map.set(a.id, [])
    for (const s of week.slots) {
      if (s.dayIndex !== dayIndex) continue
      if (!map.has(s.assetId)) continue
      if (!parentMode && scheduleAgeBand != null && !scheduleSlotMatchesChildBand(s, scheduleAgeBand)) continue
      map.get(s.assetId)!.push(s)
    }
    for (const list of map.values()) list.sort((a, b) => a.startMinute - b.startMinute)
    return map
  }, [week.slots, dayIndex, assets, scheduleAgeBand, parentMode])

  const hours: number[] = []
  for (let h = Math.ceil(SCHEDULE_DAY_START_MINUTE / 60); h <= Math.floor(SCHEDULE_DAY_END_MINUTE / 60); h++) {
    hours.push(h)
  }

  const kindsUsed = React.useMemo(() => {
    const set = new Set<ScheduleProgramKind>()
    for (const s of week.slots) {
      if (s.dayIndex !== dayIndex) continue
      if (!parentMode && scheduleAgeBand != null && !scheduleSlotMatchesChildBand(s, scheduleAgeBand)) continue
      if (assetFilter?.length && !assetFilter.includes(s.assetId)) continue
      set.add(s.kind)
    }
    return [...set].sort()
  }, [week.slots, dayIndex, scheduleAgeBand, assetFilter, parentMode])

  return (
    <div
      className={cn(
        'border border-formula-frost/12 bg-formula-paper/[0.04] font-mono text-[10px] shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]',
        className
      )}
    >
      <div className="flex items-end border-b border-formula-frost/12 bg-formula-deep/35">
        <div className="w-[140px] shrink-0 border-r border-formula-frost/12 p-2 text-[9px] font-bold uppercase tracking-wider text-formula-mist">
          Asset \ Time
        </div>
        <div
          className="relative h-10 flex-1 overflow-hidden"
          style={{ minWidth: TRACK_WIDTH }}
        >
          {hours.map(h => {
            const minute = h * 60
            if (minute < SCHEDULE_DAY_START_MINUTE || minute > SCHEDULE_DAY_END_MINUTE) return null
            const left = (minute - SCHEDULE_DAY_START_MINUTE) * PX_PER_MIN
            return (
              <div
                key={h}
                className="absolute bottom-0 top-0 border-l border-formula-frost/10 text-[9px] text-formula-mist"
                style={{ left }}
              >
                <span className="ml-0.5 whitespace-nowrap pl-0.5">{formatMinute(minute)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {assets.map(asset => (
        <div key={asset.id} className="flex border-b border-formula-frost/10 last:border-b-0">
          <div className="flex w-[140px] shrink-0 items-center border-r border-formula-frost/12 bg-formula-paper/[0.06] px-2 py-1.5 text-[10px] font-bold uppercase leading-tight text-formula-paper">
            {asset.label}
          </div>
          <div
            className={cn(
              'relative flex-1 bg-formula-deep/20',
              adminFillMode ? 'min-h-[4.25rem]' : 'h-14'
            )}
            style={{ minWidth: TRACK_WIDTH }}
          >
            {byAsset.get(asset.id)?.map(s => {
              const fill = adminSlotFill?.(s) ?? null
              const canClick = !!onSlotClick && (isSlotInteractive ? isSlotInteractive(s) : true)
              return (
                <div
                  key={s.id}
                  role={canClick ? 'button' : undefined}
                  tabIndex={canClick ? 0 : undefined}
                  onClick={canClick ? () => onSlotClick(s) : undefined}
                  onKeyDown={
                    canClick
                      ? e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            onSlotClick(s)
                          }
                        }
                      : undefined
                  }
                  className={cn(
                    'absolute top-1 bottom-1 flex items-center overflow-hidden px-1.5 text-[10px] font-bold uppercase leading-none',
                    canClick &&
                      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-formula-volt'
                  )}
                  style={slotStyle(s, {
                    neutral: parentMode,
                    emphasizeGreen:
                      parentMode &&
                      (s.kind === 'open_gym' ||
                        (scheduleAgeBand != null && scheduleSlotMatchesChildBand(s, scheduleAgeBand))),
                    clickable: canClick,
                    soldOut: fill?.soldOut === true,
                  })}
                  title={`${(getSlotLabel ?? simplifiedSlotLabel)(s)} · ${formatMinute(s.startMinute)}–${formatMinute(s.endMinute)}`}
                >
                  <div className="relative w-full text-center leading-none">
                    {fill?.soldOut && (
                      <span className="absolute right-0 top-0 z-[1] bg-red-800 px-0.5 text-[6px] font-bold leading-none text-white">
                        FULL
                      </span>
                    )}
                    <div className="truncate">{(getSlotLabel ?? simplifiedSlotLabel)(s)}</div>
                    {slotSecondRowLabel(s) && (
                      <div className="mt-0.5 whitespace-nowrap text-[9px] font-bold">{slotSecondRowLabel(s)}</div>
                    )}
                    {fill && (
                      <div
                        className={cn(
                          'mt-1 font-mono text-[7px] font-bold normal-case leading-tight tracking-tight',
                          parentMode
                            ? 'text-formula-frost/90'
                            : 'text-white/95 drop-shadow-[0_1px_1px_rgb(0_0_0_/_0.5)]'
                        )}
                      >
                        <span>
                          {fill.checkedIn}/{fill.enrolled} in
                        </span>
                        <span className="mx-0.5 opacity-60">
                          ·
                        </span>
                        <span>
                          {fill.enrolled}/{fill.capacity}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <div className="border-t border-formula-frost/12 bg-formula-deep/35 p-3">
        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-formula-mist">Program legend</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {kindsUsed.map(k => (
            <div key={k} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 shrink-0 border border-formula-frost/25"
                style={{
                  backgroundColor:
                    parentMode
                      ? k === 'open_gym' ||
                          (scheduleAgeBand != null && (k === 'youth_training' || k === 'preschool' || k === 'littles'))
                        ? 'rgb(0 87 0 / 0.9)'
                        : 'rgb(42 58 54 / 0.9)'
                      : PROGRAM_UI[k].bg,
                }}
              />
              <span className="text-[9px] text-formula-frost/85">{PROGRAM_UI[k].key}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="border-t border-formula-frost/12 px-3 py-2 text-[9px] text-formula-mist">
        {DAY_LABELS[dayIndex]} · Week of {week.weekStart}: pre-generated facility program (read-only)
        {scheduleAgeBand != null && !parentMode && (
          <span className="mt-1 block font-bold text-formula-volt">
            Showing only {scheduleAgeBand} youth / preschool / Formula Minis blocks (matches your athlete&apos;s training band).
          </span>
        )}
        {scheduleAgeBand != null && parentMode && (
          <span className="mt-1 block font-bold text-formula-volt">
            Green highlights Open Gym + {scheduleAgeBand} slots your athlete can attend.
          </span>
        )}
        {adminFillMode && (
          <span className="mt-1 block font-bold text-red-800">
            Red border + FULL = sold out. Counts are demo roster data (enrolled / capacity · checked in / enrolled).
          </span>
        )}
      </p>
    </div>
  )
}

export { DAY_LABELS }
