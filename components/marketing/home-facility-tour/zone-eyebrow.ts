import type { FacilityZone } from '@/lib/marketing/facility-zones'

/** Short label for tour UI (aligned with facility map roles). */
export function facilityZoneEyebrow(z: FacilityZone): string {
  if (z.sub) return z.sub
  switch (z.id) {
    case 'field-1':
    case 'field-2':
    case 'field-3':
      return 'Protected field'
    case 'match-arena':
      return 'Application layer'
    case 'speed-track':
      return 'Linear speed'
    case 'double-speed':
      return 'Lateral repeatability'
    case 'speed-court':
      return 'Cognitive layer'
    case 'footbot':
      return 'Precision reps'
    case 'gym':
      return 'Athletic capacity'
    case 'flex-room':
      return 'Support space'
    case 'party-room':
      return 'Hosted events'
    default:
      return 'Facility zone'
  }
}
