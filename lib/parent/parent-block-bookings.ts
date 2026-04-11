import { supabase } from '@/lib/supabase'

export type ParentBlockBookingRow = {
  id: string
  player_id: string
  slot_ref: string
  week_start: string
  title: string
  starts_at: string
  ends_at: string | null
  status: string
  meta: Record<string, unknown>
  created_at: string
}

export type ParentBlockBookingInsert = {
  player_id: string
  slot_ref: string
  week_start: string
  title: string
  starts_at: string
  ends_at: string | null
  meta?: Record<string, unknown>
}

export async function fetchParentBlockBookings(): Promise<{
  data: ParentBlockBookingRow[] | null
  error: Error | null
}> {
  const { data, error } = await supabase
    .from('parent_block_bookings')
    .select('id, player_id, slot_ref, week_start, title, starts_at, ends_at, status, meta, created_at')
    .eq('status', 'confirmed')
    .order('starts_at', { ascending: true })

  if (error) return { data: null, error: new Error(error.message) }
  return { data: (data ?? []) as ParentBlockBookingRow[], error: null }
}

export async function createParentBlockBooking(
  row: ParentBlockBookingInsert
): Promise<{ data: { id: string } | null; error: Error | null }> {
  const { data: auth } = await supabase.auth.getUser()
  const uid = auth.user?.id
  if (!uid) return { data: null, error: new Error('Not signed in') }

  const { data, error } = await supabase
    .from('parent_block_bookings')
    .insert({
      parent_user_id: uid,
      player_id: row.player_id,
      slot_ref: row.slot_ref,
      week_start: row.week_start,
      title: row.title,
      starts_at: row.starts_at,
      ends_at: row.ends_at,
      meta: row.meta ?? {},
    })
    .select('id')
    .single()

  if (error) {
    const e = new Error(error.message) as Error & { code?: string }
    e.code = error.code
    return { data: null, error: e }
  }
  return { data: data as { id: string }, error: null }
}
