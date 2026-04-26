import { describe, expect, it } from 'vitest'
import { normalizeFacilityScheduleConfig, publishedCycleFieldsLosAngeles } from '@/lib/schedule/facility-schedule-config'

describe('publishedCycleFieldsLosAngeles', () => {
  it('uses LA calendar quarter and next quarter start (Apr 2026)', () => {
    const fixed = new Date('2026-04-15T20:00:00Z')
    const p = publishedCycleFieldsLosAngeles(fixed)
    expect(p.currentCycleLabel).toBe('2026-Q2-A')
    expect(p.nextCycleStartDisplay).toBe('Jul 01, 2026')
    expect(p.weekInCycle).toBe(3)
  })

  it('normalize merges LA defaults when payload empty', () => {
    const c = normalizeFacilityScheduleConfig({})
    expect(c.currentCycleLabel).toMatch(/^\d{4}-Q[1-4]-A$/)
    expect(c.nextCycleStartDisplay).toMatch(/^[A-Z][a-z]{2} \d{2}, \d{4}$/)
  })
})
