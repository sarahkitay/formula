/**
 * Primary marketing display <h1>: What Is Formula hero and MarketingInnerPage titles.
 * Homepage uses `marketingHeroWordmarkClassName` for the FORMULA wordmark row.
 */
export const marketingDisplayH1ClassName =
  'font-mono text-[clamp(1.5rem,3.6vw,2.35rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-formula-paper [text-shadow:0_3px_24px_rgba(0,0,0,0.45),0_1px_8px_rgba(0,0,0,0.32)]'

/** Inner pages with long titles: slightly tighter than display H1 for stacked heroes + product bands. */
export const marketingInnerH1CompactClassName =
  'text-balance font-mono text-[clamp(1.35rem,3vw,2rem)] font-semibold leading-[1.14] tracking-[-0.02em] text-formula-paper sm:text-[clamp(1.4rem,2.6vw,2.1rem)] sm:leading-[1.12] [text-shadow:0_2px_18px_rgba(0,0,0,0.42),0_1px_6px_rgba(0,0,0,0.28)]'

/**
 * Homepage hero only: centered FORMULA wordmark, large but slightly restrained vs full viewport max;
 * tight tracking for an intentional technical mark, not “scaled up body text”.
 */
export const marketingHeroWordmarkClassName =
  'font-mono text-[clamp(2.25rem,min(12vw,15dvh),5rem)] font-semibold leading-[0.84] tracking-[-0.06em] text-formula-paper [text-shadow:0_3px_32px_rgba(0,0,0,0.52),0_2px_12px_rgba(0,0,0,0.38)]'
