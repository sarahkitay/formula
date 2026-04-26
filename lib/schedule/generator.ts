import type {
  DayIndex,
  GeneratedMultiWeek,
  GeneratedWeek,
  ScheduleOverride,
  ScheduleProgramKind,
  ScheduleSlot,
} from '@/types/schedule'
import { SCHEDULE_ASSETS, STATION_ASSET_IDS } from '@/lib/schedule/assets'
import { getYouthBlocksForDay } from '@/lib/schedule/templates'
import { SCHEDULE_DAY_END_MINUTE, SCHEDULE_DAY_START_MINUTE } from '@/lib/schedule/rules'

const FIELD_IDS = ['field-1', 'field-2', 'field-3'] as const

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

export function toISODateLocal(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Normalize to Sunday 00:00 local (dayIndex 0 = Sunday) */
export function startOfScheduleWeek(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  const sun = new Date(x)
  sun.setDate(x.getDate() - x.getDay())
  return sun
}

let slotSeq = 0
function nextSlotId(): string {
  slotSeq += 1
  return `gen-${slotSeq}`
}

function add(
  slots: ScheduleSlot[],
  partial: Omit<ScheduleSlot, 'id'> & { id?: string }
): void {
  slots.push({
    id: partial.id ?? nextSlotId(),
    assetId: partial.assetId,
    dayIndex: partial.dayIndex,
    startMinute: partial.startMinute,
    endMinute: partial.endMinute,
    kind: partial.kind,
    label: partial.label,
    ageBand: partial.ageBand,
    youthBlockId: partial.youthBlockId,
    stationIndex: partial.stationIndex,
  })
}

function isWeekday(d: DayIndex): boolean {
  return d >= 1 && d <= 5
}

function isWeekend(d: DayIndex): boolean {
  return d === 0 || d === 6
}

/** Mon–Fri preschool on Performance Center */
function pushPreschool(slots: ScheduleSlot[], day: DayIndex) {
  if (!isWeekday(day)) return
  add(slots, {
    assetId: 'performance-center',
    dayIndex: day,
    startMinute: 9 * 60,
    endMinute: 11 * 60,
    kind: 'preschool',
    label: 'Pre-school programming // 4-5',
    ageBand: '4-5',
  })
}

/** Littles (U6): Mon / Wed / Fri, 10:00–10:30 and 10:45–11:15 on Performance Center */
function pushLittles(slots: ScheduleSlot[], day: DayIndex) {
  if (day !== 1 && day !== 3 && day !== 5) return
  const dayTag = day === 1 ? 'mon' : day === 3 ? 'wed' : 'fri'
  add(slots, {
    assetId: 'performance-center',
    dayIndex: day,
    startMinute: 10 * 60,
    endMinute: 10 * 60 + 30,
    kind: 'littles',
    label: 'Littles // 10:00–10:30 · U6',
    ageBand: '4-5',
    youthBlockId: `littles-${dayTag}-600`,
  })
  add(slots, {
    assetId: 'performance-center',
    dayIndex: day,
    startMinute: 10 * 60 + 45,
    endMinute: 11 * 60 + 15,
    kind: 'littles',
    label: 'Littles // 10:45–11:15 · U6',
    ageBand: '4-5',
    youthBlockId: `littles-${dayTag}-645`,
  })
}

/** Youth rotation: Performance Center hub + 4 active stations (no idle station) */
function pushYouthDay(slots: ScheduleSlot[], day: DayIndex) {
  const blocks = getYouthBlocksForDay(day)
  blocks.forEach((b, idx) => {
    const youthBlockId = `youth-${day}-${b.ageBand}-${b.startMinute}-${idx}`
    const rotation =
      'Rot A: S1→S2 · B: S2→S1 · C: S3→S4 · D: S4→S3 · up to 6 athletes / 4 stations'

    add(slots, {
      assetId: 'performance-center',
      dayIndex: day,
      startMinute: b.startMinute,
      endMinute: b.endMinute,
      kind: 'youth_training',
      label: `Youth ${b.ageBand} // ${rotation}`,
      ageBand: b.ageBand,
      youthBlockId,
    })

    STATION_ASSET_IDS.forEach((assetId, si) => {
      add(slots, {
        assetId,
        dayIndex: day,
        startMinute: b.startMinute,
        endMinute: b.endMinute,
        kind: 'youth_training',
        label: `Station ${si + 1} // ${b.ageBand}`,
        ageBand: b.ageBand,
        youthBlockId,
        stationIndex: (si + 1) as 1 | 2 | 3 | 4,
      })
    })
  })
}

/** Fields: non-premium 9–14 weekdays; premium 15–21; Tue/Thu 21–22:30 pickup; Fri eve game circuit; weekend league 18–22 */
function pushFieldRevenue(slots: ScheduleSlot[], day: DayIndex) {
  for (const fid of FIELD_IDS) {
    if (isWeekday(day)) {
      add(slots, {
        assetId: fid,
        dayIndex: day,
        startMinute: 9 * 60,
        endMinute: 14 * 60,
        kind: 'field_rental_nonpremium',
        label: 'Non-premium rental // 9a–2p',
      })
      const premiumEnd = 21 * 60
      let premiumStart = 15 * 60
      if (day === 5) {
        add(slots, {
          assetId: fid,
          dayIndex: day,
          startMinute: 18 * 60,
          endMinute: premiumEnd,
          kind: 'youth_game_circuit',
          label: 'Youth game circuit // fields',
        })
        add(slots, {
          assetId: fid,
          dayIndex: day,
          startMinute: premiumStart,
          endMinute: 18 * 60,
          kind: 'field_rental_premium',
          label: 'Premium rental // 3–6p',
        })
      } else {
        add(slots, {
          assetId: fid,
          dayIndex: day,
          startMinute: premiumStart,
          endMinute: premiumEnd,
          kind: 'field_rental_premium',
          label: 'Premium rental // 3–9p',
        })
      }
      if (day === 2 || day === 4) {
        add(slots, {
          assetId: fid,
          dayIndex: day,
          startMinute: 21 * 60,
          endMinute: 22 * 60 + 30,
          kind: 'adult_pickup',
          label: 'Adult pickup // Tue/Thu',
        })
      }
    } else if (isWeekend(day)) {
      add(slots, {
        assetId: fid,
        dayIndex: day,
        startMinute: 9 * 60,
        endMinute: 18 * 60,
        kind: 'field_rental_nonpremium',
        label: 'Weekend daytime // rental / clinic block',
      })
      add(slots, {
        assetId: fid,
        dayIndex: day,
        startMinute: 18 * 60,
        endMinute: 22 * 60,
        kind: 'adult_league',
        label: 'Adult league // all fields · 6–10p',
      })
    }
  }
}

/** Party room: weekend fixed 2h */
function pushPartyRoom(slots: ScheduleSlot[], day: DayIndex) {
  if (!isWeekend(day)) return
  const windows = [
    [10 * 60, 12 * 60],
    [12 * 60, 14 * 60],
    [14 * 60, 16 * 60],
    [16 * 60, 18 * 60],
  ] as const
  windows.forEach(([a, b], i) => {
    add(slots, {
      assetId: 'party-room',
      dayIndex: day,
      startMinute: a,
      endMinute: b,
      kind: 'party',
      label: `Party slot ${i + 1} // 2h hold`,
    })
  })
}

/** Flex: Tue/Thu clinics (bi-weekly by weekIndex), Fri film, Sat intensive */
function pushFlex(slots: ScheduleSlot[], day: DayIndex, weekIndex: number) {
  if (day === 2 || day === 4) {
    if (weekIndex % 2 === 0) {
      add(slots, {
        assetId: 'flex-room',
        dayIndex: day,
        startMinute: 14 * 60,
        endMinute: 16 * 60,
        kind: 'clinic',
        label: 'Bi-weekly clinic // Flex',
      })
    } else {
      add(slots, {
        assetId: 'flex-room',
        dayIndex: day,
        startMinute: 14 * 60,
        endMinute: 16 * 60,
        kind: 'flex_ops',
        label: 'Flex ops / hold',
      })
    }
  }
  if (day === 5) {
    add(slots, {
      assetId: 'flex-room',
      dayIndex: day,
      startMinute: 19 * 60,
      endMinute: 21 * 60,
      kind: 'flex_film',
      label: 'Film review // Fri',
    })
  }
  if (day === 6) {
    add(slots, {
      assetId: 'flex-room',
      dayIndex: day,
      startMinute: 9 * 60,
      endMinute: 13 * 60,
      kind: 'clinic',
      label: 'Intensive clinic // Sat',
    })
  }
}

/** Gym: morning open, 3–5p S&C, evenings youth rotation older tiers */
function pushGym(slots: ScheduleSlot[], day: DayIndex) {
  if (day === 0) return
  add(slots, {
    assetId: 'gym',
    dayIndex: day,
    startMinute: 7 * 60,
    endMinute: 9 * 60,
    kind: 'open_gym',
    label: 'Open gym // morning',
  })
  if (isWeekday(day)) {
    add(slots, {
      assetId: 'gym',
      dayIndex: day,
      startMinute: 15 * 60,
      endMinute: 17 * 60,
      kind: 'strength_conditioning',
      label: 'S&C // 3–5p',
    })
  }
  const blocks = getYouthBlocksForDay(day).filter(
    b => b.ageBand === '12-14' || b.ageBand === '15-19'
  )
  blocks.forEach((b, idx) => {
    add(slots, {
      assetId: 'gym',
      dayIndex: day,
      startMinute: b.startMinute,
      endMinute: b.endMinute,
      kind: 'youth_training',
      label: `Gym rotation // ${b.ageBand} (older tier)`,
      ageBand: b.ageBand,
      youthBlockId: `gym-${day}-${b.ageBand}-${b.startMinute}-${idx}`,
    })
  })
}

/** Fill unused gaps on each asset with light gray (optional visual); skip to avoid clutter */

function buildWeekSlots(weekIndex: number): ScheduleSlot[] {
  const slots: ScheduleSlot[] = []
  for (let d = 0; d < 7; d++) {
    const day = d as DayIndex
    pushFieldRevenue(slots, day)
    pushPreschool(slots, day)
    pushLittles(slots, day)
    pushYouthDay(slots, day)
    pushPartyRoom(slots, day)
    pushFlex(slots, day, weekIndex)
    pushGym(slots, day)
  }
  return slots
}

function applyOverrides(slots: ScheduleSlot[], overrides: ScheduleOverride[]): ScheduleSlot[] {
  if (!overrides.length) return slots
  let next = [...slots]
  for (const o of overrides) {
    const day = new Date(o.date + 'T12:00:00').getDay() as DayIndex
    const mode = o.mode ?? 'replace'
    next = next.filter(
      s =>
        !(
          s.assetId === o.assetId &&
          s.dayIndex === day &&
          s.startMinute < o.endMinute &&
          s.endMinute > o.startMinute
        )
    )
    if (mode === 'clear') continue
    add(next, {
      assetId: o.assetId,
      dayIndex: day,
      startMinute: o.startMinute,
      endMinute: o.endMinute,
      kind: o.kind,
      label: o.label,
      id: `ov-${o.id}`,
      ageBand: o.ageBand,
      youthBlockId: o.youthBlockId,
    })
  }
  return next
}

export function isoDateForWeekDay(weekStart: string, dayIndex: DayIndex): string {
  const sun = new Date(`${weekStart}T12:00:00`)
  const d = new Date(sun)
  d.setDate(sun.getDate() + dayIndex)
  return toISODateLocal(d)
}

export function applyBlockedDates(week: GeneratedWeek, blockedDates: string[]): GeneratedWeek {
  if (!blockedDates.length) return week
  const blocked = new Set(blockedDates)
  return {
    ...week,
    slots: week.slots.filter(s => !blocked.has(isoDateForWeekDay(week.weekStart, s.dayIndex))),
  }
}

export function generateWeeklySchedule(
  weekStartInput: Date,
  overrides: ScheduleOverride[] = [],
  weekIndexInCycle = 0
): GeneratedWeek {
  slotSeq = 0
  const sun = startOfScheduleWeek(weekStartInput)
  const sat = new Date(sun)
  sat.setDate(sun.getDate() + 6)
  let slots = buildWeekSlots(weekIndexInCycle)
  slots = applyOverrides(slots, overrides)
  return {
    weekStart: toISODateLocal(sun),
    weekEnd: toISODateLocal(sat),
    slots,
  }
}

export function generate12WeekCycle(
  weekStartInput: Date,
  overrides: ScheduleOverride[] = [],
  blockedDates: string[] = []
): GeneratedMultiWeek {
  const sun = startOfScheduleWeek(weekStartInput)
  const weeks: GeneratedWeek[] = []
  for (let w = 0; w < 12; w++) {
    const d = new Date(sun)
    d.setDate(sun.getDate() + w * 7)
    let week = generateWeeklySchedule(d, overrides, w)
    week = applyBlockedDates(week, blockedDates)
    weeks.push(week)
  }
  return { weeks, overridesApplied: overrides.length }
}

export function slotsForDay(week: GeneratedWeek, dayIndex: DayIndex): ScheduleSlot[] {
  return week.slots.filter(s => s.dayIndex === dayIndex)
}

export { SCHEDULE_DAY_START_MINUTE, SCHEDULE_DAY_END_MINUTE }
