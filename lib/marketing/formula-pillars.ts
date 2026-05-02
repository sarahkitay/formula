/** Shared six-pillar model: titles align everywhere; descriptions can vary by page. */

export type FormulaPillar = { title: string; description: string; kicker?: string }

/** Copy used on /fpi (The Formula). */
export const FPI_PILLARS: readonly FormulaPillar[] = [
  {
    kicker: 'SPEED AND EXPLOSIVENESS',
    title: 'Speed & Explosiveness',
    description:
      'Timed sprints on the Speed Track. First step, separation, and repeat sprint capacity — all captured, not estimated.',
  },
  {
    kicker: 'AGILITY AND CHANGE OF DIRECTION',
    title: 'Agility & Change of Direction',
    description:
      'Reactive movement under time pressure on the Double Speed Court. Deceleration, sharp cuts, and lateral quickness — logged every rep.',
  },
  {
    kicker: 'DECISION-MAKING AND COGNITIVE SPEED',
    title: 'Decision-Making & Cognitive Speed',
    description:
      'Structured scenarios that force choices under pressure. We measure when the right decision is made, not just whether it was.',
  },
  {
    kicker: 'TECHNICAL EXECUTION',
    title: 'Technical Execution',
    description:
      'High-volume reps on the Footbot. Ball-control load and precision distribution — counted, not assumed.',
  },
  {
    kicker: 'GAME APPLICATION',
    title: 'Game Application',
    description:
      'How the athlete translates isolated skills into live play contexts. Observed across structured game-format segments.',
  },
  {
    kicker: 'CONSISTENCY AND COACHABILITY',
    title: 'Consistency & Coachability',
    description:
      'Performance across the full session — early reps vs. late reps, response to instruction, behavior under fatigue.',
  },
] as const

/** Copy used on /assessment (Skills Check context). */
export const ASSESSMENT_PILLARS: readonly FormulaPillar[] = [
  {
    title: 'Speed and explosiveness',
    description:
      'Timed on the Speed Track. Linear acceleration, first step, and repeat sprint performance with and without the ball.',
  },
  {
    title: 'Agility and change of direction',
    description:
      'Measured on the Double Speed Court and through structured movement tasks: lateral quickness, deceleration, reactive cuts, and directional efficiency.',
  },
  {
    title: 'Decision-making and cognitive speed',
    description:
      'Assessed in application blocks and small-sided scenarios where decisions show up on the ball, with coach review alongside your movement data.',
  },
  {
    title: 'Technical execution',
    description: 'Ball control, passing, receiving, and manipulation assessed through Footbot and structured ball tasks.',
  },
  {
    title: 'Game application',
    description:
      'How skills transfer in applied scenarios, small-sided situations, and circuit exercises designed to reflect game demands.',
  },
  {
    title: 'Consistency and coachability',
    description: 'Response to instruction, effort under repeated stress, and performance across the full session.',
  },
] as const
