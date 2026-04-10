'use client'

import Link from 'next/link'
import { Clock, Zap } from 'lucide-react'
import { cn, getAvatarColor, getInitials } from '@/lib/utils'
import {
  type AssessmentForProgress,
  latestCompletedAssessment,
  overallTechnicalDisplay,
  parsePillarScores,
  sortAssessmentsByCompletedAtDesc,
} from '@/lib/parent/assessment-pillars'

export function ParentProgressBar({ value, label }: { value: number; label: string }) {
  const color = value >= 85 ? '#f4fe00' : value >= 70 ? '#005700' : '#6b7280'
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">{label}</span>
        <span className="font-medium text-text-secondary">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-raised">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

const NOTE_LABEL = 'Formula staff'

export function ParentPerformanceScoresBlock({
  lastAssessedIso,
  pillars,
}: {
  lastAssessedIso: string | null
  pillars: ReturnType<typeof parsePillarScores>
}) {
  if (!pillars || !lastAssessedIso) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-border bg-surface p-5">
        <div className="space-y-2 text-center">
          <Zap className="mx-auto h-6 w-6 text-text-muted" />
          <p className="text-sm text-text-muted">No pillar scores on file yet</p>
          <p className="text-xs text-text-muted">
            Staff can add technical, speed, agility, endurance, and strength when they log an assessment.
          </p>
        </div>
      </div>
    )
  }

  const t = pillars.technical ?? overallTechnicalDisplay(pillars) ?? undefined
  const speed = pillars.speed
  const agility = pillars.agility
  const endurance = pillars.endurance
  const strength = pillars.strength

  const rows: { label: string; value: number | undefined }[] = [
    { label: 'Technical', value: t },
    { label: 'Speed', value: speed },
    { label: 'Agility', value: agility },
    { label: 'Endurance', value: endurance },
    { label: 'Strength', value: strength },
  ]

  const hasAnyBar = rows.some((r) => typeof r.value === 'number')
  const overall = overallTechnicalDisplay(pillars)

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text-primary">Performance scores</p>
        <p className="text-xs text-text-muted">
          Last assessed:{' '}
          {new Date(lastAssessedIso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      </div>
      {hasAnyBar ? (
        <div className="space-y-3">
          {rows.map((row) =>
            typeof row.value === 'number' ? (
              <ParentProgressBar key={row.label} value={row.value} label={row.label} />
            ) : null
          )}
        </div>
      ) : (
        <p className="text-sm text-text-muted">Scores will appear here once staff saves pillar values.</p>
      )}
      {overall != null ? (
        <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 text-center">
          <p className="text-3xl font-black text-accent-foreground">{overall}</p>
          <p className="text-xs text-text-muted">Overall technical score (assessments)</p>
        </div>
      ) : null}
    </div>
  )
}

export function ParentAssessmentNotesBlock({ assessments }: { assessments: AssessmentForProgress[] }) {
  const timeline = sortAssessmentsByCompletedAtDesc(
    assessments.filter((a) => a.completed_at && (a.summary?.trim() ?? '').length > 0)
  )

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <p className="text-sm font-semibold text-text-primary">Assessment notes</p>
      {timeline.length === 0 ? (
        <p className="text-sm text-text-muted">No written notes yet</p>
      ) : (
        <div className="space-y-3">
          {timeline.map((a) => (
            <div key={a.id} className="space-y-1.5 rounded-lg border border-border bg-surface-raised p-3">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span className="font-medium text-text-secondary">{NOTE_LABEL}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(a.completed_at!).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-text-primary">{a.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ParentAthleteProgressCard({
  playerId,
  firstName,
  lastName,
  ageGroup,
  assessmentCount,
  assessments,
  className,
}: {
  playerId: string
  firstName: string
  lastName: string
  ageGroup: string | null
  assessmentCount: number
  assessments: AssessmentForProgress[]
  className?: string
}) {
  const latest = latestCompletedAssessment(assessments)
  const pillars = latest ? parsePillarScores(latest.pillar_scores) : null

  return (
    <Link
      href={`/parent/progress/${playerId}`}
      className={cn(
        'block space-y-4 rounded-xl border border-transparent p-3 text-inherit no-underline transition-colors',
        'hover:border-formula-frost/15 hover:bg-formula-paper/[0.04]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-formula-volt',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold',
            getAvatarColor(playerId)
          )}
        >
          {getInitials(firstName, lastName)}
        </div>
        <div>
          <p className="font-bold text-text-primary">
            {firstName} {lastName}
          </p>
          <p className="text-xs text-text-muted">
            {ageGroup ?? 'Athlete'} · {assessmentCount} completed assessment{assessmentCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ParentPerformanceScoresBlock lastAssessedIso={latest?.completed_at ?? null} pillars={pillars} />
        <ParentAssessmentNotesBlock assessments={assessments} />
      </div>
    </Link>
  )
}
