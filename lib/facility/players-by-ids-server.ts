import { getServiceSupabase } from '@/lib/supabase/service'
import { mapDbPlayerRowToPlayer } from '@/lib/facility/map-db-player'
import type { Player } from '@/types'

/** Load roster rows for coach session / ops views when IDs are known. */
export async function getPlayersByIds(ids: string[]): Promise<Player[]> {
  const uniq = [...new Set(ids.filter(Boolean))].slice(0, 200)
  if (uniq.length === 0) return []

  const sb = getServiceSupabase()
  if (!sb) return []

  const { data, error } = await sb
    .from('players')
    .select('id, first_name, last_name, age_group, created_at')
    .in('id', uniq)

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
