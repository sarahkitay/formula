import { getServiceSupabase } from '@/lib/supabase/service'
import type { AssessmentHistoryRow } from '@/lib/performance/assessment-display'

const PILLAR_KEYS = ['technical', 'speed', 'agility', 'endurance', 'strength'] as const

function compositeFromPillars(raw: unknown): number {
  if (!raw || typeof raw !== 'object') return 0
  const o = raw as Record<string, unknown>
  const vals = PILLAR_KEYS.map(k => {
    const n = Number(o[k])
    return Number.isFinite(n) ? n : 0
  })
  const sum = vals.reduce((a, b) => a + b, 0)
  const n = vals.filter(v => v > 0).length
  return n > 0 ? Math.round(sum / n) : 0
}

/** Staff-side read of assessment history (service role). */
export async function listAssessmentsForPlayerAdmin(playerId: string, limit = 24): Promise<AssessmentHistoryRow[]> {
  const sb = getServiceSupabase()
  if (!sb) return []

  const { data, error } = await sb
    .from('assessments')
    .select('id, summary, completed_at, created_at, pillar_scores')
    .eq('player_id', playerId)
    .order('completed_at', { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error || !data?.length) return []

  return data.map(row => {
    const completed = row.completed_at as string | null
    const created = row.created_at as string
    const date = completed ?? created
    const summary = (row.summary as string | null)?.trim() ?? ''
    const composite = compositeFromPillars(row.pillar_scores)
    return {
      id: row.id as string,
      date,
      label: summary ? (summary.length > 48 ? `${summary.slice(0, 48)}…` : summary) : 'Assessment',
      composite,
      summary: summary || 'No summary on file.',
    }
  })
}
