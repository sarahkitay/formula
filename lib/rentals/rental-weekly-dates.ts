/** Same weekday/time, N weeks apart, starting from anchor `YYYY-MM-DD` (local noon math). `weekCount` 0 returns []. */
export function weeklyOccurrenceDatesIso(anchorYmd: string, weekCount: number): string[] {
  const n = Math.min(52, Math.max(0, Math.floor(weekCount)))
  if (n <= 0) return []
  const dates: string[] = []
  for (let i = 0; i < n; i++) {
    const d = new Date(`${anchorYmd}T12:00:00`)
    d.setDate(d.getDate() + i * 7)
    const y = d.getFullYear()
    const mo = String(d.getMonth() + 1).padStart(2, '0')
    const da = String(d.getDate()).padStart(2, '0')
    dates.push(`${y}-${mo}-${da}`)
  }
  return dates
}

const YMD_RE = /^\d{4}-\d{2}-\d{2}$/

/** All valid weekly anchors from `anchorYmd` for Stripe / server checks (up to 52 occurrences). */
export function allowedWeeklyAnchorsFrom(anchorYmd: string): Set<string> {
  return new Set(weeklyOccurrenceDatesIso(anchorYmd, 52))
}

/**
 * Compact session dates for Stripe metadata (≤416 chars for 52 × YYYYMMDD).
 * Server must re-validate against `allowedWeeklyAnchorsFrom(anchor)` before trusting.
 */
export function encodeRentalDatesCompact(datesIso: string[]): string {
  const seen = new Set<string>()
  const compactParts: string[] = []
  for (const raw of datesIso) {
    const d = raw.trim()
    if (!YMD_RE.test(d)) continue
    if (seen.has(d)) continue
    seen.add(d)
    compactParts.push(d.replace(/-/g, ''))
  }
  compactParts.sort()
  return compactParts.join('')
}

/** Inverse of {@link encodeRentalDatesCompact}; returns [] if malformed. */
export function decodeRentalDatesCompact(compact: string): string[] {
  const c = compact.replace(/\D/g, '')
  if (c.length === 0 || c.length % 8 !== 0 || c.length > 52 * 8) return []
  const out: string[] = []
  for (let i = 0; i < c.length; i += 8) {
    const y = c.slice(i, i + 4)
    const mo = c.slice(i + 4, i + 6)
    const da = c.slice(i + 6, i + 8)
    const iso = `${y}-${mo}-${da}`
    if (!YMD_RE.test(iso)) return []
    const t = new Date(`${iso}T12:00:00`)
    if (Number.isNaN(t.getTime())) return []
    out.push(iso)
  }
  return out
}

/**
 * Resolve which session dates to charge/hold: explicit `rental_dates_compact` (client UI)
 * or consecutive weeks from `rental_weeks` + anchor. All explicit dates must lie on the same
 * weekly series as `anchorYmd` (within 52 steps).
 */
export function resolveFieldRentalSessionDatesFromMetadata(
  metadata: Record<string, string>,
  anchorYmd: string
): { ok: true; dates: string[] } | { ok: false; message: string } {
  const allowed = allowedWeeklyAnchorsFrom(anchorYmd)
  const compact = metadata.rental_dates_compact?.trim()
  if (compact) {
    const decoded = decodeRentalDatesCompact(compact)
    if (decoded.length === 0) {
      return { ok: false, message: 'Invalid or empty rental_dates_compact.' }
    }
    if (decoded.length > 52) {
      return { ok: false, message: 'Too many rental session dates (max 52).' }
    }
    for (const d of decoded) {
      if (!allowed.has(d)) {
        return {
          ok: false,
          message:
            'Each selected session must be the same weekday and time window as your anchor date, within 52 weeks of that weekly series.',
        }
      }
    }
    return { ok: true, dates: [...new Set(decoded)].sort() }
  }
  const rw = parseInt(metadata.rental_weeks ?? '1', 10)
  const weekCount = Number.isFinite(rw) ? Math.min(52, Math.max(1, Math.floor(rw))) : 1
  const dates = weeklyOccurrenceDatesIso(anchorYmd, weekCount)
  return { ok: true, dates }
}
