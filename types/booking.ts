export type BookingStatus = 'confirmed' | 'cancelled' | 'waitlisted' | 'completed'
export type BookingPaymentStatus = 'paid' | 'pending' | 'session-credit'

export interface Booking {
  id: string
  playerId: string
  playerName: string
  sessionId: string
  parentId?: string
  bookedAt: string
  status: BookingStatus
  checkedIn: boolean
  checkedInAt?: string
  paymentStatus: BookingPaymentStatus
}
