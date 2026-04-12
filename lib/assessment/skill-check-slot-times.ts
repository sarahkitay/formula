import { ASSESSMENT_SLOT_TIMEZONE } from '@/lib/assessment/constants'
import {
  advanceCalendarDay,
  getYmdInTz,
  isWeekdayYmd,
  wallClockToUtc,
} from '@/lib/assessment/zoned-wall-time'

/** Starts where hour ∈ [8..15] any quarter-hour, or 16:00 (60 min block ends by 17:00 local). */
function allValidStartHM(): { h: number; m: number }[] {
  const out: { h: number; m: number }[] = []
  for (let h = 8; h <= 15; h++) {
    for (const m of [0, 15, 30, 45]) {
      out.push({ h, m })
    }
  }
  out.push({ h: 16, m: 0 })
  return out
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Five pseudo-random start times per calendar day (stable for a given date). */
export function pickSkillCheckTimesForDay(y: number, mo: number, da: number): { h: number; m: number }[] {
  const opts = [...allValidStartHM()]
  const seed = (y * 100_003 + mo * 10_009 + da * 1_000_003) >>> 0
  const rnd = mulberry32(seed)
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[opts[i], opts[j]] = [opts[j], opts[i]]
  }
  return opts.slice(0, 5).sort((a, b) => a.h - b.h || a.m - b.m)
}

/**
 * Upcoming weekday-only Skills Check instants in `timeZone`, 8:00–16:00 local starts, five per day.
 */
export function generateSkillCheckSlotInstants(
  count: number,
  afterExclusive: Date,
  timeZone: string = ASSESSMENT_SLOT_TIMEZONE
): Date[] {
  const slots: Date[] = []
  const today = getYmdInTz(new Date(), timeZone)
  let ymd = advanceCalendarDay(today.y, today.mo, today.da, timeZone)

  for (let scanned = 0; slots.length < count && scanned < 140; scanned++) {
    if (isWeekdayYmd(ymd.y, ymd.mo, ymd.da, timeZone)) {
      for (const { h, m } of pickSkillCheckTimesForDay(ymd.y, ymd.mo, ymd.da)) {
        const inst = wallClockToUtc(ymd.y, ymd.mo, ymd.da, h, m, timeZone)
        if (inst.getTime() > afterExclusive.getTime()) {
          slots.push(inst)
          if (slots.length >= count) break
        }
      }
    }
    ymd = advanceCalendarDay(ymd.y, ymd.mo, ymd.da, timeZone)
  }

  return slots.sort((a, b) => a.getTime() - b.getTime()).slice(0, count)
}
