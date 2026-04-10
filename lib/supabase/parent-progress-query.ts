/** Embedded player + assessments for parent progress (RLS: linked parent only). */

/** Use when `assessments.pillar_scores` exists (run `supabase/assessments_pillar_scores.sql` or fresh `assessments.sql`). */
export const PARENT_PROGRESS_PLAYER_SELECT = `
  id,
  first_name,
  last_name,
  age_group,
  assessments (
    id,
    summary,
    completed_at,
    pillar_scores
  )
` as const

/** Same shape without `pillar_scores` — avoids PostgREST errors on older databases until migrated. */
export const PARENT_PROGRESS_PLAYER_SELECT_LEGACY = `
  id,
  first_name,
  last_name,
  age_group,
  assessments (
    id,
    summary,
    completed_at
  )
` as const
