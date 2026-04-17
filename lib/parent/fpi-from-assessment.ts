import type { ParentFpiReportContent } from '@/lib/parent/fpi-report-shell'
import { parentFpiReportEmpty } from '@/lib/parent/fpi-report-shell'

const DOMAIN_LABELS: { key: string; name: string }[] = [
  { key: 'technical', name: 'Technical' },
  { key: 'speed', name: 'Speed' },
  { key: 'agility', name: 'Agility' },
  { key: 'endurance', name: 'Endurance' },
  { key: 'strength', name: 'Strength' },
]

/** Map latest `assessments.pillar_scores` into parent FPI report shape (read-only). */
export function fpiReportFromPillarScores(
  pillarScores: unknown,
  summary: string | null,
  _completedAt: string | null
): ParentFpiReportContent {
  const base: ParentFpiReportContent = { ...parentFpiReportEmpty }
  if (!pillarScores || typeof pillarScores !== 'object') {
    return {
      ...base,
      compositeNarrative: summary?.trim() || base.compositeNarrative,
    }
  }

  const o = pillarScores as Record<string, unknown>
  const domains = DOMAIN_LABELS.map(({ key, name }) => {
    const n = Number(o[key])
    const value = Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 0
    return { name, value, note: value > 0 ? 'From latest assessment' : '—' }
  })

  const values = domains.map(d => d.value).filter(v => v > 0)
  const compositeValue = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0

  return {
    ...base,
    compositeValue,
    compositeNarrative: summary?.trim() || base.compositeNarrative,
    domains,
    percentileBand: 'Internal staff context only',
    trendLabel: 'Based on latest logged assessment',
  }
}
