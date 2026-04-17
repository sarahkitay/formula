import { describe, expect, it } from 'vitest'
import {
  ASSESSMENT_JUNE_PREBOOK_MONTH,
  ASSESSMENT_JUNE_PREBOOK_YEAR,
  assessmentSlotIdForStartsAtIso,
  buildJunePrebookSlotSpecs,
  isJunePrebookSlotId,
} from '@/lib/assessment/june-2026-slots'

describe('assessmentSlotIdForStartsAtIso', () => {
  it('is stable for the same instant', () => {
    const iso = '2026-06-02T15:00:00.000Z'
    expect(assessmentSlotIdForStartsAtIso(iso)).toBe(assessmentSlotIdForStartsAtIso(iso))
  })

  it('differs for different instants', () => {
    expect(assessmentSlotIdForStartsAtIso('2026-06-02T15:00:00.000Z')).not.toBe(
      assessmentSlotIdForStartsAtIso('2026-06-02T16:00:00.000Z')
    )
  })
})

describe('buildJunePrebookSlotSpecs', () => {
  it('produces weekday hourly June slots with capacity 4', () => {
    const rows = buildJunePrebookSlotSpecs(ASSESSMENT_JUNE_PREBOOK_YEAR, ASSESSMENT_JUNE_PREBOOK_MONTH)
    expect(rows.length).toBeGreaterThan(80)
    expect(rows.every(r => r.capacity === 4)).toBe(true)
    expect(new Set(rows.map(r => r.id)).size).toBe(rows.length)
    expect(rows.every(r => isJunePrebookSlotId(r.id))).toBe(true)
  })
})
