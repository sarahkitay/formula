import { NextResponse } from 'next/server'
import { checkStripeServerSecretKey, getSiteOrigin, getStripe } from '@/lib/stripe/server'

export const runtime = 'nodejs'

const MIN_USD = 0.5
const MAX_USD = 100_000

function parseUsdToCents(raw: unknown): { ok: true; cents: number } | { ok: false; message: string } {
  if (raw == null) return { ok: false, message: 'amount is required' }
  let n: number
  if (typeof raw === 'number') {
    if (!Number.isFinite(raw)) return { ok: false, message: 'amount must be a number' }
    n = raw
  } else if (typeof raw === 'string') {
    const cleaned = raw.replace(/[$,\s]/g, '').trim()
    if (!cleaned) return { ok: false, message: 'amount is required' }
    n = parseFloat(cleaned)
    if (!Number.isFinite(n)) return { ok: false, message: 'amount must be a valid number' }
  } else {
    return { ok: false, message: 'amount must be a string or number' }
  }

  if (n < MIN_USD) return { ok: false, message: `Minimum charge is $${MIN_USD} USD` }
  if (n > MAX_USD) return { ok: false, message: `Maximum charge is $${MAX_USD.toLocaleString()} USD` }

  const cents = Math.round(n * 100)
  if (cents < Math.round(MIN_USD * 100)) return { ok: false, message: `Minimum charge is $${MIN_USD} USD` }
  return { ok: true, cents }
}

function trimMeta(s: string, max: number): string {
  const t = s.trim()
  return t.length <= max ? t : t.slice(0, max)
}

/**
 * Admin: create a one-off Stripe Checkout URL for a custom invoice amount (server-validated; never trust client-only).
 */
export async function POST(req: Request) {
  const keyCheck = checkStripeServerSecretKey()
  if (!keyCheck.ok) {
    return NextResponse.json({ error: keyCheck.message }, { status: 503 })
  }
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const b = body as Record<string, unknown>
  const payeeName = typeof b.payeeName === 'string' ? b.payeeName.trim() : ''
  const memo = typeof b.memo === 'string' ? b.memo.trim() : ''
  const customerEmail = typeof b.customerEmail === 'string' ? b.customerEmail.trim().toLowerCase() : ''

  if (payeeName.length < 2) {
    return NextResponse.json({ error: 'Bill-to name must be at least 2 characters.' }, { status: 400 })
  }

  const amount = parseUsdToCents(b.amountUsd ?? b.amount)
  if (!amount.ok) {
    return NextResponse.json({ error: amount.message }, { status: 400 })
  }

  const origin = getSiteOrigin()
  const productName = trimMeta(`Formula invoice · ${payeeName}`, 120)
  const description = memo ? trimMeta(memo, 450) : 'Custom invoice — Formula Soccer Center'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            tax_behavior: 'exclusive',
            unit_amount: amount.cents,
            product_data: {
              name: productName,
              description,
            },
          },
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        type: 'manual-invoice',
        invoice_payee: trimMeta(payeeName, 200),
        invoice_memo: trimMeta(memo, 450),
      },
      ...(customerEmail.includes('@') && customerEmail.includes('.')
        ? { customer_email: customerEmail, customer_creation: 'always' as const }
        : { customer_creation: 'always' as const }),
      billing_address_collection: 'auto',
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe did not return a checkout URL.' }, { status: 502 })
    }

    return NextResponse.json({
      url: session.url,
      session_id: session.id,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Stripe error'
    console.error('[invoice-checkout]', msg)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
