'use server'

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

  if (!rentalType || !participantName || !participantEmail || !participantDob || !signatureDataUrl) {
    return {
      ok: false,
      message: 'Missing required fields. Name, email, date of birth, and signature are required.',
    }
  }

  if (!agreementAccepted || !riskAccepted || !rulesAccepted) {
    return {
      ok: false,
      message: 'Please accept all required agreement statements before submitting.',
    }
  }

  // TODO(db): replace with persistent write once rentals table is connected.
  // Keep payload shape stable so wiring to DB later is straightforward.
  const payload = {
    submittedAtIso: new Date().toISOString(),
    rentalType,
    participantName,
    participantEmail,
    participantPhone: getRequiredString(formData, 'participantPhone') ?? null,
    participantDob,
    parentGuardianName: getRequiredString(formData, 'parentGuardianName') ?? null,
    participantCount: getRequiredString(formData, 'participantCount') ?? null,
    organizationName: getRequiredString(formData, 'organizationName') ?? null,
    signatureName: getRequiredString(formData, 'signatureName') ?? null,
    signatureDataUrl,
    notes: getRequiredString(formData, 'notes') ?? null,
  }

  console.info('Field rental agreement captured (pending DB):', payload)

  return {
    ok: true,
    message: 'Agreement submitted. Saved for now and ready for DB persistence once connected.',
  }
}
