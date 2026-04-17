import { describe, expect, it } from 'vitest'
import {
  decodeRentalDatesCompact,
  encodeRentalDatesCompact,
  resolveFieldRentalSessionDatesFromMetadata,
  weeklyOccurrenceDatesIso,
} from '@/lib/rentals/rental-weekly-dates'

describe('weeklyOccurrenceDatesIso', () => {
  it('returns [] for zero week count', () => {
    expect(weeklyOccurrenceDatesIso('2026-03-02', 0)).toEqual([])
  })

  it('returns consecutive same-weekday dates', () => {
    expect(weeklyOccurrenceDatesIso('2026-03-02', 3)).toEqual(['2026-03-02', '2026-03-09', '2026-03-16'])
  })
})

describe('encodeRentalDatesCompact / decodeRentalDatesCompact', () => {
  it('round-trips and sorts', () => {
    const iso = ['2026-03-16', '2026-03-02', '2026-03-09']
    const enc = encodeRentalDatesCompact(iso)
    expect(enc).toBe('202603022026030920260316')
    expect(decodeRentalDatesCompact(enc)).toEqual(['2026-03-02', '2026-03-09', '2026-03-16'])
  })

  it('dedupes on encode', () => {
    const enc = encodeRentalDatesCompact(['2026-03-02', '2026-03-02'])
    expect(enc).toBe('20260302')
  })

  it('returns [] for malformed compact', () => {
    expect(decodeRentalDatesCompact('2026030')).toEqual([])
  })
})

describe('resolveFieldRentalSessionDatesFromMetadata', () => {
  it('uses compact when valid for anchor series', () => {
    const r = resolveFieldRentalSessionDatesFromMetadata(
      { rental_dates_compact: encodeRentalDatesCompact(['2026-03-02', '2026-03-16']) },
      '2026-03-02'
    )
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.dates).toEqual(['2026-03-02', '2026-03-16'])
  })

  it('rejects dates off the weekly series', () => {
    const r = resolveFieldRentalSessionDatesFromMetadata(
      { rental_dates_compact: encodeRentalDatesCompact(['2026-03-03']) },
      '2026-03-02'
    )
    expect(r.ok).toBe(false)
  })

  it('falls back to rental_weeks when no compact', () => {
    const r = resolveFieldRentalSessionDatesFromMetadata({ rental_weeks: '3' }, '2026-03-02')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.dates).toEqual(['2026-03-02', '2026-03-09', '2026-03-16'])
  })
})
