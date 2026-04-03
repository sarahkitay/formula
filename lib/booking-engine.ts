/**
 * Central check-in / credit logic (V1 stub).
 * Replace with POST /api/check-in + server-side decrement when live.
 */
import { getPlayerById } from '@/lib/mock-data/players'
import { getMembershipByPlayer } from '@/lib/mock-data/memberships'

export function canDecrementSession(playerId: string): { ok: boolean; reason?: string } {
  const player = getPlayerById(playerId)
  if (!player) return { ok: false, reason: 'Athlete not found' }
  const membership = getMembershipByPlayer(playerId)
  if (!membership) return { ok: false, reason: 'No active membership' }
  if (player.sessionsRemaining <= 0) return { ok: false, reason: 'No session credits' }
  return { ok: true }
}

/** UI contract: call before mutating local optimistic state or API. */
export function decrementSession(playerId: string): { ok: boolean; reason?: string } {
  return canDecrementSession(playerId)
}
