/** Intro copy and checkbox labels for the field rental waiver (Golazo agreement body: `golazo-waiver-sections.ts`). */

export {
  GOLAZO_WAIVER_DOC_TITLE,
  GOLAZO_WAIVER_ENTITY_LINES,
  GOLAZO_WAIVER_PARTICIPANT_HEADER,
  GOLAZO_WAIVER_SECTIONS,
  GOLAZO_WAIVER_SIGNING_BLOCK,
  type GolazoBlock,
  type GolazoSection,
} from '@/lib/rentals/golazo-waiver-sections'

export const FIELD_RENTAL_WAIVER_INTRO = {
  standard:
    'Complete every field below. Your name, date of birth, address, phone, emergency contact, and team or organization are part of this agreement. Minors: a parent or legal guardian completes and signs. Expand each section to read the full text before you acknowledge and sign. Submitting saves the waiver for staff review and notifies our team.',
  roster:
    'You are signing for one participant on this roster link. Each person should submit their own waiver using the same link until the booking is complete. Complete address, phone, emergency contact, and team or organization. Minors: a parent or legal guardian completes the waiver. Expand each section to read the full agreement.',
} as const

/** Checkbox labels on the signing form (must match `field-rental-agreement-form` name bindings). */
export const FIELD_RENTAL_WAIVER_ACK_CHECKBOXES = [
  'I have read and agree to the Release of Liability, Assumption of Risk, and Indemnification Agreement above, including every numbered section I opened or expanded.',
  'I understand I am releasing important legal rights, including the right to sue for negligence, to the fullest extent permitted by California law, and I sign voluntarily.',
  'I agree to indemnify and defend the Released Parties as stated in the agreement; I consent to medical treatment terms; and I will follow facility rules, posted instructions, and staff directions — including that I (and any minors I supervise) will wear turf-appropriate footwear (turf shoes) on the field and will not use outdoor cleats or other unsafe footwear on the artificial turf.',
] as const
