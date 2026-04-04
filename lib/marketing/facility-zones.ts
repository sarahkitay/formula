/**
 * Canonical public facility zones — single source for /facility map, homepage tour,
 * and isometric hotspot geometry (same % as `FacilityTourStaticFloor`).
 */

export type PublicFacilityZoneId =
  | 'field-1'
  | 'field-2'
  | 'field-3'
  | 'performance-center'
  | 'speed-track'
  | 'double-speed-court'
  | 'footbot'
  | 'support-cluster'

export type FacilityEmphasis = 'primary' | 'support'

export type FacilityZoneTour = {
  label: string
  sublabel: string
  left: string
  top: string
  width: string
  height: string
}

export type FacilityZone = {
  id: PublicFacilityZoneId
  label: string
  sub?: string
  /** Name in `grid-template-areas` for `PublicFacilityMap` */
  gridArea: string
  copy: string
  emphasis: FacilityEmphasis
  tour: FacilityZoneTour
}

/**
 * Spatial reading order; `FACILITY_TOUR_LAYOUT` is derived from this array.
 * Grid areas (4×3):
 *   f3  f1  perf  f2
 *   ds  f1  perf  fb
 *   st  f1  sup   fb
 */
export const FACILITY_ZONES: FacilityZone[] = [
  {
    id: 'field-3',
    label: 'Field 3',
    gridArea: 'f3',
    emphasis: 'primary',
    copy: 'Technical emphasis and high-touch coaching ratios during peak windows.',
    tour: {
      label: 'FIELD 3',
      sublabel: 'Court lanes',
      left: '3.5%',
      top: '5%',
      width: '12.5%',
      height: '20%',
    },
  },
  {
    id: 'double-speed-court',
    label: 'Double Speed Court',
    gridArea: 'ds',
    emphasis: 'primary',
    copy: 'Lateral change-of-direction and repeatability under structured constraints.',
    tour: {
      label: 'DOUBLE SPEED COURT',
      sublabel: 'Drill bays',
      left: '3.5%',
      top: '27%',
      width: '12.5%',
      height: '24%',
    },
  },
  {
    id: 'speed-track',
    label: 'Speed Track',
    gridArea: 'st',
    emphasis: 'primary',
    copy: 'Linear acceleration and mechanical efficiency — metered, not chaotic.',
    tour: {
      label: 'SPEED TRACK',
      sublabel: 'Sprint lane',
      left: '3.5%',
      top: '53%',
      width: '12.5%',
      height: '40%',
    },
  },
  {
    id: 'field-1',
    label: 'Field 1',
    gridArea: 'f1',
    emphasis: 'primary',
    copy: 'Match-grade surface for block training, small-sided work, and controlled repetition.',
    tour: {
      label: 'FIELD 1',
      sublabel: 'Center pitch',
      left: '17%',
      top: '5%',
      width: '33%',
      height: '88%',
    },
  },
  {
    id: 'performance-center',
    label: 'Performance Center',
    sub: 'Application layer',
    gridArea: 'perf',
    emphasis: 'primary',
    copy:
      'Where training translates: constrained game scenarios, tempo discipline, and competitive application.',
    tour: {
      label: 'PERFORMANCE CENTER',
      sublabel: 'Application layer',
      left: '51.5%',
      top: '5%',
      width: '17%',
      height: '47%',
    },
  },
  {
    id: 'support-cluster',
    label: 'Support',
    sub: 'Gym · flex · party',
    gridArea: 'sup',
    emphasis: 'support',
    copy:
      'Gym, flex room, party hosting, and program-adjacent support — important operationally, secondary on this map to core training assets.',
    tour: {
      label: 'SUPPORT',
      sublabel: 'Gym · flex · party',
      left: '51.5%',
      top: '54%',
      width: '17%',
      height: '39%',
    },
  },
  {
    id: 'field-2',
    label: 'Field 2',
    gridArea: 'f2',
    emphasis: 'primary',
    copy: 'Parallel lane for age-tiered sessions and capacity-balanced programming.',
    tour: {
      label: 'FIELD 2',
      sublabel: 'Main pitch',
      left: '70%',
      top: '5%',
      width: '27%',
      height: '40%',
    },
  },
  {
    id: 'footbot',
    label: 'Footbot',
    gridArea: 'fb',
    emphasis: 'primary',
    copy: 'Precision touch and distribution reps with measurable volume and consistency.',
    tour: {
      label: 'FOOTBOT',
      sublabel: 'Tech zone',
      left: '70%',
      top: '47%',
      width: '27%',
      height: '46%',
    },
  },
]

export const FACILITY_ZONES_BY_ID: Record<PublicFacilityZoneId, FacilityZone> = Object.fromEntries(
  FACILITY_ZONES.map(z => [z.id, z])
) as Record<PublicFacilityZoneId, FacilityZone>
