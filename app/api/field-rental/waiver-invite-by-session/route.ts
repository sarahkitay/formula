import { NextResponse } from 'next/server'
import { getSiteOrigin, getStripe } from '@/lib/stripe/server'
import { ensureWaiverInviteForPaidFieldRental, getWaiverInviteByStripeSessionId } from '@/lib/rentals/waiver-invites-server'

export const runtime = 'nodejs'

type Body = { session_id?: string }

/**
 * After a paid field-rental checkout, returns the roster waiver URL.
 * Verifies the session with Stripe (do not trust client-only metadata for paid state).
 */
export async function POST(req: Request) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const sessionId = typeof body.session_id === 'string' ? body.session_id.trim() : ''
  if (!sessionId.startsWith('cs_')) {
    return NextResponse.json({ error: 'session_id required' }, { status: 400 })
  }

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch (e) {
    console.warn('[waiver-invite-by-session] retrieve:', e)
    return NextResponse.json({ error: 'Could not load checkout session' }, { status: 502 })
  }

  if (session.mode !== 'payment' || session.payment_status !== 'paid') {
    return NextResponse.json({ error: 'checkout_not_paid' }, { status: 409 })
  }

  if (session.metadata?.type !== 'field-rental-booking') {
    return NextResponse.json({ error: 'not_field_rental_checkout' }, { status: 400 })
  }

  await ensureWaiverInviteForPaidFieldRental(session)
  const invite = await getWaiverInviteByStripeSessionId(session.id)
  if (!invite) {
    return NextResponse.json({ error: 'invite_missing' }, { status: 500 })
  }

  const origin = getSiteOrigin()
  const path = `/rentals/waiver/${invite.token}`
  return NextResponse.json({
    token: invite.token,
    waiver_url: `${origin}${path}`,
    expected_waiver_count: invite.expected_waiver_count,
  })
}
