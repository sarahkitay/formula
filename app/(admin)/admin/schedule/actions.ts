'use server'

import { revalidatePath } from 'next/cache'
import {
  normalizeFacilityScheduleConfig,
  type FacilitySchedulePublishedConfig,
} from '@/lib/schedule/facility-schedule-config'
import {
  fetchFacilityScheduleConfig,
  upsertFacilityScheduleConfig,
} from '@/lib/schedule/facility-schedule-config-server'

export async function loadFacilityScheduleConfigAction(): Promise<FacilitySchedulePublishedConfig> {
  return fetchFacilityScheduleConfig()
}

export async function saveFacilityScheduleConfigAction(
  raw: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  const config = normalizeFacilityScheduleConfig(raw)
  const result = await upsertFacilityScheduleConfig(config)
  if (!result.ok) return result
  revalidatePath('/admin/schedule')
  revalidatePath('/admin/rentals')
  revalidatePath('/parent/bookings')
  return { ok: true }
}
