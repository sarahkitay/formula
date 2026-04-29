/**
 * Formula Soccer Center - performance-driven soccer development operating system.
 * Not a generic booking platform: capacity, time, and development discipline are first-class.
 */

/** Brand + operating doctrine (copy, validation messages, onboarding). */
export const FORMULA_OS = {
  coreIdentity: [
  'Scientific',
  'Structured',
  'Premium',
  'Capacity-controlled',
  'Development-focused',
  'Club-complementary - not club-replacement',
  'Performance measured through FPI',
  'Training must translate into application',
  'Revenue follows discipline',
  ],
  nonNegotiables: [
  'Capacity is never exceeded',
  'Sessions start on time',
  'Reset buffers between youth blocks are protected',
  'No chaotic youth drop-in culture',
  'No warehouse feel',
  'No public leaderboards or ranking walls',
  'No parent-run sidelines in structured programming',
  'No social-stacking in Friday games',
  'Membership remains anchor identity',
  ],
  operatingModel: [
  'Youth membership is the anchor product',
  '12-week synchronized cycles',
  '55-minute youth block engine with protected reset buffers',
  'FPI baseline + reassessment every 6 months',
  'Friday Youth Game Circuit: structured, pre-registered, developmental',
  'Adult programming is additive, not dominant',
  'Fields are premium inventory - rarely used for youth membership; youth relies on station-based rotation',
  'Rentals are structured and secondary to membership identity',
  'Clinics are scarce and high-touch',
  'Camps, parties, tournaments, Footbot, and morning monetization are controlled additive layers',
  ],
  surfaces: {
  admin: 'Scheduling, capacity, inventory, revenue discipline, and facility control',
  coach: 'Session execution, rotation fidelity, athlete development signals - not social theater',
  parent: 'Schedule, membership, progress context - no sideline operating or rankings',
  public: 'Premium, technical, invitation to discipline - not a generic SaaS marketing page',
  },
  experiencePrinciples: [
  'Premium, technical, structured, operationally disciplined',
  'Avoid generic SaaS dashboard patterns',
  'Avoid playful or bubbly styling',
  ],
} as const

export const SITE = {
  facilityName: 'Formula Soccer Center',
  /** Street line for headers (booking hub, parent portal). */
  facilityAddressLine: '15001 Calvert Street, Los Angeles, CA 91411',
  /** Short rule for booking UI + waivers (turf footwear). */
  turfShoesAttendeeRule:
    'All attendees must wear turf shoes (turf-appropriate footwear) on the field; outdoor cleats are not allowed.',
  orgShortName: 'Formula',
  /** Short line for headers / metadata */
  tagline: 'Elevate your game - elite training, cutting-edge tech, structured development',
  sessionLengthMinutes: 55,
  turnoverMinutes: 15,
  /** Synchronized programming cadence */
  youthCycleWeeks: 12,
  /** FPI reassessment rhythm */
  fpiReassessmentMonths: 6,
  youthBlockCapacityMin: 6,
  youthBlockCapacityMax: 6,
  coachGroupsPerBlock: 4,
  cancellationPolicy:
  'Cancel at least 24 hours before session start. Late cancellations may incur a fee for spots you reserved.',
  membershipPolicy:
  'Monthly renewal. Unused sessions do not roll week to week. Each age group targets up to 50 active memberships, then waitlist.',
  youthBasePlanSummary: 'Base youth membership includes up to two sessions per week (billed monthly). Higher tier details TBD.',
  performanceDataPolicy:
  'All machine runs and coach-entered scores are retained for analytics. Official student scores and report cards use scheduled assessments only.',
  checkInNote:
  'Staffed check-in. Wristband scan preferred as soon as the athlete arrives; integration in progress.',
  roadmapNote: 'Wristband check-in → advanced analytics → mobile app.',
} as const
