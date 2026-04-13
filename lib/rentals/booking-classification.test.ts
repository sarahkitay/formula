import { describe, expect, it } from 'vitest'
import {
  bookingCanProceed,
  classifyRentalBooking,
  insuranceMayBeRequired,
} from '@/lib/rentals/booking-classification'

describe('classifyRentalBooking', () => {
  describe('private_semi_private', () => {
    it('tier1 for 1–4 participants', () => {
      for (const n of [1, 2, 3, 4]) {
        const c = classifyRentalBooking('private_semi_private', n)
        expect(c.status).toBe('private_tier1')
        if (c.status === 'private_tier1') expect(c.participantCount).toBe(n)
      }
    })

    it('group training for 5–20', () => {
      const c = classifyRentalBooking('private_semi_private', 5)
      expect(c.status).toBe('group_training_ok')
      const c20 = classifyRentalBooking('private_semi_private', 20)
      expect(c20.status).toBe('group_training_ok')
    })

    it('blocks above 20', () => {
      const c = classifyRentalBooking('private_semi_private', 21)
      expect(c.status).toBe('blocked')
    })
  })

  describe('club_team_practice', () => {
    it('allows up to 20', () => {
      expect(classifyRentalBooking('club_team_practice', 20).status).toBe('club_ok')
    })

    it('blocks above 20', () => {
      expect(classifyRentalBooking('club_team_practice', 21).status).toBe('blocked')
    })
  })

  describe('general_pickup', () => {
    it('allows up to 15', () => {
      expect(classifyRentalBooking('general_pickup', 15).status).toBe('general_ok')
    })

    it('blocks above 15', () => {
      expect(classifyRentalBooking('general_pickup', 16).status).toBe('blocked')
    })
  })

  it('blocks invalid counts', () => {
    expect(classifyRentalBooking('club_team_practice', 0).status).toBe('blocked')
    expect(classifyRentalBooking('club_team_practice', -1).status).toBe('blocked')
    expect(classifyRentalBooking('club_team_practice', NaN).status).toBe('blocked')
  })

  it('floors fractional participants', () => {
    const c = classifyRentalBooking('private_semi_private', 4.9)
    expect(c.status).toBe('private_tier1')
    if (c.status === 'private_tier1') expect(c.participantCount).toBe(4)
  })
})

describe('insuranceMayBeRequired', () => {
  it('true for club_ok and group_training_ok cases', () => {
    const club = classifyRentalBooking('club_team_practice', 10)
    expect(insuranceMayBeRequired('club_team_practice', club)).toBe(true)

    const group = classifyRentalBooking('private_semi_private', 10)
    expect(insuranceMayBeRequired('private_semi_private', group)).toBe(true)
  })

  it('false for blocked and small private', () => {
    const blocked = classifyRentalBooking('general_pickup', 99)
    expect(insuranceMayBeRequired('general_pickup', blocked)).toBe(false)

    const small = classifyRentalBooking('private_semi_private', 2)
    expect(insuranceMayBeRequired('private_semi_private', small)).toBe(false)
  })
})

describe('bookingCanProceed', () => {
  it('false only when blocked', () => {
    expect(bookingCanProceed(classifyRentalBooking('general_pickup', 5))).toBe(true)
    expect(bookingCanProceed(classifyRentalBooking('general_pickup', 20))).toBe(false)
  })
})
