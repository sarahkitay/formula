/** Embedded relations for staff portal roster + parent portal (same shape). */
export const STAFF_ROSTER_SELECT = `
  id,
  first_name,
  last_name,
  age_group,
  created_at,
  player_programs (
    status,
    programs (
      name
    )
  ),
  assessments (
    id,
    summary,
    completed_at,
    pillar_scores
  )
` as const

/** When `assessments.pillar_scores` is not migrated yet. */
export const STAFF_ROSTER_SELECT_LEGACY = `
  id,
  first_name,
  last_name,
  age_group,
  created_at,
  player_programs (
    status,
    programs (
      name
    )
  ),
  assessments (
    id,
    summary,
    completed_at
  )
` as const
