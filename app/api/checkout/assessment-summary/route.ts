import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe/server'

export const runtime = 'nodejs'

/**
 * Paid assessment checkout summary for portal signup (email, kid count, parent name).
 * Caller must know `session_id` from Stripe redirect (same as receipt).
 */
export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get('session_id')?.trim()
  if (!sessionId) {
    return NextResponse.json({ error: 'session_id query parameter is required' }, { status: 400 })
  }

  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 })
  }

  let session: Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>>
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch {
    return NextResponse.json({ error: 'Could not load checkout session' }, { status: 404 })
  }

  if (session.mode !== 'payment' || session.metadata?.type !== 'assessment') {
    return NextResponse.json({ error: 'This session is not an assessment booking' }, { status: 400 })
  }

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ error: 'Payment is not marked paid yet' }, { status: 400 })
  }

  const numKids = parseInt(session.metadata.assessment_num_kids ?? '1', 10)
  const safeKids = Number.isInteger(numKids) && numKids >= 1 && numKids <= 4 ? numKids : 1

  return NextResponse.json({
    email: session.customer_details?.email ?? session.customer_email ?? '',
    parentFullName: (session.metadata.parent_full_name ?? '').trim(),
    numKids: safeKids,
    slotId: (session.metadata.assessment_slot_id ?? '').trim(),
  })
}
