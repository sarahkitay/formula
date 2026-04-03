/**
 * Demo: daily floor program set by lead coaches - shown on coach training floor map.
 * In production this would come from schedule + assignments API.
 */

export type FloorSectionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

export const FLOOR_SECTION_IDS: FloorSectionId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

export type CoachFloorRole = 'lead' | 'assistant' | 'rotation'

export interface FloorSectionProgram {
  sectionName: string
  surfaceType: string
  capacity: string
  /** Program / drills for this block (set by lead for the day) */
  leadProgram: string
  /** Group roster this section is tied to */
  groupLabel: string
  /** Time window for this assignment */
  window: string
  /** Lead coach who set today’s plan */
  leadCoachName: string
  /** This login’s role for the section */
  yourRole: CoachFloorRole
}

/** Today’s plan by section (Marcus Rivera = coach-1 is lead on A, assistant on D, etc.) */
export const FLOOR_PROGRAM_BY_SECTION: Record<FloorSectionId, FloorSectionProgram> = {
  A: {
  sectionName: 'Main indoor pitch',
  surfaceType: 'Soccer / futsal',
  capacity: '22 athletes',
  leadProgram: 'Pressing triggers · 4-3-1 build-out (lead set 7:00 AM)',
  groupLabel: 'Elite U14 · Group 1',
  window: '4:00 PM – 5:15 PM',
  leadCoachName: 'Marcus Rivera',
  yourRole: 'lead',
  },
  B: {
  sectionName: 'Training grid',
  surfaceType: 'Tennis / badminton lines',
  capacity: '8 per court',
  leadProgram: 'Speed ladder + reactive gates (lead set)',
  groupLabel: 'Development U12',
  window: '4:30 PM – 5:45 PM',
  leadCoachName: 'Elena Vasquez',
  yourRole: 'rotation',
  },
  C: {
  sectionName: 'Secondary pitch',
  surfaceType: 'Soccer / futsal',
  capacity: '14 athletes',
  leadProgram: 'Finishing circuit · weak-foot emphasis',
  groupLabel: 'Academy U16',
  window: '5:00 PM – 6:00 PM',
  leadCoachName: 'Jordan Kim',
  yourRole: 'assistant',
  },
  D: {
  sectionName: 'Upper training strip',
  surfaceType: 'Multi-skill lanes',
  capacity: '30 athletes',
  leadProgram: 'Agility wave · COD deceleration (lead set)',
  groupLabel: 'Speed school · mixed ages',
  window: '5:50 PM – 6:40 PM',
  leadCoachName: 'Marcus Rivera',
  yourRole: 'lead',
  },
  E: {
  sectionName: 'Multi-purpose court',
  surfaceType: 'Basketball / volleyball',
  capacity: '20 players',
  leadProgram: 'Small-sided transition game',
  groupLabel: 'HS prep',
  window: '6:00 PM – 7:00 PM',
  leadCoachName: 'Elena Vasquez',
  yourRole: 'rotation',
  },
  F: {
  sectionName: 'Practice grid A',
  surfaceType: 'Training / cones',
  capacity: '16 athletes',
  leadProgram: '1v1 + overload rondos',
  groupLabel: 'U10 fundamentals',
  window: '4:15 PM – 5:00 PM',
  leadCoachName: 'Jordan Kim',
  yourRole: 'assistant',
  },
  G: {
  sectionName: 'Practice grid B',
  surfaceType: 'Training / cones',
  capacity: '16 athletes',
  leadProgram: 'GK distribution + first touch',
  groupLabel: 'GK academy',
  window: '5:15 PM – 6:00 PM',
  leadCoachName: 'Elena Vasquez',
  yourRole: 'rotation',
  },
}
