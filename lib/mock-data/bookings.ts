import type { Booking } from '@/types'

export const mockBookings: Booking[] = []

export function getBookingById(_id: string): Booking | undefined {
  return undefined
}

export function getBookingsBySession(_sessionId: string): Booking[] {
  return []
}

export function getPlayerTodayBooking(_playerId: string): Booking | undefined {
  return undefined
}
