'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/ui/section-header'
import { PARENT_PROGRESS_PLAYER_SELECT } from '@/lib/supabase/parent-progress-query'
import { supabase } from '@/lib/supabase'
import { cn, getAvatarColor, getInitials } from '@/lib/utils'
import type { PlayerRow } from '@/types/players'
import {
  ParentAssessmentNotesBlock,
  ParentPerformanceScoresBlock,
} from '@/components/parent/parent-progress-shared'
import { type AssessmentForProgress, latestCompletedAssessment, parsePillarScores } from '@/lib/parent/assessment-pillars'

function embedOne<T>(row: T | T[] | null | undefined): T | null {
  if (row == null) return null
  return Array.isArray(row) ? (row[0] ?? null) : row
}

export function ParentPlayerProgressPageClient({ playerId }: { playerId: string }) {
  const [phase, setPhase] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [player, setPlayer] = useState<PlayerRow | null>(null)

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

      const { data, error: qErr } = await supabase
        .from('parent_players')
        .select(`players ( ${PARENT_PROGRESS_PLAYER_SELECT} )`)
        .eq('parent_user_id', user.id)
        .eq('player_id', playerId)
        .maybeSingle()

      if (cancelled) return

      if (qErr) {
        setPhase('error')
        setError(qErr.message)
        return
      }

      const p = embedOne(data?.players as PlayerRow | PlayerRow[] | null)
      if (!p?.id) {
        setPhase('missing')
        return
      }

      setPlayer(p)
      setPhase('ready')
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [playerId])

  if (phase === 'loading') {
    return (
      <PageContainer>
        <div className="py-16 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
          Loading athlete…
        </div>
      </PageContainer>
    )
  }

  if (phase === 'error') {
    return (
      <PageContainer>
        <p className="text-sm text-amber-200/90">{error}</p>
      </PageContainer>
    )
  }

  if (phase === 'missing' || !player) {
    return (
      <PageContainer>
        <div className="space-y-4">
          <Link
            href="/parent/progress"
            className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to progress
          </Link>
          <p className="text-sm text-text-muted">This athlete is not linked to your account.</p>
        </div>
      </PageContainer>
    )
  }

  const rawAssessments = Array.isArray(player.assessments) ? player.assessments : []
  const assessments: AssessmentForProgress[] = rawAssessments.map((a, i) => ({
    id: typeof a.id === 'string' && a.id ? a.id : `${player.id}-assessment-${i}`,
    summary: a.summary ?? null,
    completed_at: a.completed_at ?? null,
    pillar_scores: (a as { pillar_scores?: unknown }).pillar_scores,
  }))

  const latest = latestCompletedAssessment(assessments)
  const pillars = latest ? parsePillarScores(latest.pillar_scores) : null
  const completedCount = assessments.filter((a) => a.completed_at).length

  const firstName = (player.first_name ?? '').trim()
  const lastName = (player.last_name ?? '').trim()

  return (
    <div className="space-y-6">
      <div className="mx-auto w-full max-w-[1400px]">
        <Link
          href={`/parent/fpi-report/${playerId}`}
          className={cn(
            'inline-flex rounded-sm border border-formula-volt/30 bg-formula-paper/[0.04] px-5 py-4 text-sm font-medium text-formula-volt shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)] transition-colors',
            'hover:border-formula-volt/50 hover:bg-formula-paper/[0.08]'
          )}
        >
          View full FPI report - supportive, scientific summary
        </Link>
      </div>

      <PageContainer>
        <div className="space-y-6">
          <Link
            href="/parent/progress"
            className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to progress
          </Link>

          <div className="flex flex-col gap-3 border border-border bg-surface p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                  getAvatarColor(player.id)
                )}
              >
                {getInitials(firstName, lastName)}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold uppercase tracking-tight text-text-primary">
                  {firstName} {lastName}
                </h1>
                <p className="mt-1 text-sm text-text-muted">
                  {player.age_group ?? 'Athlete'} · {completedCount} completed assessment
                  {completedCount !== 1 ? 's' : ''}
                </p>
                <div className="mt-2">
                  <Badge variant="outline" size="sm">
                    Linked athlete
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ParentPerformanceScoresBlock lastAssessedIso={latest?.completed_at ?? null} pillars={pillars} />
            <ParentAssessmentNotesBlock assessments={assessments} />
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <SectionHeader
              title="All completed assessments"
              description="Dates and summaries from staff records"
            />
            <ul className="mt-4 space-y-2">
              {assessments
                .filter((a) => a.completed_at)
                .sort((a, b) => {
                  const ta = new Date(a.completed_at!).getTime()
                  const tb = new Date(b.completed_at!).getTime()
                  return tb - ta
                })
                .map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-col gap-1 border-b border-border/60 py-2 text-sm last:border-0 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <span className="text-text-primary">{a.summary?.trim() || '—'}</span>
                    <span className="shrink-0 font-mono text-xs text-text-muted">
                      {new Date(a.completed_at!).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </li>
                ))}
            </ul>
            {completedCount === 0 ? (
              <p className="mt-4 text-sm text-text-muted">No assessments on file yet.</p>
            ) : null}
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
