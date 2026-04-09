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
 * Isometric tour: Field 3 sits above the main slab (outdoor); Field 1 & 2 share width;
 * entrance below Field 1; Footbot is a small bay on a green block beside tall Field 2.
 * Grid map (4×4) for `PublicFacilityMap`:
 *   f3  f1  perf f2
 *   ds  f1  perf f2
 *   st  f1  perf f2
 *   st  ent sup  fb
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
      sublabel: 'Outdoor',
      left: '9%',
      top: '0.5%',
      width: '22%',
      height: '10.5%',
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
      top: '14%',
      width: '11%',
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
      top: '38%',
      width: '11%',
      height: '55%',
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
      left: '15%',
      top: '13.5%',
      width: '30%',
      height: '36%',
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
      left: '15%',
      top: '51%',
      width: '30%',
      height: '9.5%',
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
      left: '46.5%',
      top: '13.5%',
      width: '14%',
      height: '36%',
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
      left: '46.5%',
      top: '51%',
      width: '14%',
      height: '42%',
    },
  },
  {
    id: 'field-2',
    label: 'Field 2',
    gridArea: 'f2',
    emphasis: 'primary',
    copy: 'Extended parallel lane for age-tiered sessions—same width as Field 1 with a longer run of turf.',
    tour: {
      label: 'FIELD 2',
      sublabel: 'Main pitch',
      left: '62%',
      top: '13.5%',
      width: '30%',
      height: '48%',
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
      sublabel: 'On-pitch tech',
      left: '68%',
      top: '63%',
      width: '18%',
      height: '12%',
    },
  },
]

export const FACILITY_ZONES_BY_ID: Record<PublicFacilityZoneId, FacilityZone> = Object.fromEntries(
  FACILITY_ZONES.map(z => [z.id, z])
) as Record<PublicFacilityZoneId, FacilityZone>
