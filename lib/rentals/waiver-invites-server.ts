import { randomBytes } from 'crypto'
import type Stripe from 'stripe'
import { isKnownRentalFieldId } from '@/lib/rentals/field-rental-picker-constants'
import { formatFieldRentalBookingSummaryLine } from '@/lib/rentals/field-rental-agreement-admin-display'
import { decodeRentalDatesCompact, encodeRentalDatesCompact, weeklyOccurrenceDatesIso } from '@/lib/rentals/rental-weekly-dates'
import { encodeRentalWindow, isValidFieldRentalWindow } from '@/lib/rentals/rental-time-window'
import {
  syncFieldRentalInviteToStripePurchasesLedger,
  type FieldRentalInviteLedgerPayload,
} from '@/lib/billing/stripe-purchases-server'
import { recordOfflineFieldRentalPurchase, resolveCheckoutPurchaseType } from '@/lib/stripe/record-purchase'
import { getServiceSupabase } from '@/lib/supabase/service'

export type WaiverInviteRow = {
  id: string
  token: string
  created_at: string
  expected_waiver_count: number
  rental_ref: string | null
  rental_type: string | null
  stripe_checkout_session_id: string | null
  notes: string | null
  /** Set when invite is created from paid Checkout (migration adds columns). */
  purchaser_name?: string | null
  purchaser_email?: string | null
  checkout_amount_total_cents?: number | null
  checkout_currency?: string | null
  checkout_completed_at?: string | null
  booking_rental_field?: string | null
  booking_rental_window?: string | null
  booking_rental_date?: string | null
  booking_rental_dates_compact?: string | null
  booking_session_weeks?: number | null
}

export type SignedWaiverOnInvite = {
  id: string
  participant_name: string
  participant_email: string
  submitted_at: string | null
  /** True when signer email matches the invite purchaser email (Stripe payer / organizer). */
  is_organizer_waiver: boolean
  /** Field / window / dates stored on this agreement row when submitted. */
  session_summary: string | null
}

export type WaiverInviteWithProgress = WaiverInviteRow & {
  completed_count: number
  remaining_count: number
  signed_waivers: SignedWaiverOnInvite[]
}

function newInviteToken(): string {
  return randomBytes(18).toString('hex')
}

/** Count agreements linked to this invite (one row = one signed waiver). */
export async function countWaiversForInviteId(inviteId: string): Promise<number> {
  const supabase = getServiceSupabase()
  if (!supabase) return 0
  const { count, error } = await supabase
    .from('field_rental_agreements')
    .select('id', { count: 'exact', head: true })
    .eq('waiver_invite_id', inviteId)
  if (error) {
    console.warn('[waiver-invites] count:', error.message)
    return 0
  }
  return count ?? 0
}

export async function getWaiverInviteById(id: string): Promise<WaiverInviteRow | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id.trim())) return null
  const supabase = getServiceSupabase()
  if (!supabase) return null
  const { data, error } = await supabase.from('field_rental_waiver_invites').select('*').eq('id', id.trim()).maybeSingle()
  if (error) {
    console.warn('[waiver-invites] get by id:', error.message)
    return null
  }
  return data as WaiverInviteRow | null
}

export async function getWaiverInviteByToken(token: string): Promise<WaiverInviteRow | null> {
  const t = token.trim()
  if (t.length < 16 || t.length > 64 || !/^[a-f0-9]+$/i.test(t)) return null
  const supabase = getServiceSupabase()
  if (!supabase) return null
  const { data, error } = await supabase.from('field_rental_waiver_invites').select('*').eq('token', t).maybeSingle()
  if (error) {
    console.warn('[waiver-invites] get by token:', error.message)
    return null
  }
  return data as WaiverInviteRow | null
}

export async function getWaiverInviteByStripeSessionId(sessionId: string): Promise<WaiverInviteRow | null> {
  const sid = sessionId.trim()
  if (!sid.startsWith('cs_')) return null
  const supabase = getServiceSupabase()
  if (!supabase) return null
  const { data, error } = await supabase.from('field_rental_waiver_invites').select('*').eq('stripe_checkout_session_id', sid).maybeSingle()
  if (error) {
    console.warn('[waiver-invites] get by session:', error.message)
    return null
  }
  return data as WaiverInviteRow | null
}

