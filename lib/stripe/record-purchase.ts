import { randomUUID } from 'crypto'
import type Stripe from 'stripe'
import { getServiceSupabase } from '@/lib/supabase/service'

/** Synthetic Checkout id for in-person field rentals (never collides with Stripe `cs_` sessions). */
export const OFFLINE_FIELD_RENTAL_SESSION_PREFIX = 'offline_fr_' as const

export function newOfflineFieldRentalStripeSessionId(): string {
  return `${OFFLINE_FIELD_RENTAL_SESSION_PREFIX}${randomUUID().replace(/-/g, '')}`
}

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

/**
 * Records an in-person / admin-entered field rental deposit so it appears in Admin → Payments
 * and revenue rollups (same `type` + metadata shape as Stripe Checkout field rentals).
 */
export async function recordOfflineFieldRentalPurchase(params: {
  amountCents: number
  currency: string
  email: string | null
  metadata: Record<string, string>
}): Promise<{ ok: true; stripe_session_id: string } | { ok: false; message: string }> {
  const supabase = getServiceSupabase()
  if (!supabase) {
    return { ok: false, message: 'Database not configured.' }
  }
  if (!Number.isFinite(params.amountCents) || params.amountCents < 50) {
    return { ok: false, message: 'Amount must be at least $0.50.' }
  }
  const stripe_session_id = newOfflineFieldRentalStripeSessionId()
  const { error } = await supabase.from('stripe_purchases').insert({
    stripe_session_id,
    stripe_payment_intent_id: null,
    stripe_customer_id: null,
    email: params.email?.trim() || null,
    type: 'field-rental-booking',
    amount: Math.round(params.amountCents),
    currency: (params.currency || 'usd').toLowerCase(),
    payment_status: 'paid',
    metadata: params.metadata as Record<string, unknown>,
  })
  if (error) {
    if (error.code === '23505') {
      return { ok: false, message: 'Duplicate payment record; try again.' }
    }
    console.error('[stripe] offline field rental purchase:', error.message)
    return { ok: false, message: 'Could not record payment row.' }
  }
  return { ok: true, stripe_session_id }
}
