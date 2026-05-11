import { FACILITY_TIMEZONE } from '@/lib/facility/facility-day'

/**
 * UTC instant for a wall-clock time on a calendar day in `timeZone` (IANA).
 * Minute-step search around UTC noon on `ymd` so DST and offset changes stay predictable.
 */
export function utcInstantForLocalWallClock(
  ymd: string,
  hour24: number,
  minute: number,
  timeZone: string = FACILITY_TIMEZONE
): Date | null {
  const m = ymd.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  const Y = Number(m[1])
  const Mo = Number(m[2])
  const D = Number(m[3])
  if (!Number.isFinite(Y) || !Number.isFinite(Mo) || !Number.isFinite(D)) return null

  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  function read(ms: number) {
    const parts = fmt.formatToParts(new Date(ms))
    const g: Record<string, number> = {}
    for (const p of parts) {
      if (p.type !== 'literal') g[p.type] = Number(p.value)
    }
    return { y: g.year, mo: g.month, d: g.day, h: g.hour, mi: g.minute }
  }

  const anchor = Date.UTC(Y, Mo - 1, D, 12, 0, 0, 0)
  for (let deltaMin = -36 * 60; deltaMin <= 36 * 60; deltaMin += 1) {
    const t = anchor + deltaMin * 60_000
    const got = read(t)
    if (got.y === Y && got.mo === Mo && got.d === D && got.h === hour24 && got.mi === minute) {
      return new Date(t)
    }
  }
  return null
}
