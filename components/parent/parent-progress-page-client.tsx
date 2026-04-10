'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { ParentSoftBanner, ParentPanel } from '@/components/parent/parent-panel'
import { parentPortalTextLink } from '@/lib/parent/portal-surface'
import { fetchParentProgressParentPlayers } from '@/lib/parent/fetch-parent-progress'
import { supabase } from '@/lib/supabase'
import type { PlayerRow } from '@/types/players'
import { ParentAthleteProgressCard } from '@/components/parent/parent-progress-shared'
import { type AssessmentForProgress, latestCompletedAssessment } from '@/lib/parent/assessment-pillars'

type ParentPlayerRow = {
  player_id: string | null
  players: PlayerRow | PlayerRow[] | null
}

function embedOne<T>(row: T | T[] | null | undefined): T | null {
  if (row == null) return null
  return Array.isArray(row) ? (row[0] ?? null) : row
}

export function ParentProgressPageClient() {
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<ParentPlayerRow[]>([])

  useEffect(() => {
    let cancelled = false

    async function run() {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser()

      if (cancelled) return

      if (userErr || !user) {
        setPhase('error')
        setError(userErr?.message ?? 'Not signed in.')
        return
      }

      const { data, error: qErr } = await fetchParentProgressParentPlayers(supabase, user.id)

      if (cancelled) return

      if (qErr) {
        setPhase('error')
        setError(qErr.message)
        return
      }

      setRows((data as ParentPlayerRow[]) ?? [])
      setPhase('ready')
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [])

  const athletes = useMemo(() => {
    const list: {
      id: string
      firstName: string
      lastName: string
      ageGroup: string | null
      assessments: AssessmentForProgress[]
    }[] = []

    for (const row of rows) {
      const p = embedOne(row.players)
      if (!p?.id) continue
      const rawAssessments = Array.isArray(p.assessments) ? p.assessments : []
      const assessments: AssessmentForProgress[] = rawAssessments.map((a, i) => ({
        id: typeof a.id === 'string' && a.id ? a.id : `${p.id}-assessment-${i}`,
        summary: a.summary ?? null,
        completed_at: a.completed_at ?? null,
        pillar_scores: (a as { pillar_scores?: unknown }).pillar_scores,
      }))
      list.push({
        id: p.id,
        firstName: (p.first_name ?? '').trim(),
        lastName: (p.last_name ?? '').trim(),
        ageGroup: p.age_group ?? null,
        assessments,
      })
    }

    return list.sort((a, b) => {
      const an = `${a.firstName} ${a.lastName}`.trim() || a.id
      const bn = `${b.firstName} ${b.lastName}`.trim() || b.id
      return an.localeCompare(bn)
    })
  }, [rows])

  const recentFocusText = useMemo(() => {
    let best: AssessmentForProgress | null = null
    let bestTime = 0
    for (const a of athletes) {
      const latest = latestCompletedAssessment(a.assessments)
      if (!latest?.completed_at || !(latest.summary?.trim())) continue
      const t = new Date(latest.completed_at).getTime()
      if (t >= bestTime) {
        bestTime = t
        best = latest
      }
    }
    return best?.summary?.trim() ?? null
  }, [athletes])

  if (phase === 'loading') {
    return (
      <PageContainer>
        <div className="py-16 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
          Loading progress…
        </div>
      </PageContainer>
    )
  }

  if (phase === 'error') {
    return (
      <PageContainer>
        <PageHeader title="Athlete progress" subtitle="Development clarity for your family." />
        <p className="text-sm text-amber-200/90">{error}</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-7">
        <PageHeader
          title="Athlete progress"
          subtitle="Development clarity for your family - not public rankings or leaderboards."
        />

        <ParentSoftBanner>
          Formula shares progress constructively. If you don&apos;t see data yet, check back after your athlete&apos;s
          assessment — or follow up with the front desk. For the full report experience, open{' '}
          <Link href="/parent/fpi-report" className={parentPortalTextLink}>
            FPI reports
          </Link>
          .
        </ParentSoftBanner>

        {athletes.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="text-sm font-medium text-text-primary">No linked athletes yet</p>
            <p className="mt-2 text-sm text-text-muted">
              After registration and linking, progress will show here. No data collected until an assessment is on file —
              follow up post-assessment if you expected to see results.
            </p>
          </div>
        ) : (
          athletes.map((athlete) => {
            const completed = athlete.assessments.filter((x) => x.completed_at)
            const count = completed.length
            return (
              <ParentAthleteProgressCard
                key={athlete.id}
                playerId={athlete.id}
                firstName={athlete.firstName}
                lastName={athlete.lastName}
                ageGroup={athlete.ageGroup}
                assessmentCount={count}
                assessments={athlete.assessments}
              />
            )
          })
        )}

        <ParentPanel title="Recent focus" eyebrow="FROM ASSESSMENTS">
          <p className="text-sm leading-relaxed text-formula-frost/82">
            {recentFocusText ??
              'No notes on file yet. After staff complete an assessment, a summary can appear here — check back post-assessment or ask at the desk.'}
          </p>
        </ParentPanel>
      </div>
    </PageContainer>
  )
}
