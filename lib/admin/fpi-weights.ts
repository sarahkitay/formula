/** FPI pillar weights by age band - internal scientific model only */

export const FPI_PILLARS = ['Speed', 'Agility', 'Technical', 'Cognitive', 'Competitive'] as const
export type FpiPillar = (typeof FPI_PILLARS)[number]

export type AgeBandId = '6-11' | '12-19'

export const FPI_WEIGHTS_BY_AGE: Record<AgeBandId, Record<FpiPillar, number>> = {
  '6-11': {
  Speed: 0.2,
  Agility: 0.2,
  Technical: 0.3,
  Cognitive: 0.15,
  Competitive: 0.15,
  },
  '12-19': {
  Speed: 0.2,
  Agility: 0.2,
  Technical: 0.25,
  Cognitive: 0.15,
  Competitive: 0.2,
  },
}

export function ageBandForAthlete(age: number): AgeBandId {
  if (age >= 6 && age <= 11) return '6-11'
  return '12-19'
}
