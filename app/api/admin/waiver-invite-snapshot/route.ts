import { NextResponse } from 'next/server'
import { updateWaiverInviteSessionAndPayment } from '@/lib/rentals/waiver-invites-server'

export const runtime = 'nodejs'

/** Admin: amount paid + field rental session snapshot on `field_rental_waiver_invites`. */
export async function PATCH(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
  const b = body as Record<string, unknown>
  const id = typeof b.id === 'string' ? b.id : ''
  const centsRaw = b.checkout_amount_total_cents
  let checkout_amount_total_cents: number | null = null
  if (centsRaw !== null && centsRaw !== undefined && centsRaw !== '') {
    const n = typeof centsRaw === 'number' ? centsRaw : parseInt(String(centsRaw), 10)
    checkout_amount_total_cents = Number.isFinite(n) ? n : null
  }
  const checkout_currency = typeof b.checkout_currency === 'string' ? b.checkout_currency : 'usd'
  const checkout_completed_at = typeof b.checkout_completed_at === 'string' ? b.checkout_completed_at : ''
  const booking_rental_field = typeof b.booking_rental_field === 'string' ? b.booking_rental_field : null
  const booking_rental_window = typeof b.booking_rental_window === 'string' ? b.booking_rental_window : null
  const booking_rental_date = typeof b.booking_rental_date === 'string' ? b.booking_rental_date : null
  const booking_rental_dates_compact =
    typeof b.booking_rental_dates_compact === 'string' ? b.booking_rental_dates_compact : null
  const weeksRaw = b.booking_session_weeks
  let booking_session_weeks: number | null = null
  if (weeksRaw !== null && weeksRaw !== undefined && weeksRaw !== '') {
    const n = typeof weeksRaw === 'number' ? weeksRaw : parseInt(String(weeksRaw), 10)
    booking_session_weeks = Number.isFinite(n) ? n : null
  }

  const result = await updateWaiverInviteSessionAndPayment({
    id,
    checkout_amount_total_cents,
    checkout_currency,
    checkout_completed_at,
    booking_rental_field,
    booking_rental_window,
    booking_rental_date,
    booking_rental_dates_compact,
    booking_session_weeks,
  })
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
