'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MembershipWaitlistCapture } from '@/components/marketing/membership-waitlist-capture'
import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'
import { MarketingTextReveal } from '@/components/marketing/marketing-text-reveal'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { cn } from '@/lib/utils'

type HighlightTier = 'anchor' | 'emphasis' | 'default' | 'quiet'
type GridBand = 'tier1' | 'mid' | 'tier2'

const HIGHLIGHTS: {
  label: string
  line: string
  more: string
  href: string
  tier: HighlightTier
  band: GridBand
  cta: string
  layoutClass: string
}[] = [
  {
    label: 'Youth membership',
    line: 'Anchor product. No chaotic drop-in.',
    more: 'Published blocks only. Density you can plan around.',
    href: MARKETING_HREF.youthMembership,
    tier: 'anchor',
    band: 'tier1',
    cta: 'Memberships coming soon',
    layoutClass: 'lg:col-span-4 lg:row-span-2 lg:min-h-[min(17rem,42vh)]',
  },
  {
    label: 'The Formula',
    line: 'Baseline + reassess. Parent-clear signal.',
    more: 'Weighted index. Progression families can read.',
    href: MARKETING_HREF.fpi,
    tier: 'emphasis',
    band: 'tier1',
    cta: 'Explore →',
    layoutClass: 'lg:col-span-2 lg:row-start-1 lg:col-end-7',
  },
  {
    label: 'Friday Youth Game Circuit',
    line: 'Balanced teams. Structured games.',
    more: 'No standings theater: real minutes, real roles.',
    href: MARKETING_HREF.fridayCircuit,
    tier: 'emphasis',
    band: 'tier1',
    cta: 'Explore →',
    layoutClass: 'lg:col-span-2 lg:row-start-2 lg:col-end-7',
  },
  {
    label: 'Clinics',
    line: 'Small groups. High reps. Members-first.',
    more: 'Scarce labs. Formula-informed coaching.',
    href: MARKETING_HREF.clinics,
    tier: 'default',
    band: 'mid',
    cta: 'Explore →',
    layoutClass: 'lg:col-span-2',
  },
  {
    label: 'Camps',
    line: 'Structured days. Full facility.',
    more: 'Summer + holidays, not daycare soccer.',
    href: MARKETING_HREF.camps,
    tier: 'default',
    band: 'mid',
    cta: 'Explore →',
    layoutClass: 'lg:col-span-2',
  },
  {
    label: 'Adult programming',
    line: 'Pickup + leagues. Controlled floor.',
    more: 'Respectful intensity. Seasonal rhythm.',
    href: MARKETING_HREF.adults,
    tier: 'default',
    band: 'mid',
    cta: 'Explore →',
    layoutClass: 'lg:col-span-2',
  },
  {
    label: 'Field rentals',
    line: 'Structured deposits · default 180 min blocks.',
    more: 'Not the same checkout as hosted birthday parties — separate booking type.',
    href: MARKETING_HREF.rentals,
    tier: 'quiet',
    band: 'tier2',
    cta: 'Field rentals →',
    layoutClass: 'lg:col-span-2',
  },
  {
    label: 'Events',
    line: 'Corporate, tournaments, large blocks.',
    more: 'Staff inquiry — separate from field rental deposit checkout.',
    href: MARKETING_HREF.events,
    tier: 'quiet',
    band: 'tier2',
    cta: 'Events →',
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
    more: 'Formula Skills Check. Expectations you can trust.',
    href: MARKETING_HREF.assessment,
    tier: 'quiet',
    band: 'tier2',
    cta: 'Assessment info →',
    layoutClass: 'lg:col-span-2',
  },
]

