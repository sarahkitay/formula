import type { Session } from '@/types'

/** Legacy export — no fabricated sessions; wire to Supabase sessions when available. */
export const mockSessions: Session[] = []

export function getSessionById(_id: string): Session | undefined {
  return undefined
}

export function getTodaysSessions(): Session[] {
  return []
}

export function getUpcomingSessions(): Session[] {
  return []
}

export function getSessionsByGroup(_groupId: string): Session[] {
  return []
}
