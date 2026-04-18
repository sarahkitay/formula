import { supabase } from '@/lib/supabase'
import type { CoachNoteRow } from '@/types/coach-note'

export async function fetchCoachNotesForPlayer(
  playerId: string
): Promise<{ data: CoachNoteRow[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('coach_notes')
    .select('id, player_id, coach_user_id, body, created_at')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: new Error(error.message) }
  return { data: (data ?? []) as CoachNoteRow[], error: null }
}

/** One row per note in roster; caller aggregates counts by player_id. */
export async function fetchCoachNotesForPlayers(
  playerIds: string[]
): Promise<{ data: Pick<CoachNoteRow, 'id' | 'player_id'>[] | null; error: Error | null }> {
  if (playerIds.length === 0) return { data: [], error: null }
  const { data, error } = await supabase
    .from('coach_notes')
    .select('id, player_id')
    .in('player_id', playerIds)

  if (error) return { data: null, error: new Error(error.message) }
  return { data: (data ?? []) as Pick<CoachNoteRow, 'id' | 'player_id'>[], error: null }
}

export async function insertCoachNote(
  playerId: string,
  body: string
): Promise<{ data: CoachNoteRow | null; error: Error | null }> {
  const { data: auth } = await supabase.auth.getUser()
  const uid = auth.user?.id
  if (!uid) return { data: null, error: new Error('Not signed in') }

  const { data, error } = await supabase
    .from('coach_notes')
    .insert({
      player_id: playerId,
      coach_user_id: uid,
      body: body.trim(),
    })
    .select('id, player_id, coach_user_id, body, created_at')
    .single()

  if (error) return { data: null, error: new Error(error.message) }
  return { data: data as CoachNoteRow, error: null }
}
