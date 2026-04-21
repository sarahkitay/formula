import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { HomeProgramsAndPathways } from '@/components/marketing/home-programs-and-pathways'
import { MarketingInnerPage, CtaRow } from '@/components/marketing/marketing-inner'
import { YouthMembershipPackageHero } from '@/components/marketing/youth-membership-package-hero'
import { YouthPackageAckStrip } from '@/components/marketing/youth-package-ack-strip'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { FORMULA_SKILLS_CHECK, SESSION_PACKAGE_10, SESSION_PACKAGE_5, SESSION_PACKAGE_EARLY_BIRD } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Programs and pricing',
  description:
    'Start with a Formula Skills Check. Early bird session packages: 5 for $150, 10 for $250 through June. Youth memberships launching soon. Programs, clinics, Friday circuit, and adult programming at Formula Soccer Center.',
}

export default function YouthMembershipPage() {
  return (
    <>
      <div className="mx-auto max-w-[1100px] px-6 pt-28 md:pt-32">
        <YouthMembershipPackageHero />
      </div>

      <div className="marketing-section-divider" aria-hidden />
      <HomeProgramsAndPathways id="programs-catalog" />

      <MarketingInnerPage
        wide
        articleClassName="!pt-12 md:!pt-16"
        eyebrow="Programs and pricing"
        title="Start with an assessment. <br> Everything else follows."
        intro={`Every athlete at Formula starts with a Formula Skills Check: a one-hour assessment that scores your player across six performance pillars and determines which program and training focus is right for them. ${SESSION_PACKAGE_EARLY_BIRD.headline}: ${SESSION_PACKAGE_5.sessions} sessions for $${SESSION_PACKAGE_5.priceUsd} or ${SESSION_PACKAGE_10.sessions} sessions for $${SESSION_PACKAGE_10.priceUsd} (${SESSION_PACKAGE_EARLY_BIRD.validThrough}). Youth membership tiers are opening within the next month; join the waitlist on this page for first access.`}
      >
        <h2>Assessment</h2>
        <p>
          <strong>{FORMULA_SKILLS_CHECK.name}</strong> · ${FORMULA_SKILLS_CHECK.priceUsd}
        </p>
        <p>
          One hour. Six pillars. Objective scores across speed, agility, decision-making, technical execution, game application, and consistency. You leave with
          a full performance report in your parent portal and a personalized training recommendation.
        </p>
        <p>{FORMULA_SKILLS_CHECK.waiverSummary}</p>
        <p className="not-prose">
          <Link
            href={MARKETING_HREF.bookAssessmentPortal}
            className="inline-flex h-11 items-center border border-black/20 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] !text-black no-underline transition-[filter] hover:brightness-105 hover:!text-black"
          >
            Book your assessment
          </Link>
        </p>

        <h2 className="!mt-14">Current offering</h2>
        <p>
          <strong>{SESSION_PACKAGE_EARLY_BIRD.headline}</strong> ({SESSION_PACKAGE_EARLY_BIRD.validThrough}) — choose a session block:
        </p>
        <ul>
          <li>
            <strong>{SESSION_PACKAGE_5.sessions}-session package</strong> · ${SESSION_PACKAGE_5.priceUsd}
          </li>
          <li>
            <strong>{SESSION_PACKAGE_10.sessions}-session package</strong> · ${SESSION_PACKAGE_10.priceUsd}
          </li>
        </ul>
        <p>{SESSION_PACKAGE_10.purchaseNote}</p>
        <div className="not-prose flex flex-wrap gap-3">
          <CheckoutLaunchButton checkoutType="package-5" label={`Buy ${SESSION_PACKAGE_5.sessions}-session package ($${SESSION_PACKAGE_5.priceUsd})`} />
          <CheckoutLaunchButton checkoutType="package-10" label={`Buy ${SESSION_PACKAGE_10.sessions}-session package ($${SESSION_PACKAGE_10.priceUsd})`} />
        </div>
        <YouthPackageAckStrip />
        <p className="text-sm text-formula-frost/70">Session expiration window: confirm with the desk before launch.</p>

        <h2 className="!mt-14">Memberships</h2>
        <p>
          <strong>Youth memberships</strong> · coming soon
        </p>
        <p>
          Recurring monthly membership tiers are launching within the next month. Memberships include structured weekly programming, published session blocks,
          capped enrollment, and ongoing Formula tracking.
        </p>
        <p>Join the waitlist and you&apos;ll be notified first when spots open.</p>
        <p>What memberships will include:</p>
        <ul>
          <li>Published weekly training blocks: no surprise open play</li>
          <li>Capped enrollment: protected coaching quality</li>
          <li>Ongoing Formula tracking and 6-month reassessments</li>
          <li>Priority access to clinics and Friday circuit</li>
          <li>Assessment fee waiver for qualifying tiers</li>
        </ul>

        <h2 className="!mt-14">Other programs</h2>
        <ul>
          <li>
            <Link href={MARKETING_HREF.fridayCircuit}>Friday Youth Game Circuit</Link> · structured competitive play. Balanced teams. Live now.
          </li>
          <li>
            <Link href={MARKETING_HREF.clinics}>Clinics</Link> · small group, high-rep, coach-led. Members get priority.
          </li>
          <li>
            <Link href={MARKETING_HREF.camps}>Camps</Link> · full-facility. Structured days. Summer and school breaks.
          </li>
          <li>
            <Link href={MARKETING_HREF.adults}>Adult programming</Link> · pickup and leagues. Professional floor standards. Live now.
          </li>
          <li>
            <Link href={MARKETING_HREF.rentals}>Field rentals</Link> · structured field time (default 180 min blocks). Different checkout than parties.
          </li>
          <li>
            <Link href={MARKETING_HREF.parties}>Birthday parties</Link> · hosted party deposit path — not field rental checkout.
          </li>
          <li>
            <Link href={MARKETING_HREF.events}>Events</Link> · corporate, tournaments, large blocks — staff inquiry form.
          </li>
        </ul>

        <p className="not-prose mt-10 text-[15px] leading-relaxed text-formula-frost/85">
          Deep dive: <Link href={MARKETING_HREF.assessment}>Assessments</Link> · <Link href={MARKETING_HREF.fpi}>The Formula</Link> ·{' '}
          <Link href={MARKETING_HREF.facility}>Facility</Link>
        </p>

        <CtaRow
          primary={{ label: 'Book an assessment', href: MARKETING_HREF.bookAssessmentPortal }}
          secondary={{ label: 'Join the membership waitlist', waitlist: true }}
        />
      </MarketingInnerPage>
    </>
  )
}
