/**
 * Split booking hub: each flow has its own URL so mobile users don’t scroll past
 * unrelated sections (e.g. field rental vs party deposit).
 */
export const BOOKING_HUB_PUBLIC = {
  hub: '/book-assessment',
  contact: '/book-assessment/contact',
  skillsCheck: '/book-assessment/skills-check',
  youthBlocks: '/book-assessment/youth-blocks',
  fieldRental: '/book-assessment/field-rental',
  birthdayParty: '/book-assessment/birthday-party',
  waiver: '/book-assessment/waiver',
} as const

export const BOOKING_HUB_PARENT = {
  hub: '/parent/book-assessment',
  contact: '/parent/book-assessment/contact',
  skillsCheck: '/parent/book-assessment/skills-check',
  youthBlocks: '/parent/book-assessment/youth-blocks',
  fieldRental: '/parent/book-assessment/field-rental',
  birthdayParty: '/parent/book-assessment/birthday-party',
  waiver: '/parent/book-assessment/waiver',
} as const
