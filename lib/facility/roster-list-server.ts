import { getServiceSupabase } from '@/lib/supabase/service'
import { mapDbPlayerRowToPlayer } from '@/lib/facility/map-db-player'
import type { Player } from '@/types'

/** Full roster slice for admin lists (same shape as `/api/facility/players`). */
export async function listFacilityPlayers(limit = 500): Promise<Player[]> {
  const sb = getServiceSupabase()
  if (!sb) return []

  const { data, error } = await sb
    .from('players')
    .select('id, first_name, last_name, age_group, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data?.length) return []

  return data.map(row =>
    mapDbPlayerRowToPlayer({
      id: row.id as string,
      first_name: row.first_name as string | null,
      last_name: row.last_name as string | null,
      age_group: row.age_group as string | null,
      created_at: row.created_at as string | null,
    })
  )
}
