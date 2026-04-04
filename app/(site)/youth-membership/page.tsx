import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage, CtaRow } from '@/components/marketing/marketing-inner'
import { YouthMembershipPackageHero } from '@/components/marketing/youth-membership-package-hero'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { FORMULA_SKILLS_CHECK, SESSION_PACKAGE_10 } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Youth membership',
  description:
    '10 sessions for $300 — session package available now. Monthly youth memberships coming soon. Club-complementary training at Formula Soccer Center.',
}

const VALUE_CARDS: { title: string; body: string }[] = [
  {
    title: 'Club-complementary',
    body: 'Accelerate beside the club: sharper habits, athletic literacy, and application under constraint — without replacing your team’s identity. Stay all-in on club while building what coaches need on the weekend.',
  },
  {
    title: 'Age-appropriate tiers',
    body: 'Long-arc curriculum: technical clarity first; speed and cognition as capacity grows; application when habits transfer. Tiering protects ratios and honest work per athlete.',
  },
  {
    title: 'Published blocks',
    body: 'Known rhythms, rotations, and ops — no surprise open play replacing progression. Predictability is part of the premium for travel, school, and recovery.',
  },
  {
    title: 'Controlled density',
    body: 'Capped floors, protected coaching bandwidth, on-time finishes. When demand outruns supply, we protect standards — not volume at the cost of quality.',
  },
  {
    title: 'Station-based development',
    body: 'Technical, speed, cognitive, and application stations — specific, measurable, transferable. Progression stays legible for families and coaches via The Formula.',
  },
  {
    title: 'Protected fields',
    body: 'Surfaces for programmed development and application — arena work, Friday circuit, habits under structure. A system, not a hangout.',
  },
]

export default function YouthMembershipPage() {
  return (
    <MarketingInnerPage
      wide
      prepend={<YouthMembershipPackageHero />}
      eyebrow="Youth membership"
      title="Structure that respects club life."
      intro={`Our live offer is the ${SESSION_PACKAGE_10.sessions}-session package at $${SESSION_PACKAGE_10.priceUsd}. Monthly membership tiers are not available yet — use the waitlist above to get notified.`}
    >
      <div className="not-prose grid gap-4 sm:grid-cols-2 lg:gap-5">
        {VALUE_CARDS.map((card) => (
          <div
            key={card.title}
            className="group border border-formula-frost/10 bg-formula-paper/[0.025] p-5 transition-colors hover:border-formula-frost/16 md:p-6"
          >
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-volt/90">
              {card.title}
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-formula-frost/88">{card.body}</p>
          </div>
        ))}
      </div>

      <div className="not-prose mt-10 border border-formula-frost/10 bg-formula-deep/30 px-5 py-6 md:px-7 md:py-7">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
          {FORMULA_SKILLS_CHECK.name}
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-formula-frost/85">
          ${FORMULA_SKILLS_CHECK.priceUsd} skills check — book via{' '}
          <Link href={MARKETING_HREF.assessment} className="text-formula-volt underline-offset-2 hover:underline">
            assessments
          </Link>
          . {FORMULA_SKILLS_CHECK.waiverSummary}
        </p>
      </div>

      <p className="not-prose mt-10 text-[15px] leading-relaxed text-formula-frost/85">
        Next: <Link href={MARKETING_HREF.bookAssessmentPortal}>Book assessment</Link> ·{' '}
        <Link href={MARKETING_HREF.fpi}>The Formula</Link> · <Link href={MARKETING_HREF.facility}>Facility</Link>
      </p>

      <CtaRow
        primary={{ label: 'Buy 10-session package', checkoutType: 'package-10' }}
        secondary={{ label: 'Membership waitlist', waitlist: true }}
      />
    </MarketingInnerPage>
  )
}
