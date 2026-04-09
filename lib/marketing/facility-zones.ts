/**
 * Canonical public facility zones: single source for /facility map, homepage tour,
 * and isometric hotspot geometry (same % as `FacilityTourStaticFloor`).
 */

export type PublicFacilityZoneId =
  | 'field-1'
  | 'field-2'
  | 'field-3'
  | 'entrance'
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
 * Tour layout mirrors the reference plan: Field 3 and Field 1 are matching long pitches;
 * Footbot and Entrance are equal blocks directly beneath them; Field 2 fills the right.
 * Grid map (5×2) for `PublicFacilityMap`:
 *   ds  f3  f1  perf f2
 *   st  fb  ent sup  f2
 */
export const FACILITY_ZONES: FacilityZone[] = [
  {
    id: 'field-3',
    label: 'Field 3',
    gridArea: 'f3',
    emphasis: 'primary',
    copy: 'Outdoor technical lanes: open-air work with the same coaching density as inside.',
    tour: {
      label: 'FIELD 3',
      sublabel: 'Outdoor pitch',
      left: '13%',
      top: '12%',
      width: '15%',
      height: '47%',
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
      left: '3%',
      top: '12%',
      width: '9%',
      height: '22%',
    },
  },
  {
    id: 'speed-track',
    label: 'Speed Track',
    gridArea: 'st',
    emphasis: 'primary',
    copy: 'Linear acceleration and mechanical efficiency: metered, not chaotic.',
    tour: {
      label: 'SPEED TRACK',
      sublabel: 'Sprint lane',
      left: '3%',
      top: '35%',
      width: '9%',
      height: '35%',
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
      left: '29%',
      top: '12%',
      width: '15%',
      height: '47%',
    },
  },
  {
    id: 'entrance',
    label: 'Entrance',
    sub: 'Front desk',
    gridArea: 'ent',
    emphasis: 'support',
    copy: 'Check-in, orientation, and the first touchpoint before athletes step onto the floor.',
    tour: {
      label: 'ENTRANCE',
      sublabel: 'Front desk',
      left: '29%',
      top: '59%',
      width: '15%',
      height: '11%',
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
      left: '45%',
      top: '12%',
      width: '13%',
      height: '34%',
    },
  },
  {
    id: 'support-cluster',
    label: 'Support',
    sub: 'Gym · flex · party',
    gridArea: 'sup',
    emphasis: 'support',
    copy:
      'Gym, flex room, party hosting, and program-adjacent support: important operationally, secondary on this map to core training assets.',
    tour: {
      label: 'SUPPORT',
      sublabel: 'Gym · flex · party',
      left: '45%',
      top: '48%',
      width: '13%',
      height: '22%',
    },
  },
  {
    id: 'field-2',
    label: 'Field 2',
    gridArea: 'f2',
    emphasis: 'primary',
    copy: 'Parallel full-length lane beside performance and support—capacity for tiered sessions.',
    tour: {
      label: 'FIELD 2',
      sublabel: 'Main pitch',
      left: '59%',
      top: '12%',
      width: '36%',
      height: '58%',
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
      sublabel: 'Tech bay',
      left: '13%',
      top: '59%',
      width: '15%',
      height: '11%',
    },
  },
]

export const FACILITY_ZONES_BY_ID: Record<PublicFacilityZoneId, FacilityZone> = Object.fromEntries(
  FACILITY_ZONES.map(z => [z.id, z])
) as Record<PublicFacilityZoneId, FacilityZone>
