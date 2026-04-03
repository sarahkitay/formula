import type { PublicFacilityZoneId } from '@/lib/marketing/facility-zones'

/**
 * Hit areas and labels for the homepage facility tour — % positions inside the 1240×930 transform plane
 * (matches `FacilityTourStaticFloor` geometry).
 */
export type FacilityTourLayoutEntry = {
  id: PublicFacilityZoneId
  label: string
  short: string
  sublabel: string
  left: string
  top: string
  width: string
  height: string
}

export const FACILITY_TOUR_LAYOUT: FacilityTourLayoutEntry[] = [
  {
    id: 'field-1',
    label: 'FIELD 1',
    short: 'Field 1',
    sublabel: 'Upper pitch',
    left: '24.8%',
    top: '5.2%',
    width: '21.8%',
    height: '14.2%',
  },
  {
    id: 'speed-track',
    label: 'SPEED TRACK',
    short: 'Speed Track',
    sublabel: 'Sprint lane',
    left: '8.2%',
    top: '19.2%',
    width: '6.6%',
    height: '43.8%',
  },
  {
    id: 'double-speed',
    label: 'DOUBLE SPEED COURT',
    short: 'Double Speed Court',
    sublabel: 'Drill bays',
    left: '15.8%',
    top: '23.1%',
    width: '13.2%',
    height: '27.6%',
  },
  {
    id: 'footbot',
    label: 'FOOTBOT',
    short: 'Footbot',
    sublabel: 'Tech zone',
    left: '5.8%',
    top: '63.5%',
    width: '18.2%',
    height: '17.5%',
  },
  {
    id: 'field-2',
    label: 'FIELD 2',
    short: 'Field 2',
    sublabel: 'Main pitch',
    left: '30.1%',
    top: '22.1%',
    width: '20.8%',
    height: '45.2%',
  },
  {
    id: 'field-3',
    label: 'FIELD 3',
    short: 'Field 3',
    sublabel: 'Court lanes',
    left: '51.8%',
    top: '22.1%',
    width: '13.3%',
    height: '33.4%',
  },
  {
    id: 'match-arena',
    label: 'MATCH ARENA',
    short: 'Match Arena',
    sublabel: 'Proving ground',
    left: '68.2%',
    top: '18.2%',
    width: '22.7%',
    height: '45.8%',
  },
  {
    id: 'gym',
    label: 'GYM',
    short: 'Gym',
    sublabel: 'Strength + support',
    left: '37.6%',
    top: '74.5%',
    width: '16.5%',
    height: '10.5%',
  },
  {
    id: 'speed-court',
    label: 'SPEED COURT',
    short: 'Speed Court',
    sublabel: 'Lounge',
    left: '56.8%',
    top: '66.5%',
    width: '18.8%',
    height: '19.5%',
  },
  {
    id: 'party-room',
    label: 'PARTY ROOM',
    short: 'Party Room',
    sublabel: 'Lower field',
    left: '76.6%',
    top: '66%',
    width: '17.5%',
    height: '22%',
  },
]
