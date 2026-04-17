import type { Player } from '@/types'

export type AssessmentHistoryRow = {
  id: string
  date: string
  label: string
  composite: number
  summary: string
}

export function getDemoGender(_playerId: string): 'Male' | 'Female' | 'Not recorded' {
  return 'Not recorded'
}

export function getFacilityCohortStats(ageGroup: Player['ageGroup']) {
  return {
    assessedCount: 0,
    avgTechnical: 0,
    avgSessionsAttended: 0,
    cohortRosterSize: 0,
  }
}

export function getAveragePercentile(player: Player) {
  if (!player.performance) return 0
  const p = player.performance
  return Math.round((p.speed + p.agility + p.endurance + p.strength + p.technicalScore) / 5)
}

export function getPlayerAssessmentHistory(_playerId: string): AssessmentHistoryRow[] {
  return []
}

export function getScoreHistorySeries(_playerId: string) {
  return [] as { weekOf: string; technical: number }[]
}
