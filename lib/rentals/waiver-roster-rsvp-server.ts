import { getServiceSupabase } from '@/lib/supabase/service'

/** Minimal row needed to clone identity + signature for roster RSVP. */
export type PriorSignedAgreementForRsvp = {
  id: string
  participant_name: string
  participant_email: string
  participant_phone: string | null
  participant_address: string | null
  participant_dob: string
  parent_guardian_name: string | null
  organization_name: string | null
  emergency_contact: string | null
  signature_name: string
  signature_data_url: string
  rental_type: string
  submitted_at: string | null
}

function normName(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * RSVP name must match the name on the prior waiver (same person). Allows minor spacing differences
 * and substring match when one string is a clear superset (e.g. nickname vs legal).
 */
export function rosterRsvpNamesMatch(inputName: string, priorParticipantName: string): boolean {
  const a = normName(inputName)
  const b = normName(priorParticipantName)
  if (a.length < 2 || b.length < 2) return false
  if (a === b) return true
  if (a.includes(b) || b.includes(a)) return Math.min(a.length, b.length) >= 4
  const aw = a.split(' ')
  const bw = b.split(' ')
  if (aw.length >= 2 && bw.length >= 2) {
    if (aw[aw.length - 1] === bw[bw.length - 1] && aw[0] === bw[0]) return true
  }
  return false
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Latest qualifying signed waiver for this email (any roster/public flow). Skips rows created only as RSVP clones.
 */
export async function findPriorSignedAgreementForRsvp(email: string): Promise<PriorSignedAgreementForRsvp | null> {
  const em = normalizeEmail(email)
  if (em.length < 5 || !em.includes('@')) return null
  const sb = getServiceSupabase()
  if (!sb) return null

  const { data, error } = await sb
    .from('field_rental_agreements')
    .select(
      'id, participant_name, participant_email, participant_phone, participant_address, participant_dob, parent_guardian_name, organization_name, emergency_contact, signature_name, signature_data_url, rental_type, submitted_at, notes'
    )
    .ilike('participant_email', em)
    .not('signature_data_url', 'is', null)
    .order('submitted_at', { ascending: false })
    .limit(25)

  if (error || !data?.length) {
    if (error) console.warn('[waiver-roster-rsvp] find prior:', error.message)
    return null
  }

  for (const row of data as (PriorSignedAgreementForRsvp & { notes: string | null })[]) {
    const sig = String(row.signature_data_url ?? '')
    if (sig.length < 200) continue
    const notes = String(row.notes ?? '')
    if (notes.includes('RSVP — prior signed waiver on file')) continue
    return row
  }
  return null
}

/** True if this roster invite already has a row (waiver or RSVP) for this email. */
export async function rosterInviteHasEmail(inviteId: string, email: string): Promise<boolean> {
  const em = normalizeEmail(email)
  if (!em) return false
  const sb = getServiceSupabase()
  if (!sb) return false
  const { count, error } = await sb
    .from('field_rental_agreements')
    .select('id', { count: 'exact', head: true })
    .eq('waiver_invite_id', inviteId)
    .ilike('participant_email', em)
  if (error) {
    console.warn('[waiver-roster-rsvp] duplicate check:', error.message)
    return true
  }
  return (count ?? 0) > 0
}
