import type Stripe from 'stripe'
import { getServiceSupabase } from '@/lib/supabase/service'

/**
 * Persist a completed Checkout session. Safe to call only from the verified Stripe webhook.
 * No-ops if Supabase service role is not configured.
 *
 * Column names match `public.stripe_purchases` (Stripe’s `amount_total` → DB `amount`).
 */
export async function recordCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const supabase = getServiceSupabase()
  if (!supabase) {
    console.warn('[stripe] SUPABASE_SERVICE_ROLE_KEY not set; skipping purchase record')
    return
  }

  const checkoutType = session.metadata?.type
  const email = session.customer_details?.email ?? session.customer_email ?? null

  const payload = {
    stripe_session_id: session.id,
    stripe_payment_intent_id:
      typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null,
    stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null,
    email,
    type: checkoutType ?? 'unknown',
    amount: session.amount_total ?? 0,
    currency: session.currency ?? 'usd',
    payment_status: session.payment_status ?? 'unpaid',
    metadata: (session.metadata ?? {}) as Record<string, string>,
  }

  const { error } = await supabase.from('stripe_purchases').insert(payload)

  if (error) {
    // Idempotent webhook retries
    if (error.code === '23505') return
    console.error('[stripe] Failed to insert stripe_purchases:', error.message)
    throw error
  }
}
