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
    description: 'Lateral movement, deceleration, and directional efficiency. Assessed through structured movement tasks.',
  },
  {
    title: 'Decision-making and cognitive speed',
    description:
      'Reading the field, scanning under pressure, choosing correctly and quickly. Measured on our Double Speed Court.',
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
      'Measured through structured movement tasks. Lateral quickness, deceleration, and directional efficiency.',
  },
  {
    title: 'Decision-making and cognitive speed',
    description: 'Assessed on the Double Speed Court. Reaction time, scanning, and correct choices under pressure.',
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
