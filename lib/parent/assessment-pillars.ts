export type PillarKey = 'technical' | 'speed' | 'agility' | 'endurance' | 'strength'

export type PillarScores = Record<PillarKey, number>

const PILLAR_KEYS: PillarKey[] = ['technical', 'speed', 'agility', 'endurance', 'strength']

function clampScore(n: number): number {
  return Math.min(100, Math.max(0, Math.round(n)))
}

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return clampScore(value)
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    if (Number.isFinite(n)) return clampScore(n)
  }
  return null
}

/** Parse `assessments.pillar_scores` JSON into normalized pillar values when present. */
export function parsePillarScores(raw: unknown): Partial<PillarScores> | null {
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) return null
  const o = raw as Record<string, unknown>
  const out: Partial<PillarScores> = {}

  for (const key of PILLAR_KEYS) {
    const v = readNumber(o[key])
    if (v != null) out[key] = v
  }

  const technicalAlt = readNumber(o.technicalScore)
  if (technicalAlt != null && out.technical == null) out.technical = technicalAlt

  return Object.keys(out).length > 0 ? out : null
}

/** Overall technical display: explicit technical, else average of available pillars. */
export function overallTechnicalDisplay(p: Partial<PillarScores>): number | null {
  if (typeof p.technical === 'number') return p.technical
  const nums = PILLAR_KEYS.map((k) => p[k]).filter((n): n is number => typeof n === 'number')
  if (nums.length === 0) return null
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
}

export type AssessmentForProgress = {
  id: string
  summary: string | null
  completed_at: string | null
  pillar_scores?: unknown
}

export function sortAssessmentsByCompletedAtDesc(rows: AssessmentForProgress[]): AssessmentForProgress[] {
  return [...rows].sort((a, b) => {
    const ta = a.completed_at ? new Date(a.completed_at).getTime() : 0
    const tb = b.completed_at ? new Date(b.completed_at).getTime() : 0
    return tb - ta
  })
}

export function latestCompletedAssessment(rows: AssessmentForProgress[]): AssessmentForProgress | null {
  const completed = sortAssessmentsByCompletedAtDesc(rows.filter((r) => r.completed_at))
  return completed[0] ?? null
}
