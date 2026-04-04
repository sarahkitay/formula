import { NextResponse } from 'next/server'
import { isCheckoutType } from '@/lib/stripe/checkout-types'
import { lineItemsForCheckoutType } from '@/lib/stripe/line-items'
import { getSiteOrigin, getStripe } from '@/lib/stripe/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json(
      { error: 'Payments are not configured. Set STRIPE_SECRET_KEY on the server.' },
      { status: 503 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const type = (body as { type?: unknown }).type
  if (!isCheckoutType(type)) {
    return NextResponse.json({ error: 'Invalid or unsupported checkout type' }, { status: 400 })
  }

  const origin = getSiteOrigin()
  const line_items = lineItemsForCheckoutType(type)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        type,
      },
      customer_creation: 'always',
      billing_address_collection: 'auto',
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Checkout session missing URL' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error('[checkout/session]', e)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
