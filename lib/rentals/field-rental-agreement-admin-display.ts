import { RENTAL_FIELD_LEGACY_LABELS, RENTAL_FIELD_OPTIONS } from '@/lib/rentals/field-rental-picker-constants'
import { decodeRentalDatesCompact } from '@/lib/rentals/rental-weekly-dates'
import { humanRentalWindowSummary } from '@/lib/rentals/rental-time-window'
import type { FieldRentalAgreementRow } from '@/lib/rentals/field-rental-agreements-server'

export function rentalFieldLabel(fieldId: string | null | undefined): string {
  if (!fieldId) return '—'
  const hit = RENTAL_FIELD_OPTIONS.find(f => f.value === fieldId)
  if (hit) return hit.label
  const legacy = RENTAL_FIELD_LEGACY_LABELS[fieldId]
  if (legacy) return legacy
  return fieldId
}

export function formatCheckoutAmount(cents: number | null | undefined, currency: string | null | undefined): string {
  if (cents == null) return '—'
  const code = (currency ?? 'usd').toUpperCase()
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(cents / 100)
  } catch {
    return `${(cents / 100).toFixed(2)} ${code}`
  }
}

type BookingPick = Pick<
  FieldRentalAgreementRow,
  | 'booking_rental_field'
  | 'booking_rental_window'
  | 'booking_rental_date'
  | 'booking_rental_dates_compact'
  | 'booking_session_weeks'
  | 'booking_headcount_at_checkout'
>

/** One-line summary for admin tables (field, time window, session dates, checkout headcount). */
export function formatFieldRentalBookingSummaryLine(a: BookingPick): string {
  const field = rentalFieldLabel(a.booking_rental_field)
  const windowHuman = a.booking_rental_window ? humanRentalWindowSummary(a.booking_rental_window) : ''
  let dates = '—'
  if (a.booking_rental_dates_compact) {
    const decoded = decodeRentalDatesCompact(a.booking_rental_dates_compact)
    if (decoded.length >= 2) {
      dates = `${decoded[0]} → ${decoded[decoded.length - 1]} (${decoded.length} sessions)`
    } else if (decoded.length === 1) {
      dates = decoded[0]
    }
  } else if (a.booking_rental_date) {
    dates =
      a.booking_session_weeks != null && a.booking_session_weeks > 1
        ? `${a.booking_rental_date} × ${a.booking_session_weeks} wk`
        : a.booking_rental_date
  }
  const hc =
    a.booking_headcount_at_checkout != null ? `${a.booking_headcount_at_checkout} at checkout` : ''
  const parts = [field !== '—' ? field : '', windowHuman, dates !== '—' ? dates : '', hc].filter(Boolean)
  return parts.length > 0 ? parts.join(' · ') : '—'
}

/** Session summary for a roster invite row (uses expected headcount as roster size). */
export function formatRosterInviteBookingSummary(inv: {
  booking_rental_field?: string | null
  booking_rental_window?: string | null
  booking_rental_date?: string | null
  booking_rental_dates_compact?: string | null
  booking_session_weeks?: number | null
  expected_waiver_count: number
}): string {
  return formatFieldRentalBookingSummaryLine({
    booking_rental_field: inv.booking_rental_field ?? null,
    booking_rental_window: inv.booking_rental_window ?? null,
    booking_rental_date: inv.booking_rental_date ?? null,
    booking_rental_dates_compact: inv.booking_rental_dates_compact ?? null,
    booking_session_weeks: inv.booking_session_weeks ?? null,
    booking_headcount_at_checkout: inv.expected_waiver_count,
  })
}
