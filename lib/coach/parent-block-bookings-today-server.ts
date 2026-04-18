import { getServiceSupabase } from '@/lib/supabase/service'
import {
  FACILITY_TIMEZONE,
  facilityDayQueryUtcBoundsFromRef,
  facilityTodayYmd,
  isSameFacilityCalendarDay,
} from '@/lib/facility/facility-day'

export type TodayBlockBookingRow = {
  id: string
  player_id: string
  title: string
  starts_at: string
  ends_at: string | null
  status: string
}

/**
 * Confirmed parent portal block bookings whose slot start falls on the facility’s
 * local calendar day. Check-ins are not queried yet — use counts for “booked” only.
 */
export async function listParentBlockBookingsForFacilityToday(): Promise<{
  bookings: TodayBlockBookingRow[]
  facilityYmd: string
  timeZone: string
  error: string | null
}> {
  const sb = getServiceSupabase()
  const facilityYmd = facilityTodayYmd()
  const timeZone = FACILITY_TIMEZONE
  if (!sb) {
    return { bookings: [], facilityYmd, timeZone, error: 'Supabase service role not configured' }
  }

  const { fromIso, toIso } = facilityDayQueryUtcBoundsFromRef()

  const { data, error } = await sb
    .from('parent_block_bookings')
    .select('id, player_id, title, starts_at, ends_at, status')
    .eq('status', 'confirmed')
    .gte('starts_at', fromIso)
    .lt('starts_at', toIso)

  if (error) {
    return { bookings: [], facilityYmd, timeZone, error: error.message }
  }

  const rows = (data ?? []) as TodayBlockBookingRow[]
  const bookings = rows.filter(b => isSameFacilityCalendarDay(b.starts_at, facilityYmd, timeZone))

  return { bookings, facilityYmd, timeZone, error: null }
}
