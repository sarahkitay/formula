import type { FacilityZoneTour } from '@/lib/marketing/facility-zones'

export function parseTourPercent(value: string): number {
  return Number.parseFloat(String(value).replace('%', '')) || 0
}

/** Center of a tour rect in percentage space (0–100) inside the 1240×930 plate. */
export function zoneFocusOriginPercents(tour: FacilityZoneTour): { ox: number; oy: number } {
  const L = parseTourPercent(tour.left)
  const T = parseTourPercent(tour.top)
  const W = parseTourPercent(tour.width)
  const H = parseTourPercent(tour.height)
  return { ox: L + W / 2, oy: T + H / 2 }
}

/** Inner-layer scale when a zone is focused (outer 3D plate stays fixed). Slightly higher for small zones. */
export function zoneFocusScaleMultiplier(zoneId: string): number {
  if (zoneId === 'entrance' || zoneId === 'support-cluster' || zoneId === 'footbot') return 1.22
  if (zoneId === 'field-3') return 1.2
  return 1.12
}
