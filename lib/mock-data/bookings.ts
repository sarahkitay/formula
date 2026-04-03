// TEMPORARY DATA LAYER (V1)
import { Booking } from '@/types'

const TODAY = new Date().toISOString().split('T')[0]

export const mockBookings: Booking[] = [
  // Today · session-2 (in progress, afternoon block)
  { id: 'bk-1', playerId: 'player-6', playerName: 'Liam Chen', sessionId: 'session-2', parentId: 'parent-6', bookedAt: `${TODAY}T14:00:00.000Z`, status: 'confirmed', checkedIn: true, checkedInAt: `${TODAY}T15:42:00.000Z`, paymentStatus: 'session-credit' },
  { id: 'bk-2', playerId: 'player-7', playerName: 'Zoe Williams', sessionId: 'session-2', parentId: 'parent-6', bookedAt: `${TODAY}T14:00:00.000Z`, status: 'confirmed', checkedIn: true, checkedInAt: `${TODAY}T15:44:00.000Z`, paymentStatus: 'session-credit' },
  { id: 'bk-3', playerId: 'player-8', playerName: 'Carlos Reyes', sessionId: 'session-2', parentId: 'parent-7', bookedAt: `${TODAY}T14:30:00.000Z`, status: 'confirmed', checkedIn: false, paymentStatus: 'session-credit' },
  { id: 'bk-4', playerId: 'player-9', playerName: 'Isabelle Park', sessionId: 'session-2', parentId: 'parent-8', bookedAt: `${TODAY}T14:45:00.000Z`, status: 'confirmed', checkedIn: false, paymentStatus: 'session-credit' },

  // Today · session-3
  { id: 'bk-5', playerId: 'player-10', playerName: 'James Okafor', sessionId: 'session-3', parentId: 'parent-9', bookedAt: `${TODAY}T15:00:00.000Z`, status: 'confirmed', checkedIn: false, paymentStatus: 'session-credit' },
  { id: 'bk-6', playerId: 'player-11', playerName: 'Alex Nguyen', sessionId: 'session-3', parentId: 'parent-10', bookedAt: `${TODAY}T15:05:00.000Z`, status: 'confirmed', checkedIn: false, paymentStatus: 'session-credit' },
  { id: 'bk-7', playerId: 'player-12', playerName: 'Taylor Brooks', sessionId: 'session-3', parentId: 'parent-11', bookedAt: `${TODAY}T15:10:00.000Z`, status: 'confirmed', checkedIn: false, paymentStatus: 'session-credit' },

  // Today · session-4
  { id: 'bk-8', playerId: 'player-13', playerName: 'Kai Hernandez', sessionId: 'session-4', parentId: 'parent-12', bookedAt: `${TODAY}T16:00:00.000Z`, status: 'confirmed', checkedIn: false, paymentStatus: 'session-credit' },
  { id: 'bk-9', playerId: 'player-14', playerName: 'Jordan Lee', sessionId: 'session-4', parentId: 'parent-13', bookedAt: `${TODAY}T16:00:00.000Z`, status: 'confirmed', checkedIn: false, paymentStatus: 'session-credit' },
  { id: 'bk-10', playerId: 'player-15', playerName: 'Riley Santos', sessionId: 'session-4', parentId: 'parent-14', bookedAt: `${TODAY}T16:30:00.000Z`, status: 'confirmed', checkedIn: false, paymentStatus: 'session-credit' },

  // Today · session-5
  { id: 'bk-11', playerId: 'player-16', playerName: 'Oliver Davis', sessionId: 'session-5', parentId: 'parent-15', bookedAt: `${TODAY}T17:00:00.000Z`, status: 'confirmed', checkedIn: false, paymentStatus: 'session-credit' },
  { id: 'bk-12', playerId: 'player-17', playerName: 'Ella Moore', sessionId: 'session-5', parentId: 'parent-15', bookedAt: `${TODAY}T17:00:00.000Z`, status: 'confirmed', checkedIn: false, paymentStatus: 'session-credit' },
  { id: 'bk-13', playerId: 'player-18', playerName: 'Lucas Wilson', sessionId: 'session-5', parentId: 'parent-16', bookedAt: `${TODAY}T17:30:00.000Z`, status: 'confirmed', checkedIn: false, paymentStatus: 'session-credit' },

  // Today · session-1 (completed, early block)
  { id: 'bk-14', playerId: 'player-1', playerName: 'Ethan Cross', sessionId: 'session-1', parentId: 'parent-1', bookedAt: `${TODAY}T05:00:00.000Z`, status: 'completed', checkedIn: true, checkedInAt: `${TODAY}T07:08:00.000Z`, paymentStatus: 'session-credit' },
  { id: 'bk-15', playerId: 'player-2', playerName: 'Sofia Martinez', sessionId: 'session-1', parentId: 'parent-2', bookedAt: `${TODAY}T05:00:00.000Z`, status: 'completed', checkedIn: true, checkedInAt: `${TODAY}T07:10:00.000Z`, paymentStatus: 'session-credit' },
  { id: 'bk-16', playerId: 'player-4', playerName: 'Aiden Thompson', sessionId: 'session-1', parentId: 'parent-4', bookedAt: `${TODAY}T05:30:00.000Z`, status: 'completed', checkedIn: true, checkedInAt: `${TODAY}T07:12:00.000Z`, paymentStatus: 'session-credit' },

  // Tomorrow · session-6
  { id: 'bk-17', playerId: 'player-1', playerName: 'Ethan Cross', sessionId: 'session-6', parentId: 'parent-1', bookedAt: `${TODAY}T10:00:00.000Z`, status: 'confirmed', checkedIn: false, paymentStatus: 'session-credit' },
  { id: 'bk-18', playerId: 'player-2', playerName: 'Sofia Martinez', sessionId: 'session-6', parentId: 'parent-2', bookedAt: `${TODAY}T10:00:00.000Z`, status: 'confirmed', checkedIn: false, paymentStatus: 'session-credit' },
]

export function getBookingById(id: string): Booking | undefined {
  return mockBookings.find(b => b.id === id)
}

export function getBookingsBySession(sessionId: string): Booking[] {
  return mockBookings.filter(b => b.sessionId === sessionId)
}

export function getBookingsByPlayer(playerId: string): Booking[] {
  return mockBookings.filter(b => b.playerId === playerId)
}

export function getTodaysBookings(): Booking[] {
  const today = new Date().toISOString().split('T')[0]
  return mockBookings.filter(b => b.bookedAt.startsWith(today) || b.checkedInAt?.startsWith(today))
}

export function getPlayerTodayBooking(playerId: string): Booking | undefined {
  const today = new Date().toISOString().split('T')[0]
  const sessionIds = ['session-1', 'session-2', 'session-3', 'session-4', 'session-5']
  return mockBookings.find(b =>
    b.playerId === playerId &&
    sessionIds.includes(b.sessionId) &&
    b.status !== 'cancelled'
  )
}
