/** Window event: header Book menu is hovered/focused (desktop) or open (mobile). Home intent dialog should not auto-open over it. */
export const BOOK_MENU_INTENT_SUPPRESS_EVENT = 'formula:book-menu-intent-suppress' as const

export type BookMenuIntentSuppressDetail = { engaged: boolean }

export function dispatchBookMenuIntentSuppress(engaged: boolean) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent<BookMenuIntentSuppressDetail>(BOOK_MENU_INTENT_SUPPRESS_EVENT, { detail: { engaged } })
  )
}
