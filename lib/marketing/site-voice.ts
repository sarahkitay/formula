/**
 * Canonical public marketing language and tone for Formula Soccer Center.
 * Prefer importing from here for homepage and program-framing copy; keep ops-specific pages flexible.
 */
export const SITE_VOICE = {
  /** Primary hero line under the wordmark — specific, operational, not generic motivation. */
  heroHeadline: 'Assess. Lock your lane. Train the standard.',

  /** Tight protocol fragments (replaces bullet pillars in hero). */
  heroProtocolLine: 'Structured · Measured · Premium · Disciplined',

  heroAudienceLine: 'Every level welcome — youth to adult, rec to elite',

  /** Facility / homepage — operational, not SEO boilerplate. */
  trainingCenterPrograms:
    'A performance building, not a rental hall. Match-grade turf lanes, station-based training, linear speed capture, a cognitive decision layer, and controlled application zones — every session has a job.',

  whoWeTrain:
    'Built for club athletes sharpening beside their team schedule, families tired of chaotic open gyms, and competitors who expect pro floor ops, on-time sessions, and honest feedback.',

  partners:
    'Clubs, schools, and academies tap our coaching standard and floor ops when they need real capacity — not a rental block with a logo.',

  /** Homepage Training column — operational, not generic curriculum speak. */
  programDesign:
    'We run published blocks, not drop-in chaos: technical lanes, application zones, and clear ratios so every session targets a limiter — technique, decisions, speed, or transfer. Same bar from youth development through adult leagues and elite small-group work.',

  /** Single-line inventory for Training / Programs list row. */
  programInventoryLine:
    'Youth development and leagues · Adult leagues · Elite and small-group technical · Fitness conditioning',

  whatWeBuildLine:
    'Possession, distribution, and control under pressure — the on-ball habits we train at every level.',
} as const
