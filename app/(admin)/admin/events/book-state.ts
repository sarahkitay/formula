/** Client + server action shape for "Book an event" (must not live in a `use server` file — only async fns may be exported there). */
export type FacilityEventBookState = {
  ok: boolean
  message: string
  /** Set after a successful save so the UI can scroll to the new row. */
  createdEventId?: string
  /** Populated when "Create waiver on save" succeeds in the same submit. */
  waiverUrl?: string
  /** Populated when "Create payment link on save" succeeds in the same submit. */
  paymentUrl?: string
}

export const BOOK_INITIAL: FacilityEventBookState = { ok: false, message: '' }
