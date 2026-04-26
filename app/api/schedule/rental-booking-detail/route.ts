import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase/service'
import { listAgreementsForRentalBooking } from '@/lib/rentals/field-rental-agreements-server'
import { listRentalWaiverCheckinsForBooking, setRentalWaiverCheckIn } from '@/lib/rentals/rental-waiver-checkins-server'

export const runtime = 'nodejs'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** Admin calendar: rental row + signed waivers + waiver check-ins for that slot. */
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
  const checkins = await listRentalWaiverCheckinsForBooking(booking.id as string)
  return NextResponse.json({ booking, agreements, checkins })
}

/** Toggle waiver signer check-in for this rental slot (staff confirms presence). */
export async function PATCH(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
  const b = body as {
    bookingId?: unknown
    agreementId?: unknown
    checkedIn?: unknown
    checkedInBy?: unknown
  }
  const bookingId = typeof b.bookingId === 'string' ? b.bookingId.trim() : ''
  const agreementId = typeof b.agreementId === 'string' ? b.agreementId.trim() : ''
  if (!UUID.test(bookingId) || !UUID.test(agreementId)) {
    return NextResponse.json({ error: 'Invalid booking or agreement id' }, { status: 400 })
  }
  const checkedIn = Boolean(b.checkedIn)
  const checkedInBy = typeof b.checkedInBy === 'string' ? b.checkedInBy : undefined

  const result = await setRentalWaiverCheckIn({
    rentalSlotBookingId: bookingId,
    fieldRentalAgreementId: agreementId,
    checkedIn,
    checkedInBy,
  })
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 400 })
  }
  const checkins = await listRentalWaiverCheckinsForBooking(bookingId)
  return NextResponse.json({ ok: true, checkins })
}
