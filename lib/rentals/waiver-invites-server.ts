import { randomBytes } from 'crypto'
import type Stripe from 'stripe'
import { getServiceSupabase } from '@/lib/supabase/service'

export type WaiverInviteRow = {
  id: string
  token: string
  expected_waiver_count: number
  rental_ref: string | null
  rental_type: string | null
  stripe_checkout_session_id: string | null
  notes: string | null
  created_at: string
}

export type WaiverInviteWithProgress = WaiverInviteRow & {
  completed_count: number
  remaining_count: number
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

/**
 * After a paid field-rental checkout, ensure a roster invite exists (idempotent on stripe session id).
 * Uses metadata.rental_participants as expected waiver count.
 */
export async function ensureWaiverInviteForPaidFieldRental(session: Stripe.Checkout.Session): Promise<void> {
  const m = session.metadata ?? {}
  if (m.type !== 'field-rental-booking') return
  const sid = session.id?.trim()
  if (!sid) return
  const expected = parseInt(m.rental_participants ?? '1', 10)
  const count = Number.isFinite(expected) && expected >= 1 && expected <= 500 ? expected : 1
  const supabase = getServiceSupabase()
  if (!supabase) return

  const existing = await getWaiverInviteByStripeSessionId(sid)
  if (existing) return

  const token = newInviteToken()
  const { error } = await supabase.from('field_rental_waiver_invites').insert({
    token,
    expected_waiver_count: count,
    rental_ref: m.rental_ref?.trim() || null,
    rental_type: m.rental_type?.trim() || null,
    stripe_checkout_session_id: sid,
    notes: null,
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

export async function listWaiverInvitesWithProgress(limit = 40): Promise<WaiverInviteWithProgress[]> {
  const supabase = getServiceSupabase()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('field_rental_waiver_invites')
    .select('id, token, expected_waiver_count, rental_ref, rental_type, stripe_checkout_session_id, notes, created_at')
    .order('created_at', { ascending: false })
    .limit(Math.min(100, Math.max(1, limit)))

  if (error || !data) {
    console.warn('[waiver-invites] list:', error?.message)
    return []
  }

  const rows = data as WaiverInviteRow[]
  const out: WaiverInviteWithProgress[] = []
  for (const row of rows) {
    const completed = await countWaiversForInviteId(row.id)
    out.push({
      ...row,
      completed_count: completed,
      remaining_count: Math.max(0, row.expected_waiver_count - completed),
    })
  }
  return out
}
