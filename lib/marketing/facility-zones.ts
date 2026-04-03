/** Shared facility plan metadata (matches interactive SVG on /facility). */

export type PublicFacilityZoneId =
  | 'field-1'
  | 'field-2'
  | 'field-3'
  | 'match-arena'
  | 'speed-track'
  | 'double-speed'
  | 'speed-court'
  | 'footbot'
  | 'gym'
  | 'flex-room'
  | 'party-room'

export type FacilityZone = {
  id: PublicFacilityZoneId
  label: string
  sub?: string
  /** SVG viewBox 0 0 1000 520 */
  x: number
  y: number
  w: number
  h: number
  copy: string
}

export const FACILITY_ZONES: FacilityZone[] = [
  {
    id: 'field-1',
    label: 'Field 1',
    x: 24,
    y: 80,
    w: 200,
    h: 120,
    copy: 'Match-grade surface for block training, small-sided work, and controlled repetition.',
  },
  {
    id: 'field-2',
    label: 'Field 2',
    x: 232,
    y: 80,
    w: 200,
    h: 120,
    copy: 'Parallel lane for age-tiered sessions and capacity-balanced programming.',
  },
  {
    id: 'field-3',
    label: 'Field 3',
    x: 440,
    y: 80,
    w: 200,
    h: 120,
    copy: 'Technical emphasis and high-touch coaching ratios during peak windows.',
  },
  {
    id: 'match-arena',
    label: 'Match Arena',
    sub: 'Proving ground',
    x: 648,
    y: 80,
    w: 328,
    h: 120,
    copy: 'Where training translates: constrained game scenarios, tempo discipline, and competitive application.',
  },
  {
    id: 'speed-track',
    label: 'Speed Track',
    x: 24,
    y: 216,
    w: 952,
    h: 72,
    copy: 'Linear acceleration and mechanical efficiency - metered, not chaotic.',
  },
  {
    id: 'double-speed',
    label: 'Double Speed Court',
    x: 24,
    y: 304,
    w: 470,
    h: 100,
    copy: 'Lateral change-of-direction and repeatability under structured constraints.',
  },
  {
    id: 'speed-court',
    label: 'Speed Court',
    x: 506,
    y: 304,
    w: 470,
    h: 100,
    copy: 'Cognitive speed and decision density - scan habits tied to movement outcomes.',
  },
  {
    id: 'footbot',
    label: 'Footbot',
    x: 24,
    y: 420,
    w: 220,
    h: 88,
    copy: 'Precision touch and distribution reps with measurable volume and consistency.',
  },
  {
    id: 'gym',
    label: 'Gym',
    x: 252,
    y: 420,
    w: 220,
    h: 88,
    copy: 'Strength and resilience primitives that protect the athlete and unlock capacity.',
  },
  {
    id: 'flex-room',
    label: 'Flex Room',
    x: 480,
    y: 420,
    w: 220,
    h: 88,
    copy: 'Recovery, movement prep, and micro-session overflow without compromising floor integrity.',
  },
  {
    id: 'party-room',
    label: 'Party Room',
    x: 708,
    y: 420,
    w: 268,
    h: 88,
    copy: 'Program-adjacent events with the same operational discipline as training blocks.',
  },
]

const VB_W = 1000
const VB_H = 520
const INSET_PCT = 2.3
const USABLE = 100 - 2 * INSET_PCT

/** Map SVG plan coords to % inside an inset frame (legacy helper; homepage tour uses `FACILITY_TOUR_LAYOUT`). */
export function facilitySvgRectToTourPercent(rect: Pick<FacilityZone, 'x' | 'y' | 'w' | 'h'>) {
  return {
    x: INSET_PCT + (rect.x / VB_W) * USABLE,
    y: INSET_PCT + (rect.y / VB_H) * USABLE,
    w: (rect.w / VB_W) * USABLE,
    h: (rect.h / VB_H) * USABLE,
  }
}
