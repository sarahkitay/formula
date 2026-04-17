import type { CheckIn } from '@/types'

export const mockCheckIns: CheckIn[] = []

export function getCheckInsBySession(_sessionId: string): CheckIn[] {
  return []
}

export function getTodaysCheckIns(): CheckIn[] {
  return []
}

export function getCheckInsByPlayer(_playerId: string): CheckIn[] {
  return []
}

export function isPlayerCheckedInToday(_playerId: string): boolean {
  return false
}
