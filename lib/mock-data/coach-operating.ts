/**
 * Coach execution layer - session delivery, youth block model, FPI inputs (demo).
 */

import type { FloorSectionId } from '@/lib/mock-data/coach-floor-program'

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
  athletesPerBlock: 20,
  groupSizeMin: 5,
  groupSizeMax: 6,
  stationsActive: 2,
}

export const coachAlerts: CoachAlert[] = [
  { id: 'ca1', type: 'low-attendance', message: 'U12 block at 82% check-in vs roster (target ≥90%)' },
  { id: 'ca2', type: 'missing-athlete', message: 'Expected: L. Chen - no check-in 12m past block start' },
  { id: 'ca3', type: 'delayed-start', message: 'Prior block ran 3m long - protect downstream buffer' },
  { id: 'ca4', type: 'equipment', message: 'Speed ladder set B · verify before Station 2 rotation' },
]

export const assignedFloorSection: FloorSectionId = 'B'

export const coachSessionsToday: CoachSessionToday[] = [
  {
  sessionId: 'session-1',
  title: 'Elite U14 · Technical block',
  startTime: '07:00',
  endTime: '07:55',
  ageLabel: 'U14',
  programType: 'Technical / application',
  fieldName: 'Field A · Main',
  fieldId: 'field-a',
  floorSection: 'A',
  status: 'completed',
  capacity: 22,
  enrolled: 14,
  checkedIn: 14,
  },
  {
  sessionId: 'session-2',
  title: 'Development U12 · Four-coach block',
  startTime: '15:30',
  endTime: '16:25',
  ageLabel: 'U12',
  programType: 'Station rotation',
  fieldName: 'Field B · Training grid',
  fieldId: 'field-b',
  floorSection: 'B',
  status: 'in-progress',
  capacity: 22,
  enrolled: 17,
  checkedIn: 14,
  },
  {
  sessionId: 'session-3',
  title: 'Foundation U10',
  startTime: '16:40',
  endTime: '17:35',
  ageLabel: 'U10',
  programType: 'Station rotation',
  fieldName: 'Field B · Training grid',
  fieldId: 'field-b',
  floorSection: 'B',
  status: 'scheduled',
  capacity: 20,
  enrolled: 18,
  checkedIn: 0,
  },
]

export function getCoachSessionForFloorSection(section: FloorSectionId): CoachSessionToday | undefined {
  return coachSessionsToday.find(s => s.floorSection === section)
}

export const sessionDetailById: Record<string, SessionDetailExtended> = {
  'session-2': {
  sessionId: 'session-2',
  notes: 'Emphasize first touch under pressure · cognitive cue: scan before receive.',
  stationPlan: {
  station1: { label: 'Station A · North grid', focus: '1v1 + escape' },
  station2: { label: 'Station B · South grid', focus: 'Rondo 4+2' },
  transitionMin: 5,
  },
  groups: [
  {
  id: 'g1',
  label: 'Group 1',
  athleteIds: ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'],
  station1: 'North · 1v1',
  station2: 'South · Rondo',
  },
  {
  id: 'g2',
  label: 'Group 2',
  athleteIds: ['player-6', 'player-7', 'player-8', 'player-9', 'player-10'],
  station1: 'North · 1v1',
  station2: 'South · Rondo',
  },
  {
  id: 'g3',
  label: 'Group 3',
  athleteIds: ['player-11', 'player-12', 'player-13', 'player-14'],
  station1: 'North · 1v1',
  station2: 'South · Rondo',
  },
  ],
  substitutions: ['S. Ali called up from U11 shadow (director approved)'],
  },
}

export const fridayCoachRoster: FridayRosterCoach = {
  teamLabel: 'Gold A',
  ageBand: '9–11',
  balanced: true,
  athletes: [
  { id: 'player-1', name: 'Ethan Cross', fpiCompetitive: 62 },
  { id: 'player-3', name: 'Noah Patel', fpiCompetitive: 58 },
  { id: 'player-4', name: 'Aiden Thompson', fpiCompetitive: 55 },
  ],
}

export const clinicDeliveryDemo: ClinicDeliveryCoach = {
  id: 'clinic-1',
  title: 'Acceleration lab · invite',
  focus: 'First-step mechanics + arm swing',
  ratio: '1 : 6',
  format: '3-station rotation · timed',
  rosterCount: 6,
  nextSteps: 'Recommend speed pillar touch + reassessment window Apr',
}

export function getAthleteCoachSnapshot(playerId: string): AthleteCoachSnapshot {
  return {
  playerId,
  attendanceTrend: 'Last 8 sessions: 7 present · 1 excused',
  membershipTier: 'Performance Plus',
  fpiSummary: 'Technical 68 · Competitive 61 · Cognitive 54 (internal)',
  priorities: ['Scan habit under pressure', 'Weak-foot reception', 'Transition defending'],
  recentNotes: ['Mar 20: improved shoulder check in rondo', 'Mar 18: late to line - addressed'],
  clinicsRecent: 'Speed lab · Mar 14',
  fridayRecent: 'Gold A · Mar 21 circuit',
  suggestedEmphasis: 'Cognitive - decision speed in overload',
  }
}

export const coachGuardrails = [
  'Sessions start on time · reset buffers are protected',
  'Capacity is never exceeded · quality over volume',
  'No public ranking displays · internal FPI only',
  'Supportive, competitive tone · no chaotic sideline culture',
]

export const fpiDomains = ['Speed', 'Agility', 'Technical', 'Cognitive', 'Competitive'] as const
