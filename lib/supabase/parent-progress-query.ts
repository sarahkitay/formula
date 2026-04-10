/** Embedded player + assessments for parent progress (RLS: linked parent only). */
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
