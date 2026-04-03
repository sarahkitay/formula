/**
 * Pre-determined facility schedule model (generated, not user-authored).
 * See lib/schedule/rules.ts for business constraints.
 */

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 /** Sun–Sat */

/** Canonical training / revenue bands used by the generator */
export type ScheduleAgeBand = '4-5' | '6-8' | '9-11' | '12-14' | '15-19'

export type ScheduleProgramKind =
  | 'youth_training'
  | 'preschool'
  | 'adult_league'
  | 'adult_pickup'
  | 'field_rental_premium'
  | 'field_rental_nonpremium'
  | 'clinic'
  | 'open_gym'
  | 'party'
  | 'buffer'
  | 'unused'
  | 'flex_film'
  | 'flex_ops'
  | 'strength_conditioning'
  | 'youth_game_circuit'

export type ScheduleAssetCategory = 'field' | 'training' | 'other'

export interface ScheduleAsset {
  id: string
  label: string
  category: ScheduleAssetCategory
  /** Fields: never youth training */
  allowsYouthTraining: boolean
}

/** Minutes from midnight [0, 1440) */
export interface ScheduleSlot {
  id: string
  assetId: string
  dayIndex: DayIndex
  startMinute: number
  endMinute: number
  kind: ScheduleProgramKind
  label: string
  ageBand?: ScheduleAgeBand
  /** Links rotation rows for the same youth block */
  youthBlockId?: string
  stationIndex?: 1 | 2 | 3 | 4
}

export interface ScheduleOverride {
  id: string
  /** ISO date (facility local day) */
  date: string
  assetId: string
  startMinute: number
  endMinute: number
  kind: ScheduleProgramKind
  label: string
  /** Replace any overlapping generated slots on this asset/day */
  mode: 'replace'
}

export interface GeneratedWeek {
  weekStart: string
  weekEnd: string
  slots: ScheduleSlot[]
}

export interface GeneratedMultiWeek {
  weeks: GeneratedWeek[]
  overridesApplied: number
}

/** Bookable slice derived for parent portal (enrollment into fixed block) */
export interface BookableYouthSlot {
  id: string
  youthBlockId: string
  dayIndex: DayIndex
  weekStart: string
  startMinute: number
  endMinute: number
  ageBand: ScheduleAgeBand
  label: string
  capacity: number
  enrolled: number
}
