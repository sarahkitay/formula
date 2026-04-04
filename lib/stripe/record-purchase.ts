import type Stripe from 'stripe'
import type { CheckoutType } from '@/lib/stripe/checkout-types'
import { getServiceSupabase } from '@/lib/supabase/service'

/** Sessions credited for prepaid packages (fulfillment logic can extend later). */
function sessionsCreditedForType(type: CheckoutType | string | undefined): number | null {
  if (type === 'package-10') return 10
  return null
}

/**
 * Persist a completed Checkout session. Safe to call only from the verified Stripe webhook.
 * No-ops if Supabase service role is not configured.
 */
export async function recordCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const supabase = getServiceSupabase()
  if (!supabase) {
    console.warn('[stripe] SUPABASE_SERVICE_ROLE_KEY not set; skipping purchase record')
    return
  }

  const checkoutType = session.metadata?.type
  const email = session.customer_details?.email ?? session.customer_email ?? null

  const row = {
    stripe_checkout_session_id: session.id,
    stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null,
    stripe_payment_intent_id:
      typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null,
    customer_email: email,
    checkout_type: checkoutType ?? 'unknown',
    amount_total: session.amount_total,
    currency: session.currency,
    payment_status: session.payment_status,
    sessions_credited: sessionsCreditedForType(checkoutType),
    metadata: session.metadata as Record<string, string> | null,
  }

  const { error } = await supabase.from('stripe_purchases').insert(row)

  if (error) {
    // Idempotent webhook retries
    if (error.code === '23505') return
    console.error('[stripe] Failed to insert stripe_purchases:', error.message)
    throw error
  }
}
