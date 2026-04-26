import type { BookableYouthSlot, DayIndex, GeneratedWeek, ScheduleAgeBand, ScheduleSlot } from '@/types/schedule'
import { scheduleSlotMatchesChildBand } from '@/lib/schedule/age-map'
import { MINIS_BLOCK_CAPACITY, YOUTH_BLOCK_CAPACITY } from '@/lib/schedule/rules'

/**
 * One bookable row per youth block (Performance Center anchor only, system-generated roster).
 * @param enrollmentBySlotRef — counts from `parent_block_bookings` keyed by bookable id (`book-${youthBlockId}`); omit for zeros.
 */
export function getBookableYouthSlots(
  week: GeneratedWeek,
  band: ScheduleAgeBand | null,
  enrollmentBySlotRef?: ReadonlyMap<string, number>
): BookableYouthSlot[] {
  if (!band) return []
  const anchors = week.slots.filter(
    (s): s is ScheduleSlot & { youthBlockId: string } =>
      s.assetId === 'performance-center' &&
      !!s.youthBlockId &&
      scheduleSlotMatchesChildBand(s, band, ['youth_training', 'littles', 'preschool'])
  )
  const seen = new Set<string>()
  const out: BookableYouthSlot[] = []
  for (const s of anchors) {
    if (seen.has(s.youthBlockId)) continue
    seen.add(s.youthBlockId)
    const bookId = `book-${s.youthBlockId}`
    const cap = s.kind === 'littles' ? MINIS_BLOCK_CAPACITY : YOUTH_BLOCK_CAPACITY
    const enrolled = Math.min(cap, enrollmentBySlotRef?.get(bookId) ?? 0)
    out.push({
      id: bookId,
      youthBlockId: s.youthBlockId,
      dayIndex: s.dayIndex as DayIndex,
      weekStart: week.weekStart,
      startMinute: s.startMinute,
      endMinute: s.endMinute,
      ageBand: band,
      label: s.label.split(' // ')[0] ?? s.label,
      capacity: cap,
      enrolled,
    })
  }
  return out.sort((a, b) => a.dayIndex - b.dayIndex || a.startMinute - b.startMinute)
}
