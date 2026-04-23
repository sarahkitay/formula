import { FACILITY_TIMEZONE } from '@/lib/facility/facility-day'

/** Short date + time in the facility IANA zone (matches ops expectations; avoids UTC server default). */
export function formatFacilityDateTimeShort(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return String(iso)
    return new Intl.DateTimeFormat('en-US', {
      timeZone: FACILITY_TIMEZONE,
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(d)
  } catch {
    return String(iso)
  }
}
