/**
 * Canonical public marketing language and tone for Formula Soccer Center.
 * Prefer importing from here for homepage and program-framing copy; keep ops-specific pages flexible.
 */
export const SITE_VOICE = {
  /** Primary lines under the FORMULA wordmark (rendered with line breaks in the hero). */
  heroHeadlineLines: ['Serious soccer training.', 'Clear results.'] as const,

  homeHeroLead:
    'Formula is a structured training system that helps players improve faster using real data, proven coaching, and focused sessions.',

  homeHeroTagline: 'No guesswork. No wasted time. Just clear development.',

  /** “What this is” band (homepage split). */
  homeWhatThisIsLead: 'Formula is not drop-in play or random drills.',

  homeWhatThisIsBody:
    'Every player is assessed, placed into the right program, and trained with a clear plan. We track progress so players improve and families can see it.',

  homeWhatThisIsClosing: 'You always know what your player is working on and why.',

  /** “How it works” steps (homepage assessment band). */
  homeHowItWorksSteps: [
    {
      title: 'Assessment',
      body: 'Every player completes the same evaluation covering speed, agility, technique, and decision-making.',
    },
    {
      title: 'Placement',
      body: 'We build a training plan based on results, not guesswork.',
    },
    {
      title: 'Training',
      body: 'Structured sessions focused on what each player actually needs.',
    },
    {
      title: 'Progress',
      body: 'We measure improvement over time so results are clear.',
    },
  ] as const,

  homeWhatWeTrainHeadline: 'We focus on the skills that show up in real games.',

  homeBallControlTitle: 'Ball control',
  homeBallControlBody:
    'High-repetition technical work using Footbot. Every touch is tracked.',

  homeAgilityTitle: 'Agility',
  homeAgilityBody: 'Change of direction, reaction speed, and movement under pressure.',

  homeSpeedTitle: 'Speed',
  homeSpeedBody: 'Acceleration and sprinting built for real match situations.',

  homeWhatWeTrainClosing: 'Everything is trained at game speed, with decisions, not just drills.',

  homeWhoClub: 'Improve the areas your team does not have time to focus on.',
  homeWhoRec: 'Learn the right habits early in a structured setting.',
  homeWhoCompetitive: 'Train against real standards with measurable progress.',
  homeWhoParents: 'See exactly what your player is working on and how they are improving.',

  homeProgramsItems: [
    { label: 'Assessment and development plan', description: 'The starting point for every player.' },
    { label: 'Youth training', description: 'Structured sessions with small groups.' },
    { label: 'Clinics', description: 'Focused skill sessions with high repetition.' },
    { label: 'Game circuit', description: 'Organized games with balanced teams.' },
    { label: 'Camps', description: 'Full training days with structure and coaching.' },
    { label: 'Adult programs', description: 'Leagues and pickup with the same standards.' },
    { label: 'Rentals and events', description: 'Field time, team sessions, and private bookings.' },
  ] as const,

  homeStartHereBody:
    'If you are not sure where to begin, start with an assessment. That is how we build everything else.',

  homeStayUpdatedTitle: 'Stay updated',
  homeStayUpdatedBody: 'Be the first to hear about programs, clinics, and memberships.',

  /** Steve Cherundolo: keep wording exactly as approved. */
  cherundoloPartnershipQuote:
    'I have partnered with Formula because it reflects my own personal philosophy of player development in the modern game. Every soccer action has three critical moments which increase in difficulty when time and space are reduced. By combining elite coaching with cutting-edge technology, Formula will develop players who think faster, make intelligent decisions and execute at the highest of levels.',
} as const