function isPlausibleEmail(s: string): boolean {
  const t = s.trim().toLowerCase()
  return t.length > 3 && t.includes('@') && t.includes('.')
}

/** Admin: fix organizer label when Stripe didn’t capture `customer_details.name`. */
export async function updateWaiverInviteOrganizer(params: {
  id: string
  purchaserName: string
  purchaserEmail: string
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const id = params.id.trim()
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return { ok: false, message: 'Invalid invite id.' }
  }
  const nameTrim = params.purchaserName.trim()
  const emailTrim = params.purchaserEmail.trim().toLowerCase()
  const hasName = nameTrim.length >= 2
  const hasEmail = emailTrim.length > 0 && isPlausibleEmail(emailTrim)
  if (!hasName && !hasEmail) {
    return {
      ok: false,
      message: 'Enter an organizer name (at least 2 characters) and/or a valid email.',
    }
  }
  const supabase = getServiceSupabase()
  if (!supabase) {
    return { ok: false, message: 'Database not configured.' }
  }
  const { error } = await supabase
    .from('field_rental_waiver_invites')
    .update({
      purchaser_name: hasName ? nameTrim : null,
      purchaser_email: hasEmail ? emailTrim : null,
    })
    .eq('id', id)
  if (error) {
    console.error('[waiver-invites] update organizer:', error.message)
    return { ok: false, message: 'Could not save organizer details.' }
  }
  return { ok: true }
}

const YMD = /^\d{4}-\d{2}-\d{2}$/

/** Admin: correct payment + field / time / dates on the roster invite (and future waiver rows still merge from invite). */
export async function updateWaiverInviteSessionAndPayment(params: {
  id: string
  checkout_amount_total_cents: number | null
  checkout_currency: string | null
  checkout_completed_at: string | null
  booking_rental_field: string | null
  booking_rental_window: string | null
  booking_rental_date: string | null
  booking_rental_dates_compact: string | null
  booking_session_weeks: number | null
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const id = params.id.trim()
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return { ok: false, message: 'Invalid invite id.' }
  }

  const cents = params.checkout_amount_total_cents
  if (cents != null && (!Number.isFinite(cents) || cents < 0 || cents > 50_000_000)) {
    return { ok: false, message: 'Amount (cents) must be between 0 and a reasonable maximum.' }
  }

  const cur = (params.checkout_currency ?? 'usd').trim().toLowerCase()
  if (cur.length !== 3) {
    return { ok: false, message: 'Currency must be a 3-letter ISO code (e.g. usd).' }
  }

  let paidAt: string | null = params.checkout_completed_at?.trim() || null
  if (paidAt) {
    const t = Date.parse(paidAt)
    if (!Number.isFinite(t)) {
      return { ok: false, message: 'Paid-at must be a valid ISO date/time.' }
    }
    paidAt = new Date(t).toISOString()
  }

  const field = params.booking_rental_field?.trim() || null
  if (field && !isKnownRentalFieldId(field)) {
    return { ok: false, message: 'Unknown rental field id. Use field_1, field_2, field_3, or legacy ids from the picker.' }
  }

  const win = params.booking_rental_window?.trim() || null
  if (win && !isValidFieldRentalWindow(win)) {
    return {
      ok: false,
      message: 'Rental window must match checkout format (e.g. 6:00 AM|90 for start + duration in minutes).',
    }
  }

  const anchor = params.booking_rental_date?.trim() || null
  if (anchor && !YMD.test(anchor)) {
    return { ok: false, message: 'Anchor session date must be YYYY-MM-DD.' }
  }

  const compact = params.booking_rental_dates_compact?.trim().replace(/\s/g, '') || null
  if (compact) {
    const dec = decodeRentalDatesCompact(compact)
    if (dec.length === 0) {
      return { ok: false, message: 'Session dates compact string is invalid (use digits only, 8 per date, as in checkout metadata).' }
    }
  }

  let weeks: number | null = params.booking_session_weeks
  if (weeks != null) {
    weeks = Math.round(weeks)
    if (!Number.isFinite(weeks) || weeks < 1 || weeks > 52) {
      return { ok: false, message: 'Session weeks must be between 1 and 52, or leave empty.' }
    }
  }

  const supabase = getServiceSupabase()
  if (!supabase) {
    return { ok: false, message: 'Database not configured.' }
  }

  const { error } = await supabase
    .from('field_rental_waiver_invites')
    .update({
      checkout_amount_total_cents: cents,
      checkout_currency: cur,
      checkout_completed_at: paidAt,
      booking_rental_field: field,
      booking_rental_window: win,
      booking_rental_date: anchor,
      booking_rental_dates_compact: compact,
      booking_session_weeks: weeks,
    })
    .eq('id', id)

  if (error) {
    console.error('[waiver-invites] update snapshot:', error.message)
    return { ok: false, message: 'Could not save payment and session details.' }
  }

  const { data: syncedInvite, error: readErr } = await supabase
    .from('field_rental_waiver_invites')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (!readErr && syncedInvite) {
    await syncFieldRentalInviteToStripePurchasesLedger(syncedInvite as unknown as FieldRentalInviteLedgerPayload)
  }

  return { ok: true }
}

