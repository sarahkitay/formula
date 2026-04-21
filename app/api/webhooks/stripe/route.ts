import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { sendStripeCheckoutPaidAdminEmail } from '@/lib/email/stripe-checkout-paid-email'
import { confirmSlotFromPaidCheckout } from '@/lib/rentals/rental-slots'
import { ensureWaiverInviteForPaidFieldRental } from '@/lib/rentals/waiver-invites-server'
import { recordAssessmentBookingFromCheckout } from '@/lib/stripe/record-assessment-booking'
import { recordPartyBookingFromCheckout } from '@/lib/stripe/record-party-booking'
import { recordCheckoutSessionCompleted } from '@/lib/stripe/record-purchase'
import { getStripe } from '@/lib/stripe/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const stripe = getStripe()
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()

  if (!stripe || !whSecret) {
    console.error('[stripe webhook] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const raw = await req.text()
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(raw, signature, whSecret)
  } catch (err) {
    console.error('[stripe webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.mode === 'payment' && session.payment_status === 'paid') {
      try {
        await recordCheckoutSessionCompleted(session)
        try {
          await recordAssessmentBookingFromCheckout(session)
        } catch (e) {
          console.error('[stripe webhook] assessment booking insert:', e)
        }
        try {
          await recordPartyBookingFromCheckout(session)
        } catch (e) {
          console.error('[stripe webhook] party booking insert:', e)
        }
        await confirmSlotFromPaidCheckout(session)
        try {
          await ensureWaiverInviteForPaidFieldRental(session)
        } catch (e) {
          console.error('[stripe webhook] waiver invite:', e)
        }
        if (session.metadata?.type !== 'party-booking-1k') {
          await sendStripeCheckoutPaidAdminEmail(session)
        }
      } catch {
        return NextResponse.json({ error: 'Failed to persist purchase' }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true })
}
