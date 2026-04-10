import type Stripe from 'stripe'
import { getServiceSupabase } from '@/lib/supabase/service'

/**
 * Insert a row in `assessment_bookings` after paid Checkout (webhook only).
 * Idempotent on `stripe_session_id`.
 */
export async function recordAssessmentBookingFromCheckout(session: Stripe.Checkout.Session): Promise<void> {
  if (session.metadata?.type !== 'assessment') return

  const slotId = session.metadata.assessment_slot_id?.trim()
  const numKidsRaw = session.metadata.assessment_num_kids?.trim()
  const parentName = session.metadata.parent_full_name?.trim()
  const numKids = parseInt(numKidsRaw ?? '', 10)

  if (!slotId || !Number.isInteger(numKids) || numKids < 1 || numKids > 4 || !parentName) {
    console.warn('[assessment booking] Missing or invalid metadata on session', session.id)
    return
  }

  const email = session.customer_details?.email ?? session.customer_email ?? null

  const sb = getServiceSupabase()
  if (!sb) {
    console.warn('[assessment booking] No service Supabase; skipping booking row')
    return
  }

  const { error } = await sb.from('assessment_bookings').insert({
    assessment_slot_id: slotId,
    num_kids: numKids,
    stripe_session_id: session.id,
    parent_full_name: parentName,
    parent_email: email,
  })

  if (error) {
    if (error.code === '23505') return
    console.error('[assessment booking] Insert failed:', error.message)
    throw error
  }
}