export async function createManualWaiverInvite(params: {
  expectedWaiverCount: number
  rentalType?: string | null
  rentalRef?: string | null
  notes?: string | null
}): Promise<{ ok: true; token: string } | { ok: false; message: string }> {
  const n = Math.floor(params.expectedWaiverCount)
  if (!Number.isFinite(n) || n < 1 || n > 500) {
    return { ok: false, message: 'Expected waiver count must be between 1 and 500.' }
  }
  const supabase = getServiceSupabase()
  if (!supabase) {
    return { ok: false, message: 'Database not configured.' }
  }
  const token = newInviteToken()
  const { error } = await supabase.from('field_rental_waiver_invites').insert({
    token,
    expected_waiver_count: n,
    rental_ref: params.rentalRef?.trim() || null,
    rental_type: params.rentalType?.trim() || null,
    notes: params.notes?.trim() || null,
    stripe_checkout_session_id: null,
  })
  if (error) {
    console.error('[waiver-invites] manual insert:', error.message)
    return { ok: false, message: 'Could not create invite.' }
  }
  return { ok: true, token }
}

const COACH_RENTAL_TYPES = new Set(['club_team_practice', 'private_semi_private', 'general_pickup'])

export type PaidInPersonFieldRentalInviteParams = {
  expectedWaiverCount: number
  amountTotalCents: number
  currency: string
  purchaserName: string
  purchaserEmail: string | null
  rentalType: string
  rentalField: string
  slotStart: string
  durationMinutes: number
  anchorSessionDate: string
  sessionWeeks: number
  rentalRef: string | null
  notes: string | null
}

/**
 * Admin: field rental paid in person — roster waiver link (same snapshot columns as Stripe checkout invites)
 * plus a `stripe_purchases` row with a synthetic session id so Payments / revenue include the deposit.
 */
