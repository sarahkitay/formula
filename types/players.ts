/** `public.players`: base row; optional relation embeds when selected via Supabase join */
export type PlayerRow = {
  id: string
  first_name: string | null
  last_name: string | null
  age_group: string | null
  created_at?: string | null
  player_programs?: { status: string; programs: { name: string | null }[] | null }[] | null
  assessments?: {
    id?: string
    summary: string | null
    completed_at: string | null
    pillar_scores?: unknown
  }[] | null
}

/** `public.parent_players` row with embedded player (Supabase FK embed). */
export type ParentPlayerLinkRow = {
  id: string
  parent_user_id?: string
  player_id?: string
  players: PlayerRow | PlayerRow[] | null
}
