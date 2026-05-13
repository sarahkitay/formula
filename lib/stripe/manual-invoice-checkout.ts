import { getServiceSupabase } from '@/lib/supabase/service'
import { getSiteOrigin } from '@/lib/site-origin'
import { getStripe, checkStripeServerSecretKey } from '@/lib/stripe/server'
import { parseUsdToCents } from '@/lib/stripe/parse-usd-to-cents'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

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
  let stripe: NonNullable<ReturnType<typeof getStripe>>
  try {
    const s = getStripe()
    if (!s) {
      return { ok: false, message: 'Stripe is not configured.' }
    }
    stripe = s
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Stripe init error'
    console.error('[manual-invoice-checkout] getStripe:', e)
    return { ok: false, message: msg }
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
