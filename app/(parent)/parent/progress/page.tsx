import React from 'react'
import Link from 'next/link'
import { Zap, Clock } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { SectionHeader } from '@/components/ui/section-header'
import { Badge } from '@/components/ui/badge'
import { mockPlayers } from '@/lib/mock-data/players'
import { getInitials, getAvatarColor, cn } from '@/lib/utils'
import { ParentSoftBanner, ParentPanel } from '@/components/parent/parent-panel'
import { fpiReportDemo } from '@/lib/mock-data/parent-portal'

const PARENT_PLAYER_IDS = ['player-6', 'player-7']
const myPlayers = mockPlayers.filter(p => PARENT_PLAYER_IDS.includes(p.id))

const MOCK_COACH_NOTES = [
  { playerId: 'player-6', coachName: 'Marcus Rivera', date: '2026-03-20', content: 'Excellent improvement in first touch this week. Ball control in tight spaces has noticeably improved from January assessments.' },
  { playerId: 'player-7', coachName: 'Marcus Rivera', date: '2026-03-20', content: 'Speed off the mark is her biggest strength. Working on positioning awareness in the final third; encouraging progress this month.' },
  { playerId: 'player-6', coachName: 'Marcus Rivera', date: '2026-03-14', content: 'Good attitude and coachability. Weak-foot needs attention; assigned left-foot finishing drills for home practice.' },
]

function ProgressBar({ value, label }: { value: number; label: string }) {
  const color = value >= 85 ? '#f4fe00' : value >= 70 ? '#005700' : '#6b7280'
  return (
  <div className="space-y-1">
  <div className="flex items-center justify-between text-xs">
  <span className="text-text-muted">{label}</span>
  <span className="text-text-secondary font-medium">{value}</span>
  </div>
  <div className="h-1.5 bg-surface-raised rounded-full overflow-hidden">
  <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
  </div>
  </div>
  )
}

export default function ParentProgressPage() {
  return (
  <PageContainer>
  <div className="space-y-7">
  <PageHeader
  title="Athlete progress"
  subtitle="Development clarity for your family - not public rankings or leaderboards."
  />

  <ParentSoftBanner>
  Formula shares progress constructively. Percentiles describe your athlete relative to our Formula age-band
  cohort - not a league table. For the full report experience, open{' '}
  <Link href="/parent/fpi-report" className="font-medium text-[#22c55e] underline decoration-[#22c55e]/40">
  FPI reports
  </Link>
  .
  </ParentSoftBanner>

  {myPlayers.map(player => {
  const playerNotes = MOCK_COACH_NOTES.filter(n => n.playerId === player.id)
  return (
  <Link
  key={player.id}
  href={`/parent/progress/${player.id}`}
  className="block space-y-4 border border-transparent p-3 text-inherit no-underline transition-colors hover:border-white/10 hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22c55e]"
  >
  <div className="flex items-center gap-3">
  <div className={cn('h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold', getAvatarColor(player.id))}>
  {getInitials(player.firstName, player.lastName)}
  </div>
  <div>
  <p className="font-bold text-text-primary">{player.firstName} {player.lastName}</p>
  <p className="text-xs text-text-muted">{player.ageGroup} · {player.totalSessionsAttended} sessions attended</p>
  </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  {/* Performance scores */}
  {player.performance ? (
  <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
  <div className="flex items-center justify-between">
  <p className="text-sm font-semibold text-text-primary">Performance Scores</p>
  <p className="text-xs text-text-muted">
  Last assessed: {new Date(player.performance.lastAssessed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
  </p>
  </div>
  <div className="space-y-3">
  <ProgressBar value={player.performance.technicalScore} label="Technical" />
  <ProgressBar value={player.performance.speed} label="Speed" />
  <ProgressBar value={player.performance.agility} label="Agility" />
  <ProgressBar value={player.performance.endurance} label="Endurance" />
  <ProgressBar value={player.performance.strength} label="Strength" />
  </div>
  <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 text-center">
  <p className="text-3xl font-black text-accent-foreground">{player.performance.technicalScore}</p>
  <p className="text-xs text-text-muted">Overall technical score (assessments)</p>
  </div>
  </div>
  ) : (
  <div className="rounded-xl border border-border bg-surface p-5 flex items-center justify-center">
  <div className="text-center space-y-2">
  <Zap className="h-6 w-6 text-text-muted mx-auto" />
  <p className="text-sm text-text-muted">No performance data yet</p>
  <p className="text-xs text-text-muted">Scores will appear after the first assessment</p>
  </div>
  </div>
  )}

  {/* Coach notes */}
  <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
  <p className="text-sm font-semibold text-text-primary">Coach Notes</p>
  {playerNotes.length === 0 ? (
  <p className="text-sm text-text-muted">No notes yet</p>
  ) : (
  <div className="space-y-3">
  {playerNotes.map((note, i) => (
  <div key={i} className="rounded-lg border border-border bg-surface-raised p-3 space-y-1.5">
  <div className="flex items-center justify-between text-xs text-text-muted">
  <span className="font-medium text-text-secondary">{note.coachName}</span>
  <span className="flex items-center gap-1">
  <Clock className="h-3 w-3" />
  {new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
  </span>
  </div>
  <p className="text-sm text-text-primary leading-relaxed">{note.content}</p>
  </div>
  ))}
  </div>
  )}
  </div>
  </div>
  </Link>
  )
  })}

  <ParentPanel title="Recommended 12-week focus" eyebrow="STRUCTURED PATH">
  <p className="text-sm leading-relaxed text-zinc-400">{fpiReportDemo.focus12Week}</p>
  </ParentPanel>
  </div>
  </PageContainer>
  )
}
