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

/** Published-style assessment windows (mock); weekdays only, spread across the next few weeks. */
export function buildAssessmentTimeSlots(anchor: Date = new Date()): AssessmentTimeSlot[] {
  const out: AssessmentTimeSlot[] = []
  const start = new Date(anchor)
  start.setHours(0, 0, 0, 0)
  let added = 0
  for (let dayOffset = 1; dayOffset <= 28 && added < 8; dayOffset++) {
    const d = new Date(start)
    d.setDate(d.getDate() + dayOffset)
    const dow = d.getDay()
    if (dow === 0 || dow === 6) continue
    const hour = added % 2 === 0 ? 10 : 15
    d.setHours(hour, 0, 0, 0)
    if (d.getTime() <= anchor.getTime()) continue
    const y = d.getFullYear()
    const mo = String(d.getMonth() + 1).padStart(2, '0')
    const da = String(d.getDate()).padStart(2, '0')
    const h = String(d.getHours()).padStart(2, '0')
    out.push({
      id: `as-${y}${mo}${da}-${h}`,
      startsAtIso: d.toISOString(),
      label: 'Formula Skills Check · ~60 min',
    })
    added++
  }
  return out
}
