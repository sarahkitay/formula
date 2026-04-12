import { generateSkillCheckSlotInstants } from '@/lib/assessment/skill-check-slot-times'

/** Client-only local storage for the assessment booking gate (replace with real auth when wired). */
export const ASSESSMENT_PORTAL_ACCOUNT_KEY = 'formula_portal_assessment_account_v1'

export type AssessmentPortalAccount = {
  fullName: string
  email: string
  createdAt: string
}

export type AssessmentTimeSlot = {
  id: string
  startsAtIso: string
  label: string
}

export function readAssessmentPortalAccount(): AssessmentPortalAccount | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(ASSESSMENT_PORTAL_ACCOUNT_KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as Partial<AssessmentPortalAccount>
    if (typeof p.email !== 'string' || typeof p.fullName !== 'string' || !p.email.trim() || !p.fullName.trim()) {
      return null
    }
    return {
      email: p.email.trim(),
      fullName: p.fullName.trim(),
      createdAt: typeof p.createdAt === 'string' ? p.createdAt : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function writeAssessmentPortalAccount(account: Omit<AssessmentPortalAccount, 'createdAt'>): void {
  const v: AssessmentPortalAccount = { ...account, createdAt: new Date().toISOString() }
  localStorage.setItem(ASSESSMENT_PORTAL_ACCOUNT_KEY, JSON.stringify(v))
}

/** Fallback windows when API slots are unavailable; matches server rules (facility TZ, weekdays, 8–5). */
export function buildAssessmentTimeSlots(anchor: Date = new Date()): AssessmentTimeSlot[] {
  const instants = generateSkillCheckSlotInstants(24, anchor)
  return instants.map((d) => {
    const iso = d.toISOString()
    const id = `as-${iso.slice(0, 10)}-${iso.slice(11, 16).replace(':', '')}`
    return {
      id,
      startsAtIso: iso,
      label: 'Formula Skills Check · ~60 min',
    }
  })
}
