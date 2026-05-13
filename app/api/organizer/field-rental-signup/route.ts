import { NextResponse } from 'next/server'
import { escapeHtml, sendAdminNotification } from '@/lib/email/send-admin-notification'
import {
  ensureWaiverInviteForPaidFieldRental,
  getWaiverInviteByStripeSessionId,
  listWaiverInvitesForPurchaserEmail,
} from '@/lib/rentals/waiver-invites-server'
import { resolveCheckoutPurchaseType } from '@/lib/stripe/record-purchase'
import { getServiceSupabase } from '@/lib/supabase/service'
import { getStripe } from '@/lib/stripe/server'

export const runtime = 'nodejs'

function isPlausibleBookingEmail(raw: string): boolean {
  const t = raw.trim().toLowerCase()
  return t.length > 3 && t.includes('@') && t.includes('.')
}

/**
 * After a paid field-rental Checkout, create Supabase auth + profile (role organizer)
 * so the payer can sign in and load roster links on /organizer/dashboard.
 *
 * Two ways to prove eligibility:
 * - `sessionId` starting with `cs_` (normal Checkout success URL), or
 * - `bookingEmail` matching a roster invite’s payer email (invoice / in-person / metadata mismatch on Checkout).
 */
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const b = body as { sessionId?: unknown; bookingEmail?: unknown; password?: unknown }
  const sessionId = typeof b.sessionId === 'string' ? b.sessionId.trim() : ''
  const bookingEmailRaw = typeof b.bookingEmail === 'string' ? b.bookingEmail.trim() : ''
  const password = typeof b.password === 'string' ? b.password : ''

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const sb = getServiceSupabase()
  if (!sb) {
    return NextResponse.json({ error: 'Server signup is not configured (Supabase service role)' }, { status: 503 })
  }

  let email: string
  let organizerName: string
  let adminSignupSource: string
  let inviteTokenPreview: string

  if (sessionId.startsWith('cs_')) {
    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 })
    }

    let session: Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>>
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId)
    } catch {
      return NextResponse.json({ error: 'Invalid checkout session' }, { status: 400 })
    }

    if (session.mode !== 'payment' || session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Checkout is not paid yet' }, { status: 409 })
    }

    if (resolveCheckoutPurchaseType(session) !== 'field-rental-booking') {
      return NextResponse.json(
        {
          error:
            'This Stripe session is not tagged as a field-rental checkout. If you paid by invoice or link, use “Booking email” on the signup page instead of the session id.',
        },
        { status: 400 }
      )
    }

    await ensureWaiverInviteForPaidFieldRental(session)
    const invite = await getWaiverInviteByStripeSessionId(sessionId)
    if (!invite) {
      return NextResponse.json(
        { error: 'Roster invite is not ready yet. Wait a minute and try again, or contact the front desk.' },
        { status: 503 }
      )
    }

    email = (session.customer_details?.email ?? session.customer_email ?? '').trim().toLowerCase()
    if (!email) {
      return NextResponse.json({ error: 'Checkout session has no email on file' }, { status: 400 })
    }

    const inviteEmail = (invite.purchaser_email ?? '').trim().toLowerCase()
    if (inviteEmail && inviteEmail !== email) {
      return NextResponse.json({ error: 'Session email does not match this roster invite' }, { status: 403 })
    }

    organizerName =
      (invite.purchaser_name ?? '').trim() ||
      (session.customer_details?.name ?? '').trim() ||
      'Organizer'
    adminSignupSource = `Stripe checkout session: ${sessionId}`
    inviteTokenPreview = invite.token.slice(0, 12)
  } else if (isPlausibleBookingEmail(bookingEmailRaw)) {
    const invites = await listWaiverInvitesForPurchaserEmail(bookingEmailRaw)
    if (invites.length === 0) {
      return NextResponse.json(
        {
          error:
            'No field-rental roster invite found for that email. Use the exact address on your booking or invoice, or ask staff to attach your email to the rental.',
        },
        { status: 404 }
      )
    }

    const invite = invites[0]!
    email = (invite.purchaser_email ?? bookingEmailRaw).trim().toLowerCase()
    organizerName = (invite.purchaser_name ?? '').trim() || 'Organizer'
    adminSignupSource = `Booking email (invoice / roster match) · ${invites.length} invite(s) for this payer`
    inviteTokenPreview = invite.token.slice(0, 12)
  } else {
    return NextResponse.json(
      {
        error:
          'Send a paid field-rental Stripe checkout id (starts with cs_) or the booking email address stored on your roster invite, plus a password (min 8 characters).',
      },
      { status: 400 }
    )
  }

  const { data: existingByEmail } = await sb.from('profiles').select('id, role').eq('email', email).maybeSingle()
  if (existingByEmail) {
    return NextResponse.json(
      {
        error:
          'An account already exists for this email. Use Renter / organizer sign-in on /login instead of creating a second account.',
      },
      { status: 409 }
    )
  }

  const { data: created, error: createErr } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: organizerName },
  })

  if (createErr || !created.user) {
    return NextResponse.json({ error: createErr?.message ?? 'Could not create account' }, { status: 400 })
  }

  const userId = created.user.id

  try {
    const { error: profileErr } = await sb.from('profiles').upsert(
      {
        id: userId,
        role: 'organizer',
        full_name: organizerName,
        email,
      },
      { onConflict: 'id' }
    )
    if (profileErr) throw profileErr
  } catch (e) {
    await sb.auth.admin.deleteUser(userId)
    const err = e as { message?: string; code?: string }
    console.error('[organizer field-rental-signup]', err?.code, err?.message, e)
    return NextResponse.json({ error: 'Signup failed. Try again or contact the front desk.' }, { status: 500 })
  }

  await sendAdminNotification({
    subject: `[Formula] Organizer portal created · ${email}`,
    html: `
      <p><strong>Field rental organizer account</strong></p>
      <ul>
        <li><strong>Email</strong>: ${escapeHtml(email)}</li>
        <li><strong>Name</strong>: ${escapeHtml(organizerName)}</li>
        <li><strong>Source</strong>: ${escapeHtml(adminSignupSource)}</li>
        <li><strong>User id</strong>: ${escapeHtml(userId)}</li>
        <li><strong>Roster invite token (sample)</strong>: ${escapeHtml(inviteTokenPreview)}…</li>
      </ul>
    `,
    text: `Organizer signup: ${email} · ${adminSignupSource}`,
  })

  return NextResponse.json({ ok: true, userId })
}
