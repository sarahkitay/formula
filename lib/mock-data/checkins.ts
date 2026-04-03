// TEMPORARY DATA LAYER (V1)
// INTEGRATION NOTE: When wristband scanner is active, new check-ins will arrive via
// POST /api/checkins with { wristbandId, sessionId } and method: 'wristband'
import { CheckIn } from '@/types'

const TODAY = new Date().toISOString().split('T')[0]

function daysAgo(n: number, time: string): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return `${d.toISOString().split('T')[0]}T${time}Z`
}

export const mockCheckIns: CheckIn[] = [
  // Today · completed session-1
  { id: 'ci-1', playerId: 'player-1', playerName: 'Ethan Cross', sessionId: 'session-1', sessionTitle: 'Elite U14 · Technical block', bookingId: 'bk-14', checkedInAt: `${TODAY}T07:08:00.000Z`, checkedInBy: 'Front Desk', method: 'manual' },
  { id: 'ci-2', playerId: 'player-2', playerName: 'Sofia Martinez', sessionId: 'session-1', sessionTitle: 'Elite U14 · Technical block', bookingId: 'bk-15', checkedInAt: `${TODAY}T07:10:00.000Z`, checkedInBy: 'Front Desk', method: 'manual' },
  { id: 'ci-3', playerId: 'player-4', playerName: 'Aiden Thompson', sessionId: 'session-1', sessionTitle: 'Elite U14 · Technical block', bookingId: 'bk-16', checkedInAt: `${TODAY}T07:12:00.000Z`, checkedInBy: 'Front Desk', method: 'manual' },

  // Today · in-progress session-2
  { id: 'ci-4', playerId: 'player-6', playerName: 'Liam Chen', sessionId: 'session-2', sessionTitle: 'Development U12 · Four-coach block', bookingId: 'bk-1', checkedInAt: `${TODAY}T15:42:00.000Z`, checkedInBy: 'Front Desk', method: 'manual' },
  { id: 'ci-5', playerId: 'player-7', playerName: 'Zoe Williams', sessionId: 'session-2', sessionTitle: 'Development U12 · Four-coach block', bookingId: 'bk-2', checkedInAt: `${TODAY}T15:44:00.000Z`, checkedInBy: 'Front Desk', method: 'manual' },

  // Yesterday
  { id: 'ci-6', playerId: 'player-1', playerName: 'Ethan Cross', sessionId: 'session-10', sessionTitle: 'Elite U14 · Technical block', checkedInAt: daysAgo(1, '07:10:00'), checkedInBy: 'Front Desk', method: 'manual' },
  { id: 'ci-7', playerId: 'player-2', playerName: 'Sofia Martinez', sessionId: 'session-10', sessionTitle: 'Elite U14 · Technical block', checkedInAt: daysAgo(1, '07:12:00'), checkedInBy: 'Front Desk', method: 'manual' },
  { id: 'ci-8', playerId: 'player-3', playerName: 'Noah Patel', sessionId: 'session-10', sessionTitle: 'Elite U14 · Technical block', checkedInAt: daysAgo(1, '07:14:00'), checkedInBy: 'Front Desk', method: 'manual' },
  { id: 'ci-9', playerId: 'player-13', playerName: 'Kai Hernandez', sessionId: 'session-10', sessionTitle: 'Elite U14 · Technical block', checkedInAt: daysAgo(1, '07:16:00'), checkedInBy: 'Front Desk', method: 'manual' },
]

export function getCheckInsBySession(sessionId: string): CheckIn[] {
  return mockCheckIns.filter(c => c.sessionId === sessionId)
}

export function getTodaysCheckIns(): CheckIn[] {
  const today = new Date().toISOString().split('T')[0]
  return mockCheckIns.filter(c => c.checkedInAt.startsWith(today))
}

export function getCheckInsByPlayer(playerId: string): CheckIn[] {
  return mockCheckIns.filter(c => c.playerId === playerId)
}

export function isPlayerCheckedInToday(playerId: string): boolean {
  return getTodaysCheckIns().some(c => c.playerId === playerId)
}
