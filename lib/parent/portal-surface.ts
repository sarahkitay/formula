/**
 * Parent portal surfaces: align with dashboard home (green-tinted panels, not flat #111).
 * Use under `.parent-os` / `portal-brand-surface`.
 */

const panel =
  'border border-formula-frost/12 bg-formula-paper/[0.04] shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]'

export const parentPortalCard = `rounded-sm ${panel}`

export const parentPortalPanel = `rounded-xl ${panel}`

/** Dense info strip (policies, allowances). */
export const parentPortalInsetStrip =
  'rounded-sm border border-formula-frost/12 bg-formula-deep/50 px-4 py-3 font-mono text-[10px] leading-relaxed text-formula-frost/80'

/** Dashed callout (e.g. learn page footer). */
export const parentPortalDashedCallout =
  'rounded-sm border border-dashed border-formula-volt/25 bg-formula-deep/40 px-6 py-8 text-center'

/** Inline text link on portal canvas. */
export const parentPortalTextLink =
  'font-medium text-formula-volt underline decoration-formula-volt/40 transition-colors hover:text-formula-volt/90'

/** Secondary outline control (replaces stark muted/button on black). */
export const parentPortalOutlineBtn =
  'inline-flex h-9 w-fit items-center gap-1.5 rounded-control border border-formula-frost/20 bg-formula-paper/[0.04] px-3 text-xs font-medium text-formula-paper transition-colors hover:border-formula-volt/35 hover:bg-formula-paper/[0.08]'
