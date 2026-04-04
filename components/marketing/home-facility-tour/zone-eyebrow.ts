import type { FacilityZone } from '@/lib/marketing/facility-zones'

/** Short label for tour UI (aligned with facility map roles). */
export function facilityZoneEyebrow(z: FacilityZone): string {
  switch (z.id) {
    case 'field-1':
    case 'field-2':
    case 'field-3':
      return 'Protected field'
    case 'performance-center':
      return z.sub ?? 'Application layer'
    case 'speed-track':
      return 'Linear speed'
    case 'double-speed-court':
      return 'Lateral repeatability'
    case 'footbot':
      return 'Precision reps'
    case 'support-cluster':
      return 'Program support'
    default:
      return z.sub ?? 'Facility zone'
  }
}
