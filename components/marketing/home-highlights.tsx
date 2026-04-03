'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { MarketingTextReveal } from '@/components/marketing/marketing-text-reveal'
import { cn } from '@/lib/utils'

type HighlightTier = 'anchor' | 'emphasis' | 'default' | 'quiet'
type GridBand = 'tier1' | 'mid' | 'tier2'

/** Order: anchor → spine → application → programs → economics → asset → entry. Lines trimmed ~30%; `more` shows on hover. */
const HIGHLIGHTS: {
  label: string
  line: string
  more: string
  href: string
  tier: HighlightTier
  band: GridBand
  cta: string
  /** lg grid placement — bento rhythm (first row asymmetric). */
  layoutClass: string
}[] = [
  {
    label: 'Youth membership',
    line: 'Anchor product. No chaotic drop-in.',
    more: 'Published blocks only. Density you can plan around.',
    href: MARKETING_HREF.youthMembership,
    tier: 'anchor',
    band: 'tier1',
    cta: 'Start with membership →',
    layoutClass: 'lg:col-span-4 lg:row-span-2 lg:min-h-[min(17rem,42vh)]',
  },
  {
    label: 'The Formula',
    line: 'Baseline + reassess. Parent-clear signal.',
    more: 'Weighted index — progression families can read.',
    href: MARKETING_HREF.fpi,
    tier: 'emphasis',
    band: 'tier1',
    cta: 'Explore →',
    layoutClass: 'lg:col-span-2 lg:row-start-1 lg:col-end-7',
  },
  {
    label: 'Friday Youth Game Circuit',
    line: 'Balanced teams. Structured games.',
    more: 'No standings theater — real minutes, real roles.',
    href: MARKETING_HREF.fridayCircuit,
    tier: 'emphasis',
    band: 'tier1',
    cta: 'Explore →',
    layoutClass: 'lg:col-span-2 lg:row-start-2 lg:col-end-7',
  },
  {
    label: 'Clinics',
    line: 'Small groups. High reps. Members-first.',
    more: 'Scarce labs — Formula-informed coaching.',
    href: MARKETING_HREF.clinics,
    tier: 'default',
    band: 'mid',
    cta: 'Explore →',
    layoutClass: 'lg:col-span-2',
  },
  {
    label: 'Camps',
    line: 'Structured days — full facility.',
    more: 'Summer + holidays — not daycare soccer.',
    href: MARKETING_HREF.camps,
    tier: 'default',
    band: 'mid',
    cta: 'Explore →',
    layoutClass: 'lg:col-span-2',
  },
  {
    label: 'Adult programming',
    line: 'Pickup + leagues. Controlled floor.',
    more: 'Respectful intensity — seasonal rhythm.',
    href: MARKETING_HREF.adults,
    tier: 'default',
    band: 'mid',
    cta: 'Explore →',
    layoutClass: 'lg:col-span-2',
  },
  {
    label: 'Rentals',
    line: 'Premium inventory. Real cycles.',
    more: 'Clubs · teams · private — synced to how you operate.',
    href: MARKETING_HREF.rentals,
    tier: 'quiet',
    band: 'tier2',
    cta: 'View rentals →',
    layoutClass: 'lg:col-span-2',
  },
  {
    label: 'Footbot',
    line: 'Precision reps. Formula spec.',
    more: 'Rentals and comps under the same floor standard.',
    href: MARKETING_HREF.footbot,
    tier: 'quiet',
    band: 'tier2',
    cta: 'View Footbot →',
    layoutClass: 'lg:col-span-2',
  },
  {
    label: 'Assessments',
    line: 'Skills check · placement · honest bar.',
    more: 'Formula Skills Check — expectations you can trust.',
    href: MARKETING_HREF.assessment,
    tier: 'quiet',
    band: 'tier2',
    cta: 'Assessment info →',
    layoutClass: 'lg:col-span-2',
  },
]

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.055, delayChildren: 0.06 },
  },
}

