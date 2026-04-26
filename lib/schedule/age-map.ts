import type { AgeGroup } from '@/types/player'
import type { ScheduleAgeBand, ScheduleProgramKind, ScheduleSlot } from '@/types/schedule'

/**
 * Maps roster `AgeGroup` (competition label) → schedule training band (facility ladder).
 * Parents only see bookable blocks for their athlete’s band.
 */
export function ageGroupToScheduleBand(ag: AgeGroup): ScheduleAgeBand | null {
  switch (ag) {
    case 'U6':
      return '4-5'
    case 'U8':
      return '6-8'
    case 'U10':
      return '9-11'
    case 'U12':
      return '12-14'
    case 'U14':
      return '12-14'
    case 'U16':
    case 'U18':
      return '15-19'
    case 'Adult':
      return null
    default:
      return null
  }
}

/** Parent portal: show only age-scoped program rows that match the athlete’s training band (e.g. Station 1 // 12-14). */
export function scheduleSlotMatchesChildBand(
  slot: ScheduleSlot,
  band: ScheduleAgeBand,
  kinds: ScheduleProgramKind[] = ['youth_training', 'preschool', 'littles']
): boolean {
  if (!kinds.includes(slot.kind)) return false
  return slot.ageBand === band
}
