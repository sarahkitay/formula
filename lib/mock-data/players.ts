import type { Player } from '@/types'

/** Populated from Supabase `players` via `/api/facility/players` in admin UI — no fabricated roster. */
export const mockPlayers: Player[] = []

export function getPlayerById(id: string): Player | undefined {
  return mockPlayers.find(p => p.id === id)
}

export function getPlayersByGroup(_groupId: string): Player[] {
  return []
}

export function getPlayersByAgeGroup(_ageGroup: string): Player[] {
  return []
}

export function searchPlayers(query: string, roster: Player[] = mockPlayers): Player[] {
  const q = query.toLowerCase().trim()
  if (!q) return roster
  return roster.filter(
    p =>
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.jerseyNumber?.toString() === q
  )
}
