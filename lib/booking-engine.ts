/**
 * Check-in credit gate — extend with POST /api/check-in + server rules when billing is live.
 */
export function canDecrementSession(_playerId: string): { ok: boolean; reason?: string } {
  return { ok: true }
}

export function decrementSession(playerId: string): { ok: boolean; reason?: string } {
  if (!playerId.trim()) return { ok: false, reason: 'No athlete selected' }
  return { ok: true }
}
