export type CheckInMethod = 'manual' | 'wristband' | 'qr'

export interface CheckIn {
  id: string
  playerId: string
  playerName: string
  sessionId: string
  sessionTitle: string
  bookingId?: string
  checkedInAt: string
  checkedInBy: string   // admin user ID or name
  method: CheckInMethod
  // INTEGRATION NOTE: When wristband scanner is connected, method will be 'wristband'
  // and the checkedInBy will reference the scanner device ID
  notes?: string
}
