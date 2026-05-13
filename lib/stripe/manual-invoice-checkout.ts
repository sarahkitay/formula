import { getServiceSupabase } from '@/lib/supabase/service'
import { getSiteOrigin, getStripe, checkStripeServerSecretKey } from '@/lib/stripe/server'

const MIN_USD = 0.5
const MAX_USD = 100_000

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function parseUsdToCents(raw: unknown): { ok: true; cents: number } | { ok: false; message: string } {
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

export type ManualInvoiceCheckoutParams = {
  payeeName: string
  amountUsd: string | number
  memo: string
  customerEmail?: string
  waiverInviteId?: string | null
}

/**
 * Trusted server path: create a one-off Stripe Checkout session (same behavior as POST /api/admin/invoice-checkout).
 */
export async function createManualInvoiceCheckoutUrl(
  params: ManualInvoiceCheckoutParams
): Promise<{ ok: true; url: string; session_id: string } | { ok: false; message: string }> {
  const keyCheck = checkStripeServerSecretKey()
  if (!keyCheck.ok) {
    return { ok: false, message: keyCheck.message }
  }
  const stripe = getStripe()
  if (!stripe) {
    return { ok: false, message: 'Stripe is not configured.' }
  }

  const payeeName = params.payeeName.trim()
  if (payeeName.length < 2) {
    return { ok: false, message: 'Bill-to name must be at least 2 characters.' }
  }

  let waiverInviteId = ''
  const waiverInviteIdRaw = params.waiverInviteId?.trim() ?? ''
  if (waiverInviteIdRaw) {
    if (!UUID.test(waiverInviteIdRaw)) {
      return { ok: false, message: 'Invalid roster invite id.' }
    }
    const sb = getServiceSupabase()
    if (!sb) {
      return { ok: false, message: 'Server cannot verify roster invite (database unavailable).' }
    }
    const { data: invRow, error: invErr } = await sb
      .from('field_rental_waiver_invites')
      .select('id')
      .eq('id', waiverInviteIdRaw)
      .maybeSingle()
    if (invErr || !invRow) {
      return { ok: false, message: 'Roster invite not found.' }
    }
    waiverInviteId = waiverInviteIdRaw
  }

  const amount = parseUsdToCents(params.amountUsd)
  if (!amount.ok) {
    return { ok: false, message: amount.message }
  }

  const memo = params.memo.trim()
  const customerEmail = (params.customerEmail ?? '').trim().toLowerCase()
  const origin = getSiteOrigin()
  const productName = trimMeta(
    waiverInviteId ? `Field rental payment · ${payeeName}` : `Formula invoice · ${payeeName}`,
    120
  )
  const description = memo ? trimMeta(memo, 450) : 'Custom invoice - Formula Soccer Center'

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
        ...(waiverInviteId ? { waiver_invite_id: waiverInviteId } : {}),
      },
      ...(customerEmail.includes('@') && customerEmail.includes('.')
        ? { customer_email: customerEmail, customer_creation: 'always' as const }
        : { customer_creation: 'always' as const }),
      billing_address_collection: 'auto',
    })

    if (!session.url) {
      return { ok: false, message: 'Stripe did not return a checkout URL.' }
    }

    return { ok: true, url: session.url, session_id: session.id }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Stripe error'
    console.error('[manual-invoice-checkout]', msg)
    return { ok: false, message: msg }
  }
}
