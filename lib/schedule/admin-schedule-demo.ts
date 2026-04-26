import type { GeneratedWeek, ScheduleSlot } from '@/types/schedule'
import { SCHEDULE_ASSETS } from '@/lib/schedule/assets'
import { LITTLES_BLOCK_CAPACITY, YOUTH_BLOCK_CAPACITY } from '@/lib/schedule/rules'

export function stableInt(seed: string, lo: number, hi: number): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  const span = hi - lo + 1
  return lo + (h % span)
}

/** Stable roster / capacity key for admin views (one logical bookable block). */
export function getAdminBlockKey(slot: ScheduleSlot): string | null {
  if (slot.youthBlockId) return slot.youthBlockId
  if (slot.kind === 'preschool' && slot.assetId === 'performance-center') {
  return `preschool-${slot.dayIndex}`
  }
  if (slot.kind === 'open_gym' && slot.assetId === 'gym') {
  return `open-gym-${slot.dayIndex}-${slot.startMinute}`
  }
  return null
}

function isAnchorSlot(slot: ScheduleSlot): boolean {
  const key = getAdminBlockKey(slot)
  if (!key) return false
  if (slot.kind === 'open_gym') return slot.assetId === 'gym'
  if (slot.kind === 'preschool') return slot.assetId === 'performance-center'
  if (slot.youthBlockId?.startsWith('gym-')) return slot.assetId === 'gym'
  return slot.assetId === 'performance-center' && slot.stationIndex == null
}

/** One representative slot per bookable block for the week (roster / weekly tab). */
export function listWeeklyBookableAnchors(week: GeneratedWeek): ScheduleSlot[] {
  const seen = new Set<string>()
  const out: ScheduleSlot[] = []
  for (const s of week.slots) {
  const key = getAdminBlockKey(s)
  if (!key || seen.has(key)) continue
  if (!isAnchorSlot(s)) continue
  seen.add(key)
  out.push(s)
  }
  out.sort((a, b) => a.dayIndex - b.dayIndex || a.startMinute - b.startMinute || a.id.localeCompare(b.id))
  return out
}

export type AdminRosterPlayerDemo = {
  rosterId: string
  name: string
  checkedInDefault: boolean
}

export type AdminBlockDemoMeta = {
  blockKey: string
  capacity: number
  enrolled: number
  soldOut: boolean
  players: AdminRosterPlayerDemo[]
}

export function buildAdminBlockDemo(weekStart: string, anchor: ScheduleSlot): AdminBlockDemoMeta {
  const blockKey = getAdminBlockKey(anchor)!
  const seed = `${weekStart}|${blockKey}`

  const capacity =
    anchor.kind === 'open_gym'
      ? 24
      : anchor.kind === 'preschool'
        ? 16
        : anchor.kind === 'littles'
          ? LITTLES_BLOCK_CAPACITY
          : YOUTH_BLOCK_CAPACITY
  const enrolled = 0
  const soldOut = false
  const players: AdminRosterPlayerDemo[] = []

  return { blockKey, capacity, enrolled, soldOut, players }
}

export function buildAdminBlockMap(week: GeneratedWeek): Map<string, AdminBlockDemoMeta> {
  const map = new Map<string, AdminBlockDemoMeta>()
  for (const anchor of listWeeklyBookableAnchors(week)) {
  const meta = buildAdminBlockDemo(week.weekStart, anchor)
  map.set(meta.blockKey, meta)
  }
  return map
}

export function assetLabelForSlot(slot: ScheduleSlot): string {
  return SCHEDULE_ASSETS.find(a => a.id === slot.assetId)?.label ?? slot.assetId
}

/** Local calendar instant for this slot in the facility week (weekStart = Sunday ISO date). */
export function getSlotOccurrenceDate(weekStart: string, slot: ScheduleSlot, edge: 'start' | 'end'): Date {
  const sun = new Date(`${weekStart}T12:00:00`)
  const d = new Date(sun)
  d.setDate(sun.getDate() + slot.dayIndex)
  const minute = edge === 'start' ? slot.startMinute : slot.endMinute
  const h = Math.floor(minute / 60)
  const m = minute % 60
  d.setHours(h, m, 0, 0)
  return d
}

/**
 * `upcoming` - before block start (roster only).
 * `live` - block in progress (show check-in like attendance).
 * `ended` - after block end (audit who was in / not in).
 */
export function scheduleSlotCheckInPhase(
  weekStart: string,
  slot: ScheduleSlot,
  now: Date = new Date()
): 'upcoming' | 'live' | 'ended' {
  const start = getSlotOccurrenceDate(weekStart, slot, 'start')
  const end = getSlotOccurrenceDate(weekStart, slot, 'end')
  if (now.getTime() < start.getTime()) return 'upcoming'
  if (now.getTime() <= end.getTime()) return 'live'
  return 'ended'
}
