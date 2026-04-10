/**
 * Canonical public marketing language and tone for Formula Soccer Center.
 * Prefer importing from here for homepage and program-framing copy; keep ops-specific pages flexible.
 */
export const SITE_VOICE = {
  /**
   * Homepage hero lead: facility positioning (no fabricated metrics or credentials).
   */
  homeParentOneLiner:
    'Formula Soccer Center is an elite soccer development facility in Van Nuys, built for players of all ages and skill levels, from recreational players to aspiring professionals. We use cutting-edge technology and structured programming, measuring where your player is today and building a clear path to where they need to be.',

  /** Primary lines under the FORMULA wordmark (rendered with line breaks in the hero). */
  heroHeadlineLines: ['Elite training.', 'Real data.', 'Built for every player.'] as const,

  /** Facility intro / first homepage band (right column). */
  trainingCenterPrograms:
    "Formula isn't a gym you drop into and hope for the best. It's a full soccer development system: advanced training technology, structured sessions, and real performance data, all under one roof.",

  trainingCenterFollowOn:
    'Every athlete who walks in gets assessed, placed in the right program, and trained against a measurable standard. Progress is tracked. Families can see it. Coaches can act on it.',

  trainingCenterClosing:
    "Whether your kid plays for a competitive club or just loves the game, there's a lane here for them.",

  whoWeTrain:
    'Built for club athletes sharpening beside their team schedule, families tired of chaotic open gyms, and competitors who expect pro floor ops, on-time sessions, and honest feedback.',

  partners:
    'Clubs, schools, and academies tap our coaching standard and floor ops when they need real capacity, not a rental block with a logo.',

  /** Training / program catalog context (Membership page, FPI training block if used). */
  programDesign:
    'We run published blocks, not drop-in chaos: technical lanes, application zones, and clear ratios so every session targets a limiter (technique, decisions, speed, or transfer). Same bar from youth development through adult leagues and elite small-group work.',

  programInventoryLine:
    'Youth development and leagues · Adult leagues · Elite and small-group technical · Fitness conditioning',

  whatWeBuildLine:
    'Possession, distribution, and control under pressure: the on-ball habits we train at every level.',
} as const