export async function createPaidInPersonFieldRentalInvite(
  params: PaidInPersonFieldRentalInviteParams
): Promise<{ ok: true; token: string } | { ok: false; message: string }> {
  const n = Math.floor(params.expectedWaiverCount)
  if (!Number.isFinite(n) || n < 1 || n > 500) {
    return { ok: false, message: 'Expected waiver count must be between 1 and 500.' }
  }
  if (!COACH_RENTAL_TYPES.has(params.rentalType)) {
    return { ok: false, message: 'Choose a rental type for this booking.' }
  }
  if (!Number.isFinite(params.amountTotalCents) || params.amountTotalCents < 50) {
    return { ok: false, message: 'Amount must be at least $0.50 (50 cents).' }
  }
  const anchor = params.anchorSessionDate.trim()
  if (!YMD.test(anchor)) {
    return { ok: false, message: 'Session date must be YYYY-MM-DD.' }
  }
  const weeks = Math.floor(params.sessionWeeks)
  if (!Number.isFinite(weeks) || weeks < 1 || weeks > 52) {
    return { ok: false, message: 'Session weeks must be between 1 and 52.' }
  }
  if (!isKnownRentalFieldId(params.rentalField)) {
    return { ok: false, message: 'Invalid field selection.' }
  }
  const rentalWindow = encodeRentalWindow(params.slotStart, params.durationMinutes)
  if (!isValidFieldRentalWindow(rentalWindow)) {
    return { ok: false, message: 'Invalid start time or duration for a field rental window.' }
  }
  const purchaserName = params.purchaserName.trim()
  if (purchaserName.length < 2) {
    return { ok: false, message: 'Purchaser / payer name is required.' }
  }

  const dates = weeklyOccurrenceDatesIso(anchor, weeks)
  const compact = encodeRentalDatesCompact(dates)
  const rental_ref = params.rentalRef?.trim() || `inperson_${randomBytes(5).toString('hex')}`
  const paidAtIso = new Date().toISOString()
  const currency = (params.currency || 'usd').toLowerCase().slice(0, 8)

  const supabase = getServiceSupabase()
  if (!supabase) {
    return { ok: false, message: 'Database not configured.' }
  }

  const token = newInviteToken()
  const { data: inv, error: invErr } = await supabase
    .from('field_rental_waiver_invites')
    .insert({
      token,
      expected_waiver_count: n,
      rental_ref,
      rental_type: params.rentalType,
      stripe_checkout_session_id: null,
      notes: params.notes?.trim() || null,
      purchaser_name: purchaserName,
      purchaser_email: params.purchaserEmail?.trim() || null,
      checkout_amount_total_cents: Math.round(params.amountTotalCents),
      checkout_currency: currency,
      checkout_completed_at: paidAtIso,
      booking_rental_field: params.rentalField,
      booking_rental_window: rentalWindow,
      booking_rental_date: anchor,
      booking_rental_dates_compact: compact.length > 0 ? compact : null,
      booking_session_weeks: weeks,
    })
    .select('id, token')
    .single()

  if (invErr || !inv) {
    console.error('[waiver-invites] paid-in-person invite:', invErr?.message)
    return { ok: false, message: 'Could not create roster invite.' }
  }

  const inviteId = (inv as { id: string; token: string }).id
  const inviteToken = (inv as { id: string; token: string }).token

  const metadata: Record<string, string> = {
    type: 'field-rental-booking',
    rental_ref,
    rental_field: params.rentalField,
    rental_window: rentalWindow,
    rental_date: anchor,
    rental_dates_compact: compact,
    rental_weeks: String(weeks),
    rental_participants: String(n),
    rental_type: params.rentalType,
    renter_name: purchaserName,
    admin_offline: 'true',
    waiver_invite_id: inviteId,
  }

  const recorded = await recordOfflineFieldRentalPurchase({
    amountCents: Math.round(params.amountTotalCents),
    currency,
    email: params.purchaserEmail?.trim() || null,
    metadata,
  })

  if (!recorded.ok) {
    await supabase.from('field_rental_waiver_invites').delete().eq('id', inviteId)
    return { ok: false, message: recorded.message }
  }

  const { error: linkLedgerErr } = await supabase
    .from('field_rental_waiver_invites')
    .update({ stripe_checkout_session_id: recorded.stripe_session_id })
    .eq('id', inviteId)
  if (linkLedgerErr) {
    console.error('[waiver-invites] link ledger session to invite:', linkLedgerErr.message)
  }

  return { ok: true, token: inviteToken }
}

/**
 * After a paid field-rental checkout, ensure a roster invite exists (idempotent on stripe session id).
 * Snapshots purchaser, amount, and booking metadata for admin roster view.
 */
export async function ensureWaiverInviteForPaidFieldRental(session: Stripe.Checkout.Session): Promise<void> {
  const m = session.metadata ?? {}
  if (resolveCheckoutPurchaseType(session) !== 'field-rental-booking') return
  const sid = session.id?.trim()
  if (!sid) return
  const expected = parseInt(m.rental_participants ?? '1', 10)
  const count = Number.isFinite(expected) && expected >= 1 && expected <= 500 ? expected : 1
  const supabase = getServiceSupabase()
  if (!supabase) return

  const existing = await getWaiverInviteByStripeSessionId(sid)
  if (existing) return

  const purchaserName =
    session.customer_details?.name?.trim() ||
    (typeof m.renter_name === 'string' ? m.renter_name.trim() : '') ||
    null
  const purchaserEmail = (session.customer_details?.email ?? session.customer_email ?? '').trim() || null
  const weeksRaw = parseInt(m.rental_weeks ?? '', 10)
  const booking_session_weeks = Number.isFinite(weeksRaw) && weeksRaw >= 1 ? weeksRaw : null
  const paidAtIso = new Date().toISOString()

  const token = newInviteToken()
  const { error } = await supabase.from('field_rental_waiver_invites').insert({
    token,
    expected_waiver_count: count,
    rental_ref: m.rental_ref?.trim() || null,
    rental_type: m.rental_type?.trim() || null,
    stripe_checkout_session_id: sid,
    notes: null,
    purchaser_name: purchaserName,
    purchaser_email: purchaserEmail,
    checkout_amount_total_cents: session.amount_total ?? null,
    checkout_currency: session.currency ?? 'usd',
    checkout_completed_at: paidAtIso,
    booking_rental_field: m.rental_field?.trim() || null,
    booking_rental_window: m.rental_window?.trim() || null,
    booking_rental_date: m.rental_date?.trim() || null,
    booking_rental_dates_compact: m.rental_dates_compact?.trim() || null,
    booking_session_weeks,
  })
  if (error) {
    if (error.code === '23505') return
    console.error('[waiver-invites] checkout insert:', error.message)
  }
}

