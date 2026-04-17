import { getServiceSupabase } from '@/lib/supabase/service'
import {
  DEFAULT_FACILITY_SCHEDULE_CONFIG,
  normalizeFacilityScheduleConfig,
  type FacilitySchedulePublishedConfig,
} from '@/lib/schedule/facility-schedule-config'

const SINGLETON_ID = 1 as const

export async function fetchFacilityScheduleConfig(): Promise<FacilitySchedulePublishedConfig> {
  const sb = getServiceSupabase()
  if (!sb) return DEFAULT_FACILITY_SCHEDULE_CONFIG

  const { data, error } = await sb
    .from('facility_schedule_config')
    .select('payload')
    .eq('id', SINGLETON_ID)
    .maybeSingle()

  if (error) {
    console.warn('[facility_schedule_config] read:', error.message)
    return DEFAULT_FACILITY_SCHEDULE_CONFIG
  }
  if (!data?.payload) return DEFAULT_FACILITY_SCHEDULE_CONFIG
  return normalizeFacilityScheduleConfig(data.payload)
}

export async function upsertFacilityScheduleConfig(
  payload: FacilitySchedulePublishedConfig
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getServiceSupabase()
  if (!sb) {
    return { ok: false, error: 'Supabase service role is not configured; cannot save schedule.' }
  }

  const normalized = normalizeFacilityScheduleConfig(payload)

  const { error } = await sb.from('facility_schedule_config').upsert(
    {
      id: SINGLETON_ID,
      payload: normalized,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  )

  if (error) {
    console.error('[facility_schedule_config] upsert:', error.message)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}
