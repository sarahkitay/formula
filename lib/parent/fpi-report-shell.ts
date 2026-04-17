export type ParentFpiReportContent = {
  compositeLabel: string
  compositeValue: number
  compositeNarrative: string
  percentileBand: string
  trendLabel: string
  domains: { name: string; value: number; note: string }[]
  priorities: string[]
  focus12Week: string
  clinicSuggestions: string[]
  supportiveFooter: string
}

/** Empty FPI parent report until assessments + pillar scores exist for the athlete. */
export const parentFpiReportEmpty: ParentFpiReportContent = {
  compositeLabel: 'Development index',
  compositeValue: 0,
  compositeNarrative: 'FPI summaries appear after staff log assessments for this athlete.',
  percentileBand: '—',
  trendLabel: '—',
  domains: [],
  priorities: [],
  focus12Week: '—',
  clinicSuggestions: [],
  supportiveFooter:
    'Development is non-linear. Formula uses FPI internally to guide coaching priorities — not as a public leaderboard.',
}
