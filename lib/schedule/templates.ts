import type { DayIndex, ScheduleAgeBand } from '@/types/schedule'

export interface YouthBlockTemplate {
  ageBand: ScheduleAgeBand
  startMinute: number
  endMinute: number
}

const M = (h: number, m: number) => h * 60 + m

/**
 * Mon(1) Wed(3) Fri(5): fixed ladder
 * 4-5 → 15:30–16:25, 6-8 → 16:40–17:35, 9-11 → 17:50–18:45,
 * 12-14 → 19:00–19:55, 15-19 → 20:10–21:05
 */
const MWF: YouthBlockTemplate[] = [
  { ageBand: '4-5', startMinute: M(15, 30), endMinute: M(16, 25) },
  { ageBand: '6-8', startMinute: M(16, 40), endMinute: M(17, 35) },
  { ageBand: '9-11', startMinute: M(17, 50), endMinute: M(18, 45) },
  { ageBand: '12-14', startMinute: M(19, 0), endMinute: M(19, 55) },
  { ageBand: '15-19', startMinute: M(20, 10), endMinute: M(21, 5) },
]

/** Tue: 9-11 sits out; 12-14 & 15-19 shift into earlier ladder; preserve gap before 21:00 pickup */
const TUESDAY: YouthBlockTemplate[] = [
  { ageBand: '4-5', startMinute: M(15, 30), endMinute: M(16, 25) },
  { ageBand: '6-8', startMinute: M(16, 40), endMinute: M(17, 35) },
  { ageBand: '12-14', startMinute: M(17, 50), endMinute: M(18, 45) },
  { ageBand: '15-19', startMinute: M(19, 0), endMinute: M(19, 55) },
]

/** Thu: 12-14 sits out; earlier bands unchanged; 15-19 occupies 12-14 slot + keeps late block */
const THURSDAY: YouthBlockTemplate[] = [
  { ageBand: '4-5', startMinute: M(15, 30), endMinute: M(16, 25) },
  { ageBand: '6-8', startMinute: M(16, 40), endMinute: M(17, 35) },
  { ageBand: '9-11', startMinute: M(17, 50), endMinute: M(18, 45) },
  { ageBand: '15-19', startMinute: M(19, 0), endMinute: M(19, 55) },
  { ageBand: '15-19', startMinute: M(20, 10), endMinute: M(21, 5) },
]

/** Sat: 15-19 sits out; first block 9:00; 70-min pitch */
const SATURDAY: YouthBlockTemplate[] = [
  { ageBand: '4-5', startMinute: M(9, 0), endMinute: M(9, 55) },
  { ageBand: '6-8', startMinute: M(10, 10), endMinute: M(11, 5) },
  { ageBand: '9-11', startMinute: M(11, 20), endMinute: M(12, 15) },
  { ageBand: '12-14', startMinute: M(12, 30), endMinute: M(13, 25) },
]

/** Sun: only 9-11, 12-14, 15-19 */
const SUNDAY: YouthBlockTemplate[] = [
  { ageBand: '9-11', startMinute: M(9, 0), endMinute: M(9, 55) },
  { ageBand: '12-14', startMinute: M(10, 10), endMinute: M(11, 5) },
  { ageBand: '15-19', startMinute: M(11, 20), endMinute: M(12, 15) },
]

export function getYouthBlocksForDay(dayIndex: DayIndex): YouthBlockTemplate[] {
  switch (dayIndex) {
    case 0:
      return SUNDAY
    case 1:
    case 3:
    case 5:
      return MWF
    case 2:
      return TUESDAY
    case 4:
      return THURSDAY
    case 6:
      return SATURDAY
    default:
      return []
  }
}