export async function resolveWaiverInviteIdFromToken(token: string): Promise<string | null> {
  const row = await getWaiverInviteByToken(token)
  return row?.id ?? null
}

export async function listWaiverInvitesWithProgress(limit = 50): Promise<WaiverInviteWithProgress[]> {
  const supabase = getServiceSupabase()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('field_rental_waiver_invites')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(Math.min(100, Math.max(1, limit)))

  if (error || !data) {
    console.warn('[waiver-invites] list:', error?.message)
    return []
  }

  const rows = data as WaiverInviteRow[]
  const ids = rows.map(r => r.id)

  let waiverRows: {
    id: string
    waiver_invite_id: string | null
    participant_name: string
    participant_email: string
    submitted_at: string | null
    booking_rental_field: string | null
    booking_rental_window: string | null
    booking_rental_date: string | null
    booking_rental_dates_compact: string | null
    booking_session_weeks: number | null
    booking_headcount_at_checkout: number | null
  }[] = []

  if (ids.length > 0) {
    const { data: wData, error: wErr } = await supabase
      .from('field_rental_agreements')
      .select(
        'id, waiver_invite_id, participant_name, participant_email, submitted_at, booking_rental_field, booking_rental_window, booking_rental_date, booking_rental_dates_compact, booking_session_weeks, booking_headcount_at_checkout'
      )
      .in('waiver_invite_id', ids)
      .order('submitted_at', { ascending: true })
    if (wErr) {
      console.warn('[waiver-invites] list signed waivers:', wErr.message)
    } else {
      waiverRows = (wData ?? []) as typeof waiverRows
    }
  }

  const byInvite = new Map<string, SignedWaiverOnInvite[]>()
  const completedByInvite = new Map<string, number>()
  const organizerEmailByInvite = new Map<string, string>()
  for (const r of rows) {
    const em = r.purchaser_email?.trim().toLowerCase()
    if (em) organizerEmailByInvite.set(r.id, em)
  }

  for (const w of waiverRows) {
    if (!w.waiver_invite_id) continue
    completedByInvite.set(w.waiver_invite_id, (completedByInvite.get(w.waiver_invite_id) ?? 0) + 1)
    const list = byInvite.get(w.waiver_invite_id) ?? []
    const orgEm = organizerEmailByInvite.get(w.waiver_invite_id) ?? ''
    const signerEm = w.participant_email.trim().toLowerCase()
    const session_summary = formatFieldRentalBookingSummaryLine({
      booking_rental_field: w.booking_rental_field,
      booking_rental_window: w.booking_rental_window,
      booking_rental_date: w.booking_rental_date,
      booking_rental_dates_compact: w.booking_rental_dates_compact,
      booking_session_weeks: w.booking_session_weeks,
      booking_headcount_at_checkout: w.booking_headcount_at_checkout,
    })
    list.push({
      id: w.id,
      participant_name: w.participant_name,
      participant_email: w.participant_email,
      submitted_at: w.submitted_at,
      is_organizer_waiver: Boolean(orgEm && signerEm === orgEm),
      session_summary: session_summary === '—' ? null : session_summary,
    })
    byInvite.set(w.waiver_invite_id, list)
  }

  const out: WaiverInviteWithProgress[] = []
  for (const row of rows) {
    const completed = completedByInvite.get(row.id) ?? 0
    out.push({
      ...row,
      completed_count: completed,
      remaining_count: Math.max(0, row.expected_waiver_count - completed),
      signed_waivers: byInvite.get(row.id) ?? [],
    })
  }
  return out
}
