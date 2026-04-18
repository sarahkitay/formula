'use server'

import { revalidatePath } from 'next/cache'
import { escapeHtml, sendAdminNotification } from '@/lib/email/send-admin-notification'
import { insertFieldRentalAgreement } from '@/lib/rentals/field-rental-agreements-server'

export type RentalAgreementState = {
  ok: boolean
  message: string
}

const INITIAL_STATE: RentalAgreementState = {
  ok: false,
  message: '',
}

function getRequiredString(formData: FormData, key: string): string | null {
  const value = formData.get(key)
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export async function submitFieldRentalAgreement(
  _prevState: RentalAgreementState = INITIAL_STATE,
  formData: FormData
): Promise<RentalAgreementState> {
  const rentalType = getRequiredString(formData, 'rentalType')
  const participantName = getRequiredString(formData, 'participantName')
  const participantEmail = getRequiredString(formData, 'participantEmail')
  const participantDob = getRequiredString(formData, 'participantDob')
  const signatureDataUrl = getRequiredString(formData, 'signatureDataUrl')
  const agreementAccepted = formData.get('agreementAccepted') === 'on'
  const riskAccepted = formData.get('riskAccepted') === 'on'
  const rulesAccepted = formData.get('rulesAccepted') === 'on'

  const signatureName = getRequiredString(formData, 'signatureName')
  if (!rentalType || !participantName || !participantEmail || !participantDob || !signatureDataUrl || !signatureName) {
    return {
      ok: false,
      message: 'Missing required fields. Name, email, date of birth, printed signature name, and signature are required.',
    }
  }

  if (!agreementAccepted || !riskAccepted || !rulesAccepted) {
    return {
      ok: false,
      message: 'Please accept all required agreement statements before submitting.',
    }
  }

  const participantCountRaw = getRequiredString(formData, 'participantCount')
  let participant_count: number | null = null
  if (participantCountRaw) {
    const n = parseInt(participantCountRaw, 10)
    if (Number.isFinite(n) && n > 0) participant_count = n
  }

  const saved = await insertFieldRentalAgreement({
    rental_type: rentalType,
    participant_name: participantName,
    participant_email: participantEmail,
    participant_phone: getRequiredString(formData, 'participantPhone') ?? null,
    participant_dob: participantDob,
    parent_guardian_name: getRequiredString(formData, 'parentGuardianName') ?? null,
    participant_count,
    organization_name: getRequiredString(formData, 'organizationName') ?? null,
    signature_name: signatureName,
    signature_data_url: signatureDataUrl,
    notes: getRequiredString(formData, 'notes') ?? null,
    agreement_accepted: agreementAccepted,
    risk_accepted: riskAccepted,
    rules_accepted: rulesAccepted,
  })

  if (!saved.ok) {
    return { ok: false, message: saved.message }
  }

  revalidatePath('/admin/rentals')

  await sendAdminNotification({
    subject: `[Formula] Field rental agreement · ${participantName}`,
    html: `
      <p><strong>Field rental waiver submitted</strong></p>
      <ul>
        <li><strong>Agreement id</strong>: ${escapeHtml(saved.id)}</li>
        <li><strong>Rental type</strong>: ${escapeHtml(rentalType)}</li>
        <li><strong>Participant</strong>: ${escapeHtml(participantName)}</li>
        <li><strong>Email</strong>: ${escapeHtml(participantEmail)}</li>
        <li><strong>DOB</strong>: ${escapeHtml(participantDob)}</li>
        <li><strong>Printed signer</strong>: ${escapeHtml(signatureName)}</li>
        <li><strong>Headcount</strong>: ${participant_count != null ? escapeHtml(String(participant_count)) : '—'}</li>
      </ul>
      <p>Signature image is stored securely with this waiver for staff review.</p>
    `,
    text: `Field rental agreement saved\nid: ${saved.id}\n${participantName} <${participantEmail}>`,
  })

  return {
    ok: true,
    message: 'Agreement saved.',
  }
}
