/**
 * Coach execution layer - session delivery, youth block model, FPI inputs (demo).
 */

import type { FloorSectionId } from '@/lib/coach/floor-layout'

export const COACH_DEMO_ID = 'coach-1'
export const COACH_DEMO_NAME = 'Marcus Rivera'

export type CoachAlertType =
  | 'low-attendance'
  | 'missing-athlete'
  | 'delayed-start'
  | 'facility'
  | 'equipment'

export interface CoachAlert {
  id: string
  type: CoachAlertType
  message: string
}

export interface CoachSessionToday {
  sessionId: string
  title: string
  startTime: string
  endTime: string
  ageLabel: string
  programType: string
  fieldName: string
  fieldId: string
  floorSection: FloorSectionId
  status: 'scheduled' | 'in-progress' | 'completed'
  capacity: number
  enrolled: number
  checkedIn: number
}

export interface StationPlan {
  station1: { label: string; focus: string }
  station2: { label: string; focus: string }
  transitionMin: number
}

export interface YouthBlockModel {
  blockMinutes: number
  station1Min: number
  transitionMin: number
  station2Min: number
  athletesPerBlock: number
  groupSizeMin: number
  groupSizeMax: number
  stationsActive: 2
}

export interface GroupAssignment {
  id: string
  label: string
  athleteIds: string[]
  station1: string
  station2: string
}

export interface SessionDetailExtended {
  sessionId: string
  notes: string
  stationPlan: StationPlan
  groups: GroupAssignment[]
  substitutions: string[]
}

export interface FridayRosterCoach {
  teamLabel: string
  ageBand: string
  athletes: { id: string; name: string; fpiCompetitive: number }[]
  balanced: boolean
}

export interface ClinicDeliveryCoach {
  id: string
  title: string
  focus: string
  ratio: string
  format: string
  rosterCount: number
  nextSteps: string
}

export interface AthleteCoachSnapshot {
  playerId: string
  attendanceTrend: string
  membershipTier: string
  fpiSummary: string
  priorities: string[]
  recentNotes: string[]
  clinicsRecent: string
  fridayRecent: string
  suggestedEmphasis: string
}

export const YOUTH_BLOCK_MODEL: YouthBlockModel = {
  blockMinutes: 55,
  station1Min: 25,
  transitionMin: 5,
  station2Min: 25,
  athletesPerBlock: 6,
  groupSizeMin: 3,
  groupSizeMax: 6,
  stationsActive: 2,
}

export const coachAlerts: CoachAlert[] = []

export const assignedFloorSection: FloorSectionId = 'B'

export const coachSessionsToday: CoachSessionToday[] = []

export function getCoachSessionForFloorSection(section: FloorSectionId): CoachSessionToday | undefined {
  return coachSessionsToday.find(s => s.floorSection === section)
}

export const sessionDetailById: Record<string, SessionDetailExtended> = {}

export const fridayCoachRoster: FridayRosterCoach = {
  teamLabel: '—',
  ageBand: '—',
  balanced: true,
  athletes: [],
}

export const clinicDeliveryDemo: ClinicDeliveryCoach = {
  id: '—',
  title: 'No clinic session on file',
  focus: '—',
  ratio: '—',
  format: '—',
  rosterCount: 0,
  nextSteps: 'Connect schedule / clinic data in Supabase',
}

export function getAthleteCoachSnapshot(playerId: string): AthleteCoachSnapshot {
  return {
    playerId,
    attendanceTrend: '—',
    membershipTier: '—',
    fpiSummary: '—',
    priorities: [],
    recentNotes: [],
    clinicsRecent: '—',
    fridayRecent: '—',
    suggestedEmphasis: '—',
  }
}

export const coachGuardrails = [
  'Sessions start on time · reset buffers are protected',
  'Capacity is never exceeded · quality over volume',
  'No public ranking displays · internal FPI only',
  'Supportive, competitive tone · no chaotic sideline culture',
]

export const fpiDomains = ['Speed', 'Agility', 'Technical', 'Cognitive', 'Competitive'] as const
