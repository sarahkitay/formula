import { getServiceSupabase } from '@/lib/supabase/service'
import { isUuid } from '@/lib/rentals/field-rental-waiver-labels'

export type FieldRentalAgreementInsert = {
  rental_type: string
  participant_name: string
  participant_email: string
  participant_phone: string | null
  participant_address: string | null
  participant_dob: string
  parent_guardian_name: string | null
  participant_count: number | null
  organization_name: string | null
  emergency_contact: string | null
  signature_name: string
  signature_data_url: string
  notes: string | null
  agreement_accepted: boolean
  risk_accepted: boolean
  rules_accepted: boolean
  stripe_checkout_session_id?: string | null
  /** When set, this waiver counts toward roster progress for that invite link. */
  waiver_invite_id?: string | null
  checkout_amount_total_cents?: number | null
  checkout_currency?: string | null
  booking_rental_field?: string | null
  booking_rental_window?: string | null
  booking_rental_date?: string | null
  booking_rental_dates_compact?: string | null
  booking_session_weeks?: number | null
  booking_headcount_at_checkout?: number | null
}

export type FieldRentalAgreementRow = {
  id: string
  submitted_at: string | null
  rental_type: string
  participant_name: string
  participant_email: string
  participant_phone: string | null
  participant_address: string | null
  participant_dob: string
  parent_guardian_name: string | null
  participant_count: number | null
  organization_name: string | null
  emergency_contact: string | null
  signature_name: string
  notes: string | null
  waiver_invite_id: string | null
  checkout_amount_total_cents: number | null
  checkout_currency: string | null
  booking_rental_field: string | null
  booking_rental_window: string | null
  booking_rental_date: string | null
  booking_rental_dates_compact: string | null
  booking_session_weeks: number | null
  booking_headcount_at_checkout: number | null
  /** Populated in admin list when this waiver is tied to a paid roster link. */
  roster_organizer_name?: string | null
  roster_organizer_email?: string | null
}

/** Full row for admin detail + PDF (includes signature image data URL). */
export type FieldRentalAgreementFull = FieldRentalAgreementRow & {
  signature_data_url: string
  agreement_accepted: boolean
  risk_accepted: boolean
  rules_accepted: boolean
  stripe_checkout_session_id: string | null
  source: string
}

export async function insertFieldRentalAgreement(
  row: FieldRentalAgreementInsert
): Promise<{ ok: true; id: string } | { ok: false; message: string }> {
  const supabase = getServiceSupabase()
  if (!supabase) {
    return { ok: false, message: 'Database not configured (set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY).' }
  }

  const { data, error } = await supabase
    .from('field_rental_agreements')
    .insert({
      rental_type: row.rental_type,
      participant_name: row.participant_name,
      participant_email: row.participant_email,
      participant_phone: row.participant_phone,
      participant_address: row.participant_address,
      participant_dob: row.participant_dob,
      parent_guardian_name: row.parent_guardian_name,
      participant_count: row.participant_count,
      organization_name: row.organization_name,
      emergency_contact: row.emergency_contact,
      signature_name: row.signature_name,
      signature_data_url: row.signature_data_url,
      notes: row.notes,
      agreement_accepted: row.agreement_accepted,
      risk_accepted: row.risk_accepted,
      rules_accepted: row.rules_accepted,
      stripe_checkout_session_id: row.stripe_checkout_session_id ?? null,
      waiver_invite_id: row.waiver_invite_id ?? null,
      checkout_amount_total_cents: row.checkout_amount_total_cents ?? null,
      checkout_currency: row.checkout_currency ?? null,
      booking_rental_field: row.booking_rental_field ?? null,
      booking_rental_window: row.booking_rental_window ?? null,
      booking_rental_date: row.booking_rental_date ?? null,
      booking_rental_dates_compact: row.booking_rental_dates_compact ?? null,
      booking_session_weeks: row.booking_session_weeks ?? null,
      booking_headcount_at_checkout: row.booking_headcount_at_checkout ?? null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[field-rental-agreements] insert:', error.message)
    const msg = error.message ?? ''
    if (
      msg.includes('participant_address') ||
      msg.includes('emergency_contact') ||
      msg.includes("Could not find the") ||
      msg.includes('column') && msg.includes('schema cache')
    ) {
      return {
        ok: false,
        message:
          'Database is missing new waiver columns (address, emergency contact). In Supabase SQL Editor, run the migration file `supabase/field_rental_agreements_participant_address_emergency.sql` (or the matching block at the end of `supabase/ALL_MIGRATIONS.sql`), then try again.',
      }
    }
    return { ok: false, message: 'Could not save agreement. Confirm the migration ran and the service role key is set.' }
  }
  return { ok: true, id: (data as { id: string }).id }
}

export async function listFieldRentalAgreementsRecent(limit = 100): Promise<FieldRentalAgreementRow[]> {
  const supabase = getServiceSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('field_rental_agreements')
    .select(
      'id, submitted_at, rental_type, participant_name, participant_email, participant_phone, participant_address, participant_dob, parent_guardian_name, participant_count, organization_name, emergency_contact, signature_name, notes, waiver_invite_id, checkout_amount_total_cents, checkout_currency, booking_rental_field, booking_rental_window, booking_rental_date, booking_rental_dates_compact, booking_session_weeks, booking_headcount_at_checkout'
    )
    .order('submitted_at', { ascending: false })
    .limit(Math.min(500, Math.max(1, limit)))

  if (error) {
    console.warn('[field-rental-agreements] list:', error.message)
    return []
  }

  const baseRows = (data ?? []) as FieldRentalAgreementRow[]
  const inviteIds = [...new Set(baseRows.map(r => r.waiver_invite_id).filter((id): id is string => Boolean(id)))]
  if (inviteIds.length === 0) return baseRows

  const { data: invData, error: invErr } = await supabase
    .from('field_rental_waiver_invites')
    .select('id, purchaser_name, purchaser_email')
    .in('id', inviteIds)

  if (invErr || !invData?.length) return baseRows

  const invMap = new Map(
    (invData as { id: string; purchaser_name: string | null; purchaser_email: string | null }[]).map(i => [i.id, i])
  )

  return baseRows.map(r => {
    const inv = r.waiver_invite_id ? invMap.get(r.waiver_invite_id) : undefined
    return {
      ...r,
      roster_organizer_name: inv?.purchaser_name ?? null,
      roster_organizer_email: inv?.purchaser_email ?? null,
    }
  })
}

export async function getFieldRentalAgreementById(id: string): Promise<FieldRentalAgreementFull | null> {
  if (!isUuid(id)) return null
  const supabase = getServiceSupabase()
  if (!supabase) return null

  const { data, error } = await supabase.from('field_rental_agreements').select('*').eq('id', id).maybeSingle()

  if (error) {
    console.warn('[field-rental-agreements] get by id:', error.message)
    return null
  }
  if (!data) return null
  return data as FieldRentalAgreementFull
}