const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

function highlightCtaClass(tier: HighlightTier) {
  switch (tier) {
    case 'anchor':
      return 'mt-4 inline-flex w-fit items-center border border-formula-volt/45 bg-formula-volt/[0.12] px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-volt shadow-[inset_0_0_0_1px_rgb(220_255_0_/_0.08)] transition-colors group-hover:border-formula-volt/70 group-hover:bg-formula-volt/[0.18]'
    case 'emphasis':
      return 'mt-4 inline-block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt transition-opacity group-hover:opacity-100'
    case 'quiet':
      return 'mt-4 inline-block font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-formula-mist/55 underline decoration-formula-frost/20 underline-offset-4 transition-colors group-hover:text-formula-frost/80 group-hover:decoration-formula-frost/35'
    default:
      return 'mt-4 inline-block font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-formula-volt/90 transition-opacity group-hover:opacity-100'
  }
}

export function HomeHighlights({ id = 'highlights' }: { id?: string }) {
  return (
    <section id={id} className="mx-auto max-w-[1200px] px-6 py-24 md:py-32">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-mist">Programs & assets</p>
      <MarketingTextReveal>
        <h2 className="mt-4 max-w-[20ch] font-mono text-xl font-medium leading-snug tracking-tight text-formula-paper sm:max-w-[24ch] md:text-[1.35rem]">
          One stack for every level
        </h2>
      </MarketingTextReveal>
      <motion.ul
        className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-px sm:bg-formula-frost/10 lg:grid-cols-6 lg:gap-4 lg:bg-transparent"
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -10% 0px', amount: 0.12 }}
      >
        {HIGHLIGHTS.map(h => (
          <motion.li
            key={h.label}
            variants={rowVariants}
            className={cn(
              'marketing-glass transition-[background-color,box-shadow] duration-300 hover:bg-formula-deep/42',
              'max-sm:border max-sm:border-formula-frost/10 max-sm:bg-formula-base/80',
              h.layoutClass,
              h.band === 'tier1' &&
                h.tier !== 'anchor' &&
                'border-l-2 border-formula-volt/45 bg-formula-volt/[0.05] py-6 pl-4 pr-5 sm:border-l-0 sm:pl-5 md:py-7 md:pl-6',
              h.band === 'tier1' &&
                h.tier === 'anchor' &&
                'relative z-[1] border-l-2 border-formula-volt/50 bg-formula-base/90 py-7 pl-5 pr-6 ring-1 ring-inset ring-formula-volt/22 sm:border-l-2 md:py-9 md:pl-7 md:pr-8',
              h.band === 'mid' && 'bg-formula-base/80 p-5 sm:p-6',
              h.band === 'tier2' && 'border-l border-formula-frost/15 bg-formula-deep/28 p-5 sm:border-l-0 hover:bg-formula-deep/36 md:p-6'
            )}
          >
            <Link href={h.href} className="group flex h-full min-h-0 flex-col no-underline">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-formula-paper/90 group-hover:text-formula-paper">
                {h.label}
              </span>
              <p
                className={cn(
                  'mt-2.5 font-sans text-sm leading-relaxed transition-opacity duration-300',
                  h.band === 'tier2' ? 'text-formula-mist/78' : 'text-formula-mist'
                )}
              >
                {h.line}
              </p>
              <p
                className={cn(
                  'mt-2 max-h-0 overflow-hidden font-sans text-[13px] leading-snug opacity-0 transition-[max-height,opacity,margin] duration-300 ease-out group-hover:mt-2.5 group-hover:max-h-24 group-hover:opacity-100',
                  h.band === 'tier2' ? 'text-formula-frost/55' : 'text-formula-frost/70'
                )}
              >
                {h.more}
              </p>
              <span className={cn(highlightCtaClass(h.tier), 'mt-auto pt-3')}>{h.cta}</span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}
