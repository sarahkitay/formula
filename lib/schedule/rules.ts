import type { ScheduleProgramKind } from '@/types/schedule'

/** UI / ICS-style colors: control-room legend */
export const PROGRAM_UI: Record<
  ScheduleProgramKind,
  { bg: string; border: string; text: string; key: string }
> = {
  youth_training: {
    key: 'Youth training',
    bg: 'rgb(22 101 52 / 0.92)',
    border: 'rgb(20 83 45)',
    text: '#ffffff',
  },
  preschool: {
    key: 'Pre-school (Performance Center)',
    bg: 'rgb(21 128 61 / 0.88)',
    border: 'rgb(22 101 52)',
    text: '#ffffff',
  },
  littles: {
    key: 'Littles (30 min · M/W/F AM)',
    bg: 'rgb(13 148 136 / 0.9)',
    border: 'rgb(15 118 110)',
    text: '#ffffff',
  },
  adult_league: {
    key: 'Adult league',
    bg: 'rgb(30 58 138 / 0.92)',
    border: 'rgb(29 78 216)',
    text: '#ffffff',
  },
  adult_pickup: {
    key: 'Adult pickup',
    bg: 'rgb(37 99 235 / 0.88)',
    border: 'rgb(59 130 246)',
    text: '#ffffff',
  },
  field_rental_premium: {
    key: 'Premium field rental',
    bg: 'rgb(82 82 91 / 0.85)',
    border: 'rgb(63 63 70)',
    text: '#fafafa',
  },
  field_rental_nonpremium: {
    key: 'Non-premium rental',
    bg: 'rgb(199 210 254 / 0.95)',
    border: 'rgb(165 180 252)',
    text: '#1e1b4b',
  },
  clinic: {
    key: 'Clinic / intensive',
    bg: 'rgb(147 51 234 / 0.88)',
    border: 'rgb(168 85 247)',
    text: '#ffffff',
  },
  open_gym: {
    key: 'Open gym',
    bg: 'rgb(234 88 12 / 0.9)',
    border: 'rgb(249 115 22)',
    text: '#ffffff',
  },
  party: {
    key: 'Party',
    bg: 'rgb(236 72 153 / 0.88)',
    border: 'rgb(244 114 182)',
    text: '#ffffff',
  },
  buffer: {
    key: 'Buffer / reset',
    bg: 'rgb(212 212 216 / 0.75)',
    border: 'rgb(161 161 170)',
    text: '#27272a',
  },
  unused: {
    key: 'Unused',
    bg: 'rgb(244 244 245 / 0.9)',
    border: 'rgb(228 228 231)',
    text: '#71717a',
  },
  flex_film: {
    key: 'Flex: film',
    bg: 'rgb(126 34 206 / 0.85)',
    border: 'rgb(147 51 234)',
    text: '#ffffff',
  },
  flex_ops: {
    key: 'Flex: ops / misc',
    bg: 'rgb(107 33 168 / 0.8)',
    border: 'rgb(126 34 206)',
    text: '#ffffff',
  },
  strength_conditioning: {
    key: 'S&C',
    bg: 'rgb(109 40 217 / 0.85)',
    border: 'rgb(124 58 237)',
    text: '#ffffff',
  },
  youth_game_circuit: {
    key: 'Youth game circuit (fields)',
    bg: 'rgb(5 150 105 / 0.9)',
    border: 'rgb(4 120 87)',
    text: '#ffffff',
  },
}

/** Grid window */
export const SCHEDULE_DAY_START_MINUTE = 7 * 60
export const SCHEDULE_DAY_END_MINUTE = 23 * 60

export const YOUTH_BLOCK_MINUTES = 55
export const YOUTH_GAP_MINUTES = 15
export const YOUTH_BLOCK_TOTAL = YOUTH_BLOCK_MINUTES + YOUTH_GAP_MINUTES

/** Max athletes per youth training block (Performance Center anchor roster) */
export const YOUTH_BLOCK_CAPACITY = 6

/** Littles 30-minute blocks (separate roster from rotation youth) */
export const LITTLES_BLOCK_CAPACITY = 12
