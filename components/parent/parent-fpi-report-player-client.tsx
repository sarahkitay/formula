'use client'

import { useEffect, useMemo, useState } from 'react'
import { notFound } from 'next/navigation'
import { FpiReportPremium } from '@/components/parent/fpi-report-premium'
import { useParentLinkedPlayers } from '@/components/parent/parent-linked-players-context'
import { supabase } from '@/lib/supabase'
import { fpiReportFromPillarScores } from '@/lib/parent/fpi-from-assessment'
import type { ParentFpiReportContent } from '@/lib/parent/fpi-report-shell'

export function ParentFpiReportPlayerClient({ playerId }: { playerId: string }) {
  const { players, loading } = useParentLinkedPlayers()
  const player = useMemo(() => players.find((p) => p.id === playerId), [players, playerId])
  const [report, setReport] = useState<ParentFpiReportContent | null>(null)

  useEffect(() => {
    if (!playerId) return
    let cancelled = false
    void (async () => {
      const { data, error } = await supabase
        .from('assessments')
        .select('summary, completed_at, pillar_scores')
        .eq('player_id', playerId)
        .order('completed_at', { ascending: false, nullsFirst: false })
        .limit(1)
        .maybeSingle()

      if (cancelled || error || !data) {
        if (!cancelled) setReport(null)
        return
      }
      const row = data as {
        summary: string | null
        completed_at: string | null
        pillar_scores: unknown
      }
      setReport(fpiReportFromPillarScores(row.pillar_scores, row.summary, row.completed_at))
    })()
    return () => {
      cancelled = true
    }
  }, [playerId])

  if (!loading && !player) {
    notFound()
  }

  if (loading || !player) {
    return (
      <div className="portal-brand-surface parent-os flex min-h-[40vh] items-center justify-center text-formula-mist">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em]">Loading report…</p>
      </div>
    )
  }

  return (
    <FpiReportPremium
      player={{
        firstName: player.firstName,
        lastName: player.lastName,
        ageGroup: player.ageGroup,
      }}
      backHref="/parent/fpi-report"
      report={report ?? undefined}
    />
  )
}
