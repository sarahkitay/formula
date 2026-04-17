import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/ui/section-header'
import type { Player } from '@/types'
import type { AssessmentHistoryRow } from '@/lib/performance/assessment-display'
import {
  getAveragePercentile,
  getDemoGender,
  getFacilityCohortStats,
  getPlayerAssessmentHistory,
  getScoreHistorySeries,
} from '@/lib/performance/assessment-display'
import { cn, getAvatarColor, getInitials } from '@/lib/utils'

function Bar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="relative h-1.5 overflow-hidden rounded-full bg-surface-raised">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all"
        style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
      />
    </div>
  )
}

const METRICS = ['speed', 'agility', 'endurance', 'strength', 'technicalScore'] as const

function lastAssessedLabel(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

export function PlayerPerformanceDashboard({
  player,
  backHref,
  backLabel,
  assessmentHistory,
}: {
  player: Player
  backHref: string
  backLabel: string
  /** When omitted, uses empty in-memory history until a caller passes Supabase rows. */
  assessmentHistory?: AssessmentHistoryRow[]
}) {
  const perf = player.performance
  const cohort = getFacilityCohortStats(player.ageGroup)
  const avgPct = perf ? getAveragePercentile(player) : 0
  const assessments = assessmentHistory ?? getPlayerAssessmentHistory(player.id)
  const scoreSeries = getScoreHistorySeries(player.id)
  const gender = getDemoGender(player.id)

  return (
    <PageContainer>
      <div className="space-y-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        <div className="flex flex-col gap-3 border border-border bg-surface p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-2">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                getAvatarColor(player.id)
              )}
            >
              {getInitials(player.firstName, player.lastName)}
            </div>
              <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h1 className="shrink-0 text-xl font-bold uppercase tracking-tight text-text-primary">
                  {player.firstName} {player.lastName}
                </h1>
                {perf && (
                  <p className="min-w-0 text-sm font-medium leading-snug text-text-secondary">
                    <span className="text-text-muted">Avg pct </span>
                    <span className="font-semibold tabular-nums text-text-primary">{avgPct}%</span>
                    <span className="mx-1.5 text-text-muted">·</span>
                    <span className="text-text-muted">Overall </span>
                    <span className="font-semibold tabular-nums text-accent-foreground">{avgPct}%</span>
                    <span className="mx-1.5 text-text-muted">·</span>
                    <span className="text-text-muted">Latest tech </span>
                    <span className="font-semibold tabular-nums text-text-primary">{perf.technicalScore}%</span>
                    <span className="mx-1.5 text-text-muted">·</span>
                    <span className="text-text-muted">Assessed </span>
                    <span className="font-semibold tabular-nums text-text-primary">{lastAssessedLabel(perf.lastAssessed)}</span>
                  </p>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant="outline" size="sm">
                  {player.ageGroup}
                </Badge>
                <span className="text-xs text-text-muted">{player.position}</span>
                {player.jerseyNumber != null && (
                  <span className="text-xs text-text-muted">#{player.jerseyNumber}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {!perf ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p className="text-sm font-medium text-text-primary">No assessments on file</p>
            <p className="mt-2 text-xs text-text-muted">
              When this athlete completes a performance block, scores and history will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className="text-[11px] text-text-muted">
                Avg pct and overall are the mean of five percentile-style metrics when present on the athlete profile.
                Latest tech reflects the stored technical score. Assessed timestamp is local time.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5">
              <SectionHeader
                title="Facility cohort (same age group)"
                description="Compared to roster athletes in this band at Formula Soccer Center"
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-border bg-surface-raised p-3">
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">Age band</p>
                  <p className="mt-1 text-sm font-semibold text-text-primary">{player.ageGroup}</p>
                </div>
                <div className="rounded-lg border border-border bg-surface-raised p-3">
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">Gender (record)</p>
                  <p className="mt-1 text-sm font-semibold text-text-primary">{gender}</p>
                </div>
                <div className="rounded-lg border border-border bg-surface-raised p-3">
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">Sessions attended</p>
                  <p className="mt-1 text-sm font-semibold text-text-primary">
                    {player.totalSessionsAttended}{' '}
                    <span className="font-normal text-text-muted">
                      (facility avg {cohort.avgSessionsAttended})
                    </span>
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-surface-raised p-3">
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">Cohort technical avg</p>
                  <p className="mt-1 text-sm font-semibold text-text-primary">
                    {cohort.assessedCount ? `${cohort.avgTechnical}%` : 'N/A'}{' '}
                    <span className="font-normal text-text-muted">
                      ({cohort.assessedCount} assessed)
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface p-5">
                <SectionHeader title="Score history" description="Rolling technical trend when time series is connected" />
                <ul className="mt-4 space-y-2">
                  {scoreSeries.map(row => (
                    <li
                      key={row.weekOf}
                      className="flex items-center justify-between gap-2 border-b border-border/60 py-2 text-sm last:border-0"
                    >
                      <span className="font-mono text-xs text-text-muted">{row.weekOf}</span>
                      <span className="font-semibold tabular-nums text-text-primary">{row.technical}%</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-surface p-5">
                <SectionHeader title="Assessment history" description="Logged evaluations" />
                <ul className="mt-4 space-y-3">
                  {assessments.map(a => (
                    <li key={a.id} className="rounded-lg border border-border bg-surface-raised p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-text-primary">{a.label}</p>
                        <span className="font-mono text-xs text-text-muted">{a.date}</span>
                      </div>
                      <p className="mt-1 text-xs text-text-muted">{a.summary}</p>
                      <p className="mt-2 text-lg font-bold tabular-nums text-accent-foreground">{a.composite}%</p>
                      <p className="text-[10px] uppercase tracking-wider text-text-muted">Composite</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5">
              <SectionHeader title="Metric breakdown" description="Current percentile-style scores" />
              <div className="mt-4 space-y-3">
                {METRICS.map(metric => (
                  <div key={metric} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted capitalize">
                        {metric === 'technicalScore' ? 'Technical' : metric}
                      </span>
                      <span className="font-medium tabular-nums text-text-secondary">{perf[metric]}%</span>
                    </div>
                    <Bar
                      value={perf[metric]}
                      color={perf[metric] >= 85 ? '#f4fe00' : perf[metric] >= 70 ? '#005700' : '#6b7280'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  )
}
