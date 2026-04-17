import { getServiceSupabase } from '@/lib/supabase/service'

export type FieldRentalAgreementInsert = {
  rental_type: string
  participant_name: string
  participant_email: string
  participant_phone: string | null
  participant_dob: string
  parent_guardian_name: string | null
  participant_count: number | null
  organization_name: string | null
  signature_name: string
  signature_data_url: string
  notes: string | null
  agreement_accepted: boolean
  risk_accepted: boolean
  rules_accepted: boolean
  stripe_checkout_session_id?: string | null
}

export type FieldRentalAgreementRow = {
  id: string
  submitted_at: string
  rental_type: string
  participant_name: string
  participant_email: string
  participant_phone: string | null
  participant_dob: string
  parent_guardian_name: string | null
  participant_count: number | null
  organization_name: string | null
  signature_name: string
  notes: string | null
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
      participant_dob: row.participant_dob,
      parent_guardian_name: row.parent_guardian_name,
      participant_count: row.participant_count,
      organization_name: row.organization_name,
      signature_name: row.signature_name,
      signature_data_url: row.signature_data_url,
      notes: row.notes,
      agreement_accepted: row.agreement_accepted,
      risk_accepted: row.risk_accepted,
      rules_accepted: row.rules_accepted,
      stripe_checkout_session_id: row.stripe_checkout_session_id ?? null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[field-rental-agreements] insert:', error.message)
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
      'id, submitted_at, rental_type, participant_name, participant_email, participant_phone, participant_dob, parent_guardian_name, participant_count, organization_name, signature_name, notes'
    )
    .order('submitted_at', { ascending: false })
    .limit(Math.min(500, Math.max(1, limit)))

  if (error) {
    console.warn('[field-rental-agreements] list:', error.message)
    return []
  }
  return (data ?? []) as FieldRentalAgreementRow[]
}
