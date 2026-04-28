import type { CareerPosition } from '@/lib/careers/career-applications-server'

export const CAREER_POSITION_OPTIONS: { value: CareerPosition; label: string; blurb: string }[] = [
  {
    value: 'front_desk',
    label: 'Front desk',
    blurb: 'Guest experience, check-in, scheduling support, and facility hospitality.',
  },
  {
    value: 'coach',
    label: 'Coach',
    blurb: 'Youth and program coaching on the floor; alignment with Formula curriculum and safety standards.',
  },
]

export function careerPositionLabel(value: string): string {
  return CAREER_POSITION_OPTIONS.find((o) => o.value === value)?.label ?? value
}