const SECONDARY_PATHS: { label: string; line: string; href: string; tier: 'default' | 'quiet' }[] = [
  {
    label: 'Register for camp',
    line: 'Full facility. Structured days - summer + holidays.',
    href: MARKETING_HREF.camps,
    tier: 'default',
  },
  {
    label: 'Field rental booking',
    line: 'Deposits · default 180 min — not party checkout.',
    href: MARKETING_HREF.rentals,
    tier: 'quiet',
  },
  {
    label: 'Event inquiry',
    line: 'Corporate · tournaments — staff follows up.',
    href: `${MARKETING_HREF.events}#event-request`,
    tier: 'quiet',
  },
  {
    label: 'Register for adult programming',
    line: 'Pickup + leagues. Controlled floor. Seasonal.',
    href: MARKETING_HREF.adults,
    tier: 'default',
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
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
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

function pathLabelClass(tier: 'default' | 'quiet') {
  switch (tier) {
    case 'quiet':
      return 'inline-block font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-formula-mist/60 underline decoration-formula-frost/25 underline-offset-[5px] transition-colors group-hover:text-formula-frost/75 group-hover:decoration-formula-frost/40'
    default:
      return 'inline-block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-volt/95 transition-opacity group-hover:opacity-100'
  }
}

const primaryAssessmentClass =
  'inline-flex h-11 shrink-0 items-center border border-formula-volt/45 bg-formula-volt/[0.14] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-volt shadow-[inset_0_0_0_1px_rgb(220_255_0_/_0.08)] transition-[filter,background-color] hover:bg-formula-volt/[0.2] hover:brightness-105'

const primaryWaitlistTriggerClass =
  'inline-flex h-11 shrink-0 items-center border border-formula-frost/18 bg-formula-paper/[0.05] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper transition-colors hover:border-formula-frost/28'

const primaryClinicClass =
  'inline-flex h-11 shrink-0 items-center border border-formula-frost/12 bg-transparent px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-mist transition-colors hover:border-formula-frost/22 hover:text-formula-paper'

/**
 * Program catalog bento + CTAs. Rendered on Membership; was previously on the homepage.
 */
export function HomeProgramsAndPathways({ id = 'programs-pathways' }: { id?: string }) {
  return (
    <section id={id} className="mx-auto max-w-[1200px] px-6 py-24 md:py-32">
      <ScrollFadeIn>
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-mist">Programs & assets</p>
        <h2 className="mt-4 max-w-[22ch] font-mono text-xl font-medium leading-snug tracking-tight text-formula-paper sm:max-w-[28ch] md:text-[1.35rem]">
          One stack for every level
        </h2>
        <MarketingTextReveal>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-formula-frost/85">
            Explore the stack, then one next step: assessment, package, waitlist, or clinics. Camps, field rentals, events, and adults live under{' '}
            <span className="text-formula-paper/90">More ways in</span>.
          </p>
        </MarketingTextReveal>
      </ScrollFadeIn>

      <ScrollFadeIn className="not-prose mt-8">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-formula-olive">Start with</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Link href={MARKETING_HREF.bookAssessmentPortal} className={primaryAssessmentClass}>
            Book assessment
          </Link>
          <Link href={`${MARKETING_HREF.youthMembership}#session-package`} className={primaryWaitlistTriggerClass}>
            Purchase a package
          </Link>
          <MembershipWaitlistCapture
            source="programs-pathways"
            label="Memberships coming soon"
            buttonClassName={primaryWaitlistTriggerClass}
          />
          <Link href={MARKETING_HREF.clinics} className={primaryClinicClass}>
            Clinic registration →
          </Link>
        </div>
      </ScrollFadeIn>

      <motion.ul
        className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-px sm:bg-formula-frost/10 lg:grid-cols-6 lg:gap-4 lg:bg-transparent"
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

      <ScrollFadeIn className="not-prose mt-14">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-mist">More ways in</p>
        <h3 className="mt-3 max-w-2xl font-mono text-lg font-semibold tracking-tight text-formula-paper md:text-xl">
          Camps · field rentals · events · adults
        </h3>
        <ul className="mt-8 grid gap-px bg-formula-frost/10 sm:grid-cols-2 lg:grid-cols-3">
          {SECONDARY_PATHS.map(item => (
            <li
              key={item.label}
              className={cn(
                'marketing-glass bg-formula-base/80 p-6 transition-colors md:p-7',
                item.tier === 'quiet' && 'bg-formula-base/[0.65] hover:bg-formula-deep/35'
              )}
            >
              <Link href={item.href} className="group block no-underline">
                <span className={pathLabelClass(item.tier)}>
                  {item.label}
                  {item.tier === 'quiet' ? ' →' : ' →'}
                </span>
                <p
                  className={cn(
                    'mt-4 text-sm leading-relaxed',
                    item.tier === 'quiet' ? 'text-formula-mist/70' : 'text-formula-mist'
                  )}
                >
                  {item.line}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </ScrollFadeIn>
    </section>
  )
}
