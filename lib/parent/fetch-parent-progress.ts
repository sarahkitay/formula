import type { PostgrestResponse, PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js'
import {
  PARENT_PROGRESS_PLAYER_SELECT,
  PARENT_PROGRESS_PLAYER_SELECT_LEGACY,
} from '@/lib/supabase/parent-progress-query'

function isMissingPillarScoresColumn(message: string | undefined): boolean {
  if (!message) return false
  const m = message.toLowerCase()
  return m.includes('pillar_scores') && (m.includes('does not exist') || m.includes('unknown'))
}

type ParentPlayersListRow = { player_id: string | null; players: unknown }

type ParentPlayerSingleRow = { players: unknown }

/** Load linked players + assessments; retry without `pillar_scores` if the column is not migrated yet. */
export async function fetchParentProgressParentPlayers(
  supabase: SupabaseClient,
  parentUserId: string
): Promise<PostgrestResponse<ParentPlayersListRow>> {
  const selectFull = `player_id, players ( ${PARENT_PROGRESS_PLAYER_SELECT} )`
  const selectLegacy = `player_id, players ( ${PARENT_PROGRESS_PLAYER_SELECT_LEGACY} )`

  const first = (await supabase
    .from('parent_players')
    .select(selectFull)
    .eq('parent_user_id', parentUserId)) as PostgrestResponse<ParentPlayersListRow>

  if (first.error && isMissingPillarScoresColumn(first.error.message)) {
    return (await supabase
      .from('parent_players')
      .select(selectLegacy)
      .eq('parent_user_id', parentUserId)) as PostgrestResponse<ParentPlayersListRow>
  }

  return first
}

/** Single linked player row for detail page. */
export async function fetchParentProgressSinglePlayer(
  supabase: SupabaseClient,
  parentUserId: string,
  playerId: string
): Promise<PostgrestSingleResponse<ParentPlayerSingleRow | null>> {
  const selectFull = `players ( ${PARENT_PROGRESS_PLAYER_SELECT} )`
  const selectLegacy = `players ( ${PARENT_PROGRESS_PLAYER_SELECT_LEGACY} )`

  const first = (await supabase
    .from('parent_players')
    .select(selectFull)
    .eq('parent_user_id', parentUserId)
    .eq('player_id', playerId)
    .maybeSingle()) as PostgrestSingleResponse<ParentPlayerSingleRow | null>

  if (first.error && isMissingPillarScoresColumn(first.error.message)) {
    return (await supabase
      .from('parent_players')
      .select(selectLegacy)
      .eq('parent_user_id', parentUserId)
      .eq('player_id', playerId)
      .maybeSingle()) as PostgrestSingleResponse<ParentPlayerSingleRow | null>
  }

  return first
}
