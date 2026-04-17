import { NextResponse } from 'next/server'
import { escapeHtml, sendAdminNotification } from '@/lib/email/send-admin-notification'
import { isValidPortalSignupAgeGroup } from '@/lib/parent/portal-signup-age-groups'
import { getServiceSupabase } from '@/lib/supabase/service'
import { getStripe } from '@/lib/stripe/server'

export const runtime = 'nodejs'

type KidPayload = {
  firstName?: unknown
  lastName?: unknown
  dateOfBirth?: unknown
  ageGroup?: unknown
}

function parseIsoDateOnly(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null
  const [y, m, d] = s.split('-').map(Number) as [number, number, number]
  const dt = new Date(Date.UTC(y, m - 1, d))
  return Number.isNaN(dt.getTime()) ? null : dt
}

function isPlausibleDateOfBirth(s: string): boolean {
  const d = parseIsoDateOnly(s)
  if (!d) return false
  const today = new Date()
  const end = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  if (d.getTime() > end) return false
  if (d.getUTCFullYear() < 1920) return false
  return true
}

function cleanKid(k: KidPayload): { firstName: string; lastName: string; dateOfBirth: string; ageGroup: string } | null {
  const fn = typeof k.firstName === 'string' ? k.firstName.trim() : ''
  const ln = typeof k.lastName === 'string' ? k.lastName.trim() : ''
  const dob = typeof k.dateOfBirth === 'string' ? k.dateOfBirth.trim() : ''
  const ag = typeof k.ageGroup === 'string' ? k.ageGroup.trim() : ''
  if (!fn || !ln || !dob || !ag) return null
  if (!isPlausibleDateOfBirth(dob)) return null
  if (!isValidPortalSignupAgeGroup(ag)) return null
  return { firstName: fn, lastName: ln, dateOfBirth: dob, ageGroup: ag }
}

/**
 * After a paid assessment, create Supabase auth user + parent profile + player rows + parent_players links.
 */
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const sessionId = typeof (body as { sessionId?: unknown }).sessionId === 'string' ? (body as { sessionId: string }).sessionId.trim() : ''
  const password = typeof (body as { password?: unknown }).password === 'string' ? (body as { password: string }).password : ''
  const kidsRaw = (body as { kids?: unknown }).kids

  if (!sessionId || password.length < 8) {
    return NextResponse.json({ error: 'sessionId and password (min 8 characters) are required' }, { status: 400 })
  }

  if (!Array.isArray(kidsRaw) || kidsRaw.length === 0) {
    return NextResponse.json({ error: 'kids must be a non-empty array' }, { status: 400 })
  }

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

  if (session.mode !== 'payment' || session.metadata?.type !== 'assessment' || session.payment_status !== 'paid') {
    return NextResponse.json({ error: 'Session is not a paid assessment' }, { status: 400 })
  }

  const numKids = parseInt(session.metadata.assessment_num_kids ?? '1', 10)
  const expected = Number.isInteger(numKids) && numKids >= 1 && numKids <= 4 ? numKids : 1

  if (kidsRaw.length !== expected) {
    return NextResponse.json({ error: `Enter exactly ${expected} athlete(s) to match your booking.` }, { status: 400 })
  }

  const kids = kidsRaw.map(k => cleanKid(k as KidPayload)).filter(Boolean) as {
    firstName: string
    lastName: string
    dateOfBirth: string
    ageGroup: string
  }[]
  if (kids.length !== expected) {
    return NextResponse.json(
      { error: 'Each athlete needs first name, last name, date of birth, and a valid age group' },
      { status: 400 }
    )
  }

  const email = (session.customer_details?.email ?? session.customer_email ?? '').trim().toLowerCase()
  if (!email) {
    return NextResponse.json({ error: 'Checkout session has no email' }, { status: 400 })
  }

  const parentFullName = (session.metadata.parent_full_name ?? '').trim() || 'Parent'

  const sb = getServiceSupabase()
  if (!sb) {
    return NextResponse.json({ error: 'Server signup is not configured (Supabase service role)' }, { status: 503 })
  }

  const { data: existingProfile } = await sb.from('profiles').select('id').eq('email', email).maybeSingle()
  if (existingProfile) {
    return NextResponse.json(
      { error: 'An account already exists for this email. Sign in at /login with the Parent portal.' },
      { status: 409 }
    )
  }

  const { data: created, error: createErr } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: parentFullName },
  })

  if (createErr || !created.user) {
    return NextResponse.json({ error: createErr?.message ?? 'Could not create account' }, { status: 400 })
  }

  const userId = created.user.id

  try {
    // Upsert: Supabase projects often add a trigger on auth.users that inserts into profiles first;
    // a plain insert then fails with duplicate key (23505).
    const { error: profileErr } = await sb.from('profiles').upsert(
      {
        id: userId,
        role: 'parent',
        full_name: parentFullName,
        email,
      },
      { onConflict: 'id' }
    )
    if (profileErr) throw profileErr

    for (const kid of kids) {
      const { data: player, error: pErr } = await sb
        .from('players')
        .insert({
          first_name: kid.firstName,
          last_name: kid.lastName,
          age_group: kid.ageGroup,
          date_of_birth: kid.dateOfBirth,
        })
        .select('id')
        .single()
      if (pErr || !player) throw pErr ?? new Error('player insert failed')

      const { error: linkErr } = await sb.from('parent_players').insert({
        parent_user_id: userId,
        player_id: player.id,
      })
      if (linkErr) throw linkErr
    }

    const { error: bookErr } = await sb
      .from('assessment_bookings')
      .update({ parent_user_id: userId })
      .eq('stripe_session_id', sessionId)

    if (bookErr) {
      console.warn('[portal-signup] Could not link booking row:', bookErr.message)
    }
  } catch (e) {
    await sb.auth.admin.deleteUser(userId)
    const err = e as { message?: string; code?: string; details?: string; hint?: string }
    console.error('[portal-signup]', err?.code, err?.message, err?.details, err?.hint, e)
    const debug =
      process.env.NODE_ENV === 'development'
        ? [err?.code, err?.message, err?.details].filter(Boolean).join(' · ') || String(e)
        : undefined
    return NextResponse.json(
      {
        error: 'Signup failed. Try again or contact the front desk.',
        ...(debug ? { debug } : {}),
      },
      { status: 500 }
    )
  }

  const kidsSummary = kids.map(k => `${k.firstName} ${k.lastName} (${k.ageGroup}, DOB ${k.dateOfBirth})`).join('; ')

  await sendAdminNotification({
    subject: `[Formula] Parent portal created · ${email}`,
    html: `
      <p><strong>New guardian account + player(s)</strong></p>
      <ul>
        <li><strong>Email</strong>: ${escapeHtml(email)}</li>
        <li><strong>Guardian name</strong>: ${escapeHtml(parentFullName)}</li>
        <li><strong>Stripe session</strong>: ${escapeHtml(sessionId)}</li>
        <li><strong>User id</strong>: ${escapeHtml(userId)}</li>
        <li><strong>Athletes</strong>: ${escapeHtml(kidsSummary)}</li>
      </ul>
    `,
    text: `Portal signup: ${email} · ${kids.length} athlete(s) · session ${sessionId}`,
  })

  return NextResponse.json({ ok: true, userId })
}
