import type Stripe from 'stripe'
import { insertPartyBooking } from '@/lib/party/party-bookings-server'
import { sendPartyBookingEmails } from '@/lib/email/party-booking-email'

function metaInt(m: Stripe.Checkout.Session['metadata'], key: string): number | null {
  const v = m?.[key]?.trim()
  if (!v) return null
  const n = parseInt(v, 10)
  return Number.isInteger(n) ? n : null
}

/**
 * Persist party + field rental details after paid Checkout. Idempotent on `stripe_checkout_session_id`.
 */
export async function recordPartyBookingFromCheckout(session: Stripe.Checkout.Session): Promise<void> {
  if (session.metadata?.type !== 'party-booking-1k') return

  const m = session.metadata
  const name = m.party_contact_name?.trim()
  const email = (session.customer_details?.email ?? session.customer_email ?? m.party_contact_email)?.trim() ?? null
  const pref = m.party_preferred_date?.trim()
  const rDate = m.rental_date?.trim()
  const field = m.rental_field?.trim()
  const slot = m.rental_time_slot?.trim()
  const guests = metaInt(m, 'party_guest_count')
  const rHead = metaInt(m, 'rental_headcount')

  if (!name || !pref || !rDate || !field || !slot || guests == null || rHead == null) {
    console.warn('[party booking] Missing required metadata on session', session.id)
    return
  }

  const amount = session.amount_total ?? 100_000

  const ins = await insertPartyBooking({
    stripe_checkout_session_id: session.id,
    amount_total_cents: amount,
    customer_email: email,
    contact_name: name,
    contact_phone: m.party_contact_phone?.trim() || null,
    party_preferred_date: pref,
    party_guest_count: guests,
    party_child_name: m.party_child_name?.trim() || null,
    party_notes: m.party_notes?.trim() || null,
    rental_field_id: field,
    rental_session_date: rDate,
    rental_time_slot: slot,
    rental_headcount: rHead,
    rental_organization: m.rental_org?.trim() || null,
    rental_notes: m.rental_notes?.trim() || null,
  })

  if (!ins.ok) {
    if (ins.message === 'duplicate_session') return
    console.error('[party booking] insert failed:', ins.message)
    throw new Error(ins.message)
  }

  await sendPartyBookingEmails(session, ins.id)
}
