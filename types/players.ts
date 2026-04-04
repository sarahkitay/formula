/** `public.players` */
export type PlayerRow = {
  id: string
  first_name: string | null
  last_name: string | null
  age_group: string | null
  created_at?: string | null
}

/** `public.parent_players` row with embedded player (Supabase FK embed). */
export type ParentPlayerLinkRow = {
  id: string
  parent_user_id?: string
  player_id?: string
  players: PlayerRow | PlayerRow[] | null
}
