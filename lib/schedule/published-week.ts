import type { GeneratedWeek } from '@/types/schedule'
import {
  applyBlockedDates,
  generateWeeklySchedule,
  startOfScheduleWeek,
} from '@/lib/schedule/generator'
import type { FacilitySchedulePublishedConfig } from '@/lib/schedule/facility-schedule-config'

/**
 * Single source of truth for “what the facility publishes” for a given anchor date:
 * generator + saved overrides + blocked calendar days.
 */
export function buildPublishedWeek(
  weekAnchor: Date,
  config: FacilitySchedulePublishedConfig | null
): GeneratedWeek {
  const sun = startOfScheduleWeek(weekAnchor)
  const wix = Math.floor(sun.getTime() / (7 * 86400000)) % 52
  const overrides = config?.overrides ?? []
  let week = generateWeeklySchedule(weekAnchor, overrides, wix)
  week = applyBlockedDates(week, config?.blockedDates ?? [])
  return week
}
