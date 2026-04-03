import { mockPlayers } from '@/lib/mock-data/players'
import type { Player } from '@/types'

export type AssessmentHistoryRow = {
  id: string
  date: string
  label: string
  composite: number
  summary: string
}

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** Demo roster gender for facility cohort copy (not stored on all Player rows). */
const DEMO_GENDER: Record<string, 'Male' | 'Female'> = {
  'player-1': 'Male',
  'player-2': 'Female',
  'player-3': 'Male',
  'player-4': 'Male',
  'player-6': 'Male',
  'player-7': 'Female',
  'player-10': 'Male',
  'player-11': 'Male',
  'player-12': 'Female',
  'player-13': 'Male',
  'player-14': 'Female',
  'player-15': 'Female',
}

export function getDemoGender(playerId: string): 'Male' | 'Female' | 'Not recorded' {
  return DEMO_GENDER[playerId] ?? 'Not recorded'
}

export function getFacilityCohortStats(ageGroup: Player['ageGroup']) {
  const cohort = mockPlayers.filter(p => p.ageGroup === ageGroup && p.performance)
  const withSessions = mockPlayers.filter(p => p.ageGroup === ageGroup)
  if (cohort.length === 0) {
    return {
      assessedCount: 0,
      avgTechnical: 0,
      avgSessionsAttended: 0,
      cohortRosterSize: withSessions.length,
    }
  }
  const avgTechnical = Math.round(
    cohort.reduce((s, p) => s + (p.performance?.technicalScore ?? 0), 0) / cohort.length
  )
  const avgSessionsAttended =
    withSessions.length > 0
      ? Math.round(
          withSessions.reduce((s, p) => s + p.totalSessionsAttended, 0) / withSessions.length
        )
      : 0
  return {
    assessedCount: cohort.length,
    avgTechnical,
    avgSessionsAttended,
    cohortRosterSize: withSessions.length,
  }
}

export function getAveragePercentile(player: Player) {
  if (!player.performance) return 0
  const p = player.performance
  return Math.round((p.speed + p.agility + p.endurance + p.strength + p.technicalScore) / 5)
}

export function getPlayerAssessmentHistory(playerId: string): AssessmentHistoryRow[] {
  const base = mockPlayers.find(p => p.id === playerId)
  if (!base?.performance) return []
  const perf = base.performance
  const h = hash(playerId)
  const offsets = [0, -21, -45, -74]
  return offsets.map((dayOffset, i) => {
    const d = new Date(perf.lastAssessed)
    d.setDate(d.getDate() + dayOffset)
    const composite = Math.min(
      100,
      Math.max(45, perf.technicalScore + ((h + i * 13) % 9) - 4)
    )
    const labels = ['Quarterly assessment', 'Lab + coach review', 'Mid-block check', 'Baseline intake']
    return {
      id: `${playerId}-a${i}`,
      date: d.toISOString().slice(0, 10),
      label: labels[i] ?? 'Assessment',
      composite,
      summary:
        i === 0
          ? `Technical ${perf.technicalScore}, speed ${perf.speed}, agility ${perf.agility}`
          : `Composite trend vs prior: ${composite >= perf.technicalScore - 2 ? 'stable or up' : 'focus areas flagged'}`,
    }
  }).sort((a, b) => b.date.localeCompare(a.date))
}

export function getScoreHistorySeries(playerId: string) {
  const base = mockPlayers.find(p => p.id === playerId)
  if (!base?.performance) return []
  const perf = base.performance
  const h = hash(playerId)
  const weeks = [12, 9, 6, 3, 0]
  return weeks.map((w, i) => {
    const d = new Date(perf.lastAssessed)
    d.setDate(d.getDate() - w * 7)
    const tech = Math.min(
      100,
      Math.max(50, perf.technicalScore + ((h + i * 5) % 7) - 3)
    )
    return { weekOf: d.toISOString().slice(0, 10), technical: tech }
  })
}
