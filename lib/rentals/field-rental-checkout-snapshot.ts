import type Stripe from 'stripe'
import type { WaiverInviteRow } from '@/lib/rentals/waiver-invites-server'
import { checkStripeServerSecretKey, getStripe } from '@/lib/stripe/server'

export type FieldRentalAgreementCheckoutSnapshot = {
  stripe_checkout_session_id: string | null
  checkout_amount_total_cents: number | null
  checkout_currency: string | null
  booking_rental_field: string | null
  booking_rental_window: string | null
  booking_rental_date: string | null
  booking_rental_dates_compact: string | null
  booking_session_weeks: number | null
  booking_headcount_at_checkout: number | null
}

const emptySnapshot = (): FieldRentalAgreementCheckoutSnapshot => ({
  stripe_checkout_session_id: null,
  checkout_amount_total_cents: null,
  checkout_currency: null,
  booking_rental_field: null,
  booking_rental_window: null,
  booking_rental_date: null,
  booking_rental_dates_compact: null,
  booking_session_weeks: null,
  booking_headcount_at_checkout: null,
})

function parseOptionalInt(raw: string | undefined): number | null {
  if (raw == null || raw === '') return null
  const n = parseInt(raw, 10)
  return Number.isFinite(n) ? n : null
}

/**
 * Fills gaps from Stripe with the roster invite row so each signed waiver always stores field / window / dates when the invite has them.
 */
export function mergeWaiverInviteIntoCheckoutSnapshot(
  invite: WaiverInviteRow,
  snap: FieldRentalAgreementCheckoutSnapshot
): FieldRentalAgreementCheckoutSnapshot {
  const str = (a: string | null | undefined, b: string | null | undefined) => {
    const x = a?.trim()
    const y = b?.trim()
    return x && x.length > 0 ? x : y && y.length > 0 ? y : null
  }

  const weeks = snap.booking_session_weeks ?? invite.booking_session_weeks ?? null
  const headcount = snap.booking_headcount_at_checkout ?? invite.expected_waiver_count

  return {
    stripe_checkout_session_id: str(snap.stripe_checkout_session_id, invite.stripe_checkout_session_id),
    checkout_amount_total_cents: snap.checkout_amount_total_cents ?? invite.checkout_amount_total_cents ?? null,
    checkout_currency: str(snap.checkout_currency, invite.checkout_currency) ?? 'usd',
    booking_rental_field: str(snap.booking_rental_field, invite.booking_rental_field),
    booking_rental_window: str(snap.booking_rental_window, invite.booking_rental_window),
    booking_rental_date: str(snap.booking_rental_date, invite.booking_rental_date),
    booking_rental_dates_compact: str(snap.booking_rental_dates_compact, invite.booking_rental_dates_compact),
    booking_session_weeks: weeks,
    booking_headcount_at_checkout: headcount,
  }
}

function snapshotFromStripeSession(session: Stripe.Checkout.Session, sessionId: string): FieldRentalAgreementCheckoutSnapshot {
  const m = session.metadata ?? {}
  const weeks = parseOptionalInt(m.rental_weeks)
  const headcount = parseOptionalInt(m.rental_participants)
  return {
    stripe_checkout_session_id: sessionId,
    checkout_amount_total_cents: session.amount_total ?? null,
    checkout_currency: session.currency ?? null,
    booking_rental_field: m.rental_field?.trim() || null,
    booking_rental_window: m.rental_window?.trim() || null,
    booking_rental_date: m.rental_date?.trim() || null,
    booking_rental_dates_compact: m.rental_dates_compact?.trim() || null,
    booking_session_weeks: weeks,
    booking_headcount_at_checkout: headcount,
  }
}

/**
 * Load paid checkout metadata for a field-rental roster link. Safe when Stripe is misconfigured — still returns session id.
 */
export async function loadFieldRentalCheckoutSnapshot(stripeCheckoutSessionId: string): Promise<FieldRentalAgreementCheckoutSnapshot> {
  const sid = stripeCheckoutSessionId.trim()
  if (!sid.startsWith('cs_')) return emptySnapshot()

  const keyCheck = checkStripeServerSecretKey()
  const stripe = keyCheck.ok ? getStripe() : null
  if (!stripe) {
    return { ...emptySnapshot(), stripe_checkout_session_id: sid }
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sid)
    return snapshotFromStripeSession(session, sid)
  } catch (e) {
    console.warn('[field-rental-checkout-snapshot] retrieve failed:', e instanceof Error ? e.message : e)
    return { ...emptySnapshot(), stripe_checkout_session_id: sid }
  }
}
