import { supabase } from '@/lib/supabase'

type RpcRow = { slot_ref: string; enrolled: number | string | bigint }

/**
 * Confirmed `parent_block_bookings` rows per `slot_ref` for one schedule week (`book-*` refs only).
 * Requires `youth_block_booking_counts` RPC in Supabase; returns an empty map if the RPC is missing or errors.
 */
export async function fetchYouthBlockEnrollmentBySlotRef(weekStart: string): Promise<Map<string, number>> {
  const { data, error } = await supabase.rpc('youth_block_booking_counts', { p_week_start: weekStart })
  if (error) {
    console.warn('[youth-block-enrollment]', error.message)
    return new Map()
  }
  const m = new Map<string, number>()
  for (const row of (data ?? []) as RpcRow[]) {
    if (row?.slot_ref) m.set(row.slot_ref, Number(row.enrolled) || 0)
  }
  return m
}
