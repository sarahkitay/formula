import type { AgeGroup, Player, PlayerPosition, PlayerStatus } from '@/types/player'

const AGE_GROUPS: AgeGroup[] = ['U6', 'U8', 'U10', 'U12', 'U14', 'U16', 'U18', 'Adult']

function toAgeGroup(raw: string | null | undefined): AgeGroup {
  const t = (raw ?? '').trim() as AgeGroup
  return AGE_GROUPS.includes(t) ? t : 'U12'
}

/** Map Supabase `players` row (staff roster shape) to app `Player` for admin UI. */
export function mapDbPlayerRowToPlayer(row: {
  id: string
  first_name: string | null
  last_name: string | null
  age_group: string | null
  created_at?: string | null
}): Player {
  const first = row.first_name?.trim() || 'Athlete'
  const last = row.last_name?.trim() || ''
  return {
    id: row.id,
    firstName: first,
    lastName: last,
    dateOfBirth: '2000-01-01',
    ageGroup: toAgeGroup(row.age_group),
    position: 'MID' as PlayerPosition,
    jerseyNumber: undefined,
    membershipId: null,
    sessionsRemaining: 0,
    totalSessionsAttended: 0,
    parentIds: [],
    groupIds: [],
    joinedAt: row.created_at ?? new Date().toISOString(),
    status: 'active' as PlayerStatus,
  }
}
