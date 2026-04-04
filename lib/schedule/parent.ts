import type { BookableYouthSlot, DayIndex, GeneratedWeek, ScheduleAgeBand, ScheduleSlot } from '@/types/schedule'
import { scheduleSlotMatchesChildBand } from '@/lib/schedule/age-map'
import { YOUTH_BLOCK_CAPACITY } from '@/lib/schedule/rules'

function hashEnrollment(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return h % 14
}

/**
 * One bookable row per youth block (Performance Center anchor only, system-generated roster).
 */
export function getBookableYouthSlots(week: GeneratedWeek, band: ScheduleAgeBand | null): BookableYouthSlot[] {
  if (!band) return []
  const anchors = week.slots.filter(
    (s): s is ScheduleSlot & { youthBlockId: string } =>
      s.assetId === 'performance-center' &&
      !!s.youthBlockId &&
      scheduleSlotMatchesChildBand(s, band, ['youth_training'])
  )
  const seen = new Set<string>()
  const out: BookableYouthSlot[] = []
  for (const s of anchors) {
    if (seen.has(s.youthBlockId)) continue
    seen.add(s.youthBlockId)
    const enrolled = hashEnrollment(s.youthBlockId)
    out.push({
      id: `book-${s.youthBlockId}`,
      youthBlockId: s.youthBlockId,
      dayIndex: s.dayIndex as DayIndex,
      weekStart: week.weekStart,
      startMinute: s.startMinute,
      endMinute: s.endMinute,
      ageBand: band,
      label: s.label.split(' // ')[0] ?? s.label,
      capacity: YOUTH_BLOCK_CAPACITY,
      enrolled,
    })
  }
  return out.sort((a, b) => a.dayIndex - b.dayIndex || a.startMinute - b.startMinute)
}
