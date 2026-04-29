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

/** Match `home-facility-tour-isometric` Tailwind breakpoints for perspective / scale. */
export function facilityTourViewportTransform(viewportWidth: number): {
  perspective: number
  rotateX: number
  rotateZ: number
  baseScale: number
} {
  if (viewportWidth < 640) {
    return { perspective: 1500, rotateX: 54, rotateZ: -24, baseScale: 0.205 }
  }
  if (viewportWidth < 768) {
    return { perspective: 1650, rotateX: 56, rotateZ: -26, baseScale: 0.262 }
  }
  if (viewportWidth < 1024) {
    return { perspective: 1750, rotateX: 58, rotateZ: -28, baseScale: 0.445 }
  }
  return { perspective: 1800, rotateX: 58, rotateZ: -28, baseScale: 0.545 }
}

/** Slightly stronger zoom for compact bottom-row zones so entrance / flex / Footbot read clearly. */
export function zoneFocusScaleMultiplier(zoneId: string): number {
  if (zoneId === 'entrance' || zoneId === 'support-cluster' || zoneId === 'footbot') return 1.22
  if (zoneId === 'field-3') return 1.2
  return 1.12
}
