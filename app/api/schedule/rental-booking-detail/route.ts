import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase/service'
import { listAgreementsForRentalBooking } from '@/lib/rentals/field-rental-agreements-server'

export const runtime = 'nodejs'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** Admin calendar: rental row + signed waivers for that field/date/window. */
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id')?.trim() ?? ''
  if (!UUID.test(id)) {
    return NextResponse.json({ error: 'Invalid booking id' }, { status: 400 })
  }
  const sb = getServiceSupabase()
  if (!sb) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }
  const { data: booking, error } = await sb
    .from('rental_slot_bookings')
    .select('id, field_id, session_date, time_slot, rental_ref, stripe_checkout_session_id, status')
    .eq('id', id)
    .maybeSingle()
  if (error) {
    console.warn('[rental-booking-detail]', error.message)
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
  }
  if (!booking) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const agreements = await listAgreementsForRentalBooking(booking)
  return NextResponse.json({ booking, agreements })
}
