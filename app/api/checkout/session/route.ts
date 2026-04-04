import { NextResponse } from 'next/server'
import { isCheckoutType } from '@/lib/stripe/checkout-types'
import { lineItemsForCheckoutType } from '@/lib/stripe/line-items'
import { getSiteOrigin, getStripe } from '@/lib/stripe/server'

export const runtime = 'nodejs'

const CHECKOUT_SUCCESS_NEXT_ALLOWED = ['portal-assessment'] as const
type CheckoutSuccessNext = (typeof CHECKOUT_SUCCESS_NEXT_ALLOWED)[number]

function parseSuccessNext(value: unknown): CheckoutSuccessNext | undefined {
  if (typeof value !== 'string') return undefined
  return (CHECKOUT_SUCCESS_NEXT_ALLOWED as readonly string[]).includes(value) ? (value as CheckoutSuccessNext) : undefined
}

/** Stripe metadata values must be strings; drop oversized or empty keys. */
function sanitizeMetadataExtra(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof k !== 'string' || k.length > 40) continue
    if (typeof v !== 'string') continue
    const trimmed = v.trim()
    if (!trimmed || trimmed.length > 450) continue
    out[k] = trimmed
  }
  return out
}

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

  const successNext = parseSuccessNext((body as { successNext?: unknown }).successNext)
  const metadataExtra = sanitizeMetadataExtra((body as { metadata?: unknown }).metadata)

  const origin = getSiteOrigin()
  const line_items = lineItemsForCheckoutType(type)

  const successQuery =
    successNext != null
      ? `session_id={CHECKOUT_SESSION_ID}&next=${encodeURIComponent(successNext)}`
      : 'session_id={CHECKOUT_SESSION_ID}'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${origin}/checkout/success?${successQuery}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        type,
        ...metadataExtra,
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
