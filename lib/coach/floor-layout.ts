/**
 * Training floor map geometry + idle section labels (no fabricated coach rosters).
 * Live assignments come from schedule + staff directory when connected.
 */

export type FloorSectionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

export const FLOOR_SECTION_IDS: FloorSectionId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

export type CoachFloorRole = 'lead' | 'assistant' | 'rotation'

export interface FloorSectionProgram {
  sectionName: string
  surfaceType: string
  capacity: string
  leadProgram: string
  groupLabel: string
  window: string
  leadCoachName: string
  yourRole: CoachFloorRole
}

const idle = (sectionName: string, surfaceType: string, capacity: string): FloorSectionProgram => ({
  sectionName,
  surfaceType,
  capacity,
  leadProgram: '—',
  groupLabel: '—',
  window: '—',
  leadCoachName: '—',
  yourRole: 'rotation',
})

/** Placeholder grid until schedule assignments sync. */
export const FLOOR_PROGRAM_BY_SECTION: Record<FloorSectionId, FloorSectionProgram> = {
  A: idle('Main indoor pitch', 'Soccer / futsal', '22 athletes'),
  B: idle('Training grid', 'Multi-skill lanes', '8 per court'),
  C: idle('Secondary pitch', 'Soccer / futsal', '14 athletes'),
  D: idle('Upper training strip', 'Multi-skill lanes', '30 athletes'),
  E: idle('Multi-purpose court', 'Court sports', '20 players'),
  F: idle('Practice grid A', 'Training / cones', '16 athletes'),
  G: idle('Practice grid B', 'Training / cones', '16 athletes'),
}
