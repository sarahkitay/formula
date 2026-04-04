import { FACILITY_ZONES } from '@/lib/marketing/facility-zones'
import type { PublicFacilityZoneId } from '@/lib/marketing/facility-zones'

/**
 * Hit areas and labels for the homepage facility tour (% positions inside the 1240×930 transform plane).
 * Derived from `FACILITY_ZONES` so map and tour stay aligned.
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

export const FACILITY_TOUR_LAYOUT: FacilityTourLayoutEntry[] = FACILITY_ZONES.map(z => ({
  id: z.id,
  label: z.tour.label,
  short: z.label,
  sublabel: z.tour.sublabel,
  left: z.tour.left,
  top: z.tour.top,
  width: z.tour.width,
  height: z.tour.height,
}))
