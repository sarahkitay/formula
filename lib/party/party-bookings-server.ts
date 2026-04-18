import { getServiceSupabase } from '@/lib/supabase/service'

export type PartyBookingRow = {
  id: string
  created_at: string | null
  stripe_checkout_session_id: string
  amount_total_cents: number
  customer_email: string | null
  contact_name: string
  contact_phone: string | null
  party_preferred_date: string
  party_guest_count: number
  party_child_name: string | null
  party_notes: string | null
  rental_field_id: string
  rental_session_date: string
  rental_time_slot: string
  rental_headcount: number
  rental_organization: string | null
  rental_notes: string | null
}

export type PartyBookingInsert = Omit<PartyBookingRow, 'id' | 'created_at'>

export async function insertPartyBooking(row: PartyBookingInsert): Promise<{ ok: true; id: string } | { ok: false; message: string }> {
  const sb = getServiceSupabase()
  if (!sb) {
    return { ok: false, message: 'Database not configured (SUPABASE_SERVICE_ROLE_KEY).' }
  }

  const { data, error } = await sb
    .from('party_bookings')
    .insert({
      stripe_checkout_session_id: row.stripe_checkout_session_id,
      amount_total_cents: row.amount_total_cents,
      customer_email: row.customer_email,
      contact_name: row.contact_name,
      contact_phone: row.contact_phone,
      party_preferred_date: row.party_preferred_date,
      party_guest_count: row.party_guest_count,
      party_child_name: row.party_child_name,
      party_notes: row.party_notes,
      rental_field_id: row.rental_field_id,
      rental_session_date: row.rental_session_date,
      rental_time_slot: row.rental_time_slot,
      rental_headcount: row.rental_headcount,
      rental_organization: row.rental_organization,
      rental_notes: row.rental_notes,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') return { ok: false, message: 'duplicate_session' }
    console.error('[party_bookings] insert:', error.message)
    return { ok: false, message: error.message }
  }
  return { ok: true, id: (data as { id: string }).id }
}

export async function listPartyBookingsRecent(limit = 100): Promise<PartyBookingRow[]> {
  const sb = getServiceSupabase()
  if (!sb) return []

  const { data, error } = await sb
    .from('party_bookings')
    .select(
      'id, created_at, stripe_checkout_session_id, amount_total_cents, customer_email, contact_name, contact_phone, party_preferred_date, party_guest_count, party_child_name, party_notes, rental_field_id, rental_session_date, rental_time_slot, rental_headcount, rental_organization, rental_notes'
    )
    .order('created_at', { ascending: false })
    .limit(Math.min(500, Math.max(1, limit)))

  if (error) {
    console.warn('[party_bookings] list:', error.message)
    return []
  }
  return (data ?? []) as PartyBookingRow[]
}
