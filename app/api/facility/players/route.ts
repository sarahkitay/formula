import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase/service'
import { mapDbPlayerRowToPlayer } from '@/lib/facility/map-db-player'

export const runtime = 'nodejs'

/**
 * Facility roster from `players` (service role). Used by admin check-in / players when Supabase is configured.
 */
export async function GET() {
  const sb = getServiceSupabase()
  if (!sb) {
    return NextResponse.json({ players: [], configured: false })
  }

  const { data, error } = await sb
    .from('players')
    .select('id, first_name, last_name, age_group, created_at')
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) {
    console.warn('[facility/players]', error.message)
    return NextResponse.json({ players: [], configured: true, error: error.message })
  }

  const players = (data ?? []).map(row =>
    mapDbPlayerRowToPlayer({
      id: row.id as string,
      first_name: row.first_name as string | null,
      last_name: row.last_name as string | null,
      age_group: row.age_group as string | null,
      created_at: row.created_at as string | null,
    })
  )

  return NextResponse.json({ players, configured: true })
}
