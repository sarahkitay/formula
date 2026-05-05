import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  listFieldRentalPurchasesForOrganizerEmail,
  summarizeFieldRentalPurchaseMetadata,
} from '@/lib/billing/organizer-portal-server'
import { listWaiverInvitesForPurchaserEmail } from '@/lib/rentals/waiver-invites-server'
import { getSiteOrigin } from '@/lib/stripe/server'

export const runtime = 'nodejs'

function supabaseAnon() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!url || !anon) return null
  return createClient(url, anon)
}

/** Authenticated organizer: roster invites tied to the same email as the paid field-rental checkout. */
export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  const m = /^Bearer\s+(.+)$/i.exec(auth ?? '')
  if (!m?.[1]) {
    return NextResponse.json({ error: 'Missing Authorization: Bearer token' }, { status: 401 })
  }
  const supabase = supabaseAnon()
  if (!supabase) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 503 })
  }

  const { data, error } = await supabase.auth.getUser(m[1])
  if (error || !data.user?.email) {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
  }

  const [invites, purchases] = await Promise.all([
    listWaiverInvitesForPurchaserEmail(data.user.email),
    listFieldRentalPurchasesForOrganizerEmail(data.user.email),
  ])
  const origin = getSiteOrigin()
  const invitesOut = invites.map(inv => ({
    id: inv.id,
    token: inv.token,
    created_at: inv.created_at,
    expected_waiver_count: inv.expected_waiver_count,
    completed_count: inv.completed_count,
    remaining_count: inv.remaining_count,
    purchaser_name: inv.purchaser_name ?? null,
    purchaser_email: inv.purchaser_email ?? null,
    checkout_amount_total_cents: inv.checkout_amount_total_cents ?? null,
    checkout_currency: inv.checkout_currency ?? null,
    checkout_completed_at: inv.checkout_completed_at ?? null,
    booking_rental_field: inv.booking_rental_field ?? null,
    booking_rental_window: inv.booking_rental_window ?? null,
    booking_rental_date: inv.booking_rental_date ?? null,
    booking_rental_dates_compact: inv.booking_rental_dates_compact ?? null,
    booking_session_weeks: inv.booking_session_weeks ?? null,
    rental_ref: inv.rental_ref ?? null,
    rental_type: inv.rental_type ?? null,
    stripe_checkout_session_id: inv.stripe_checkout_session_id ?? null,
    waiver_url: `${origin}/rentals/waiver/${inv.token}`,
  }))

  const purchasesOut = purchases.map(p => ({
    stripe_session_id: p.stripe_session_id,
    created_at: p.created_at,
    amount: p.amount,
    currency: p.currency,
    payment_status: p.payment_status,
    summary: summarizeFieldRentalPurchaseMetadata(p.metadata),
    /** Receipt / waiver recovery when Stripe redirected with session id */
    checkout_success_href: p.stripe_session_id.startsWith('cs_')
      ? `${origin}/checkout/success?session_id=${encodeURIComponent(p.stripe_session_id)}`
      : null,
  }))

  return NextResponse.json({ invites: invitesOut, purchases: purchasesOut })
}
