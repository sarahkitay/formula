import { describe, expect, it } from 'vitest'
import {
  addDaysToYmd,
  holidaysBetweenYmdInclusive,
  holidaysDueForLeadReminder,
  observedYmdForFixedDate,
} from '@/lib/schedule/us-major-holidays'

describe('us-major-holidays', () => {
  it('observes Saturday Jan 1 on prior Friday (Dec 31)', () => {
    expect(observedYmdForFixedDate(2022, 1, 1)).toBe('2021-12-31')
  })

  it('includes New Year spill in late-December week', () => {
    const h = holidaysBetweenYmdInclusive('2021-12-26', '2022-01-02')
    expect(h['2021-12-31'] ?? '').toMatch(/New Year/)
  })

  it('fires 30-day reminder on correct calendar day', () => {
    const christmas = '2026-12-25'
    const reminder = addDaysToYmd(christmas, -30)
    const due = holidaysDueForLeadReminder(reminder, 30)
    expect(due.some(d => d.id === 'christmas')).toBe(true)
  })
})
