/** Shared six-pillar model: titles align everywhere; descriptions can vary by page. */

export type FormulaPillar = { title: string; description: string }

/** Copy used on /fpi (The Formula). */
export const FPI_PILLARS: readonly FormulaPillar[] = [
  {
    title: 'Speed and explosiveness',
    description:
      'First step, separation, repeat sprint capacity. Measured on our Speed Track with and without the ball.',
  },
  {
    title: 'Agility and change of direction',
    description:
      'Lateral movement, deceleration, reactive cuts, and directional efficiency. Measured on our Double Speed Court with structured change-of-direction tasks.',
  },
  {
    title: 'Decision-making and cognitive speed',
    description:
      'Reading the field, scanning under pressure, choosing correctly and quickly. Captured in applied play, small-sided work, and coach evaluation on the floor.',
  },
  {
    title: 'Technical execution',
    description: 'Passing, receiving, control, and ball manipulation under structured conditions. Measured with and by Footbot.',
  },
  {
    title: 'Game application',
    description:
      'How skills transfer when it matters, in small-sided play, circuit scenarios, and applied pressure situations.',
  },
  {
    title: 'Consistency and coachability',
    description: 'Effort, response to feedback, and performance under repeated stress. Evaluated by coaching staff across sessions.',
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
