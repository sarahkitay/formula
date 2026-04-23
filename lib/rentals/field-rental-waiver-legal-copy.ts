/** Single source for waiver language shown on the public form and in admin (signed record). */

export const FIELD_RENTAL_WAIVER_TITLE = 'Field Rental Agreement and Facility Use Waiver' as const

export const FIELD_RENTAL_WAIVER_INTRO = {
  standard:
    'Required per participant: name, email, date of birth, and signed waiver before field access. Minors: parent or legal guardian completes the waiver. Submitting sends a copy to our team and saves the waiver for staff review. Use the field rental checkout when you are also placing a paid hold.',
  roster:
    'You are signing for one participant on this roster link. Each person should submit their own waiver using the same link until the booking is complete. Minors: a parent or legal guardian completes the waiver.',
} as const

export const FIELD_RENTAL_WAIVER_BULLETS = [
  {
    lead: '1) Rental type and classification:',
    body: 'Facility may reclassify incorrect booking type and adjust pricing or terminate without refund.',
  },
  {
    lead: '2) Capacity limits:',
    body: 'Club/Team Practice max 20 per field. Private/Semi-Private max 4; 5+ reclassified. General Use/Pick-Up max 15 and no commercial/team instruction.',
  },
  {
    lead: '3-5) Registration, minors, and field rules:',
    body: 'all participants need signed waiver; parent/guardian signs for minors. No cleats. Water only on field. No food/gum/other drinks on turf. Follow staff instructions.',
  },
  {
    lead: '6-11) Time, cancellation, liability, insurance, indemnification:',
    body: 'overstay billed in 30-minute increments; 48-hour cancellation policy; renter responsible for damage; COI may be required; renter assumes risk and certifies all participants signed.',
  },
] as const

/** Checkbox labels as shown on the signing form (must stay in sync with `field-rental-agreement-form`). */
export const FIELD_RENTAL_WAIVER_ACK_CHECKBOXES = [
  'I agree to all terms in the Field Rental Agreement and Facility Use Waiver.',
  'I assume all participation risks and agree to indemnify and hold harmless Formula Soccer Center.',
  'I understand and will comply with facility rules, time limits, and cancellation policy.',
] as const
