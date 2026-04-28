import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { FormulaMinisSixWeekCheckout } from '@/components/marketing/formula-minis-six-week-checkout'
import { SundayChildProgramCheckout } from '@/components/marketing/sunday-child-program-checkout'
import { HomeProgramsAndPathways } from '@/components/marketing/home-programs-and-pathways'
import { MarketingInnerPage, CtaRow } from '@/components/marketing/marketing-inner'
import { YouthMembershipPackageHero } from '@/components/marketing/youth-membership-package-hero'
import { YouthPackageAckStrip } from '@/components/marketing/youth-package-ack-strip'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import {
  FORMULA_SKILLS_CHECK,
  FORMULA_MINIS_SIX_WEEK,
  FORMULA_SUNDAY_CHILD_PROGRAM_10_WK,
  SESSION_PACKAGE_10,
  SESSION_PACKAGE_5,
  SESSION_PACKAGE_EARLY_BIRD,
} from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Programs and pricing',
  description:
    'Formula Skills Check, early bird session packages, Formula Minis weekday (ages 2–3), Sunday Weekend Program (ages 2–5, 10 weeks, $500), and youth memberships at Formula Soccer Center.',
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

        <h2 className="!mt-14">Children&apos;s programming (summary)</h2>
        <p>
          Published structure matches our <strong>Children&apos;s Programming Summary v4</strong> (April 2026): Formula Minis weekday (ages 2–3), Formula Juniors
          weekday (ages 4–5 — details to come), and the <strong>Sunday Weekend Program</strong> (ages 2–5, four age-specific sessions). Standard membership U-brackets
          (U8–U14, U19) are separate from these preschool-style packages.
        </p>
        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse font-mono text-[11px] text-formula-frost/90">
            <caption className="sr-only">Youth age group structure</caption>
            <thead>
              <tr className="border-b border-formula-frost/15 text-left text-formula-mist uppercase tracking-wide">
                <th className="pb-2 pr-3 font-medium">Program / bracket</th>
                <th className="pb-2 pr-3 font-medium">Ages</th>
                <th className="pb-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Formula Minis', '2–3', 'Weekday + Sunday weekend'],
                ['Formula Juniors', '4–5', 'Weekday details to come; Sunday weekend live below'],
                ['U8', '6–7', 'Standard membership'],
                ['U10', '8–9', 'Standard membership'],
                ['U12', '10–11', 'Standard membership'],
                ['U14', '12–13', 'Standard membership'],
                ['U19', '14–18', 'Standard membership (no U16 bracket)'],
              ].map(([program, ages, notes]) => (
                <tr key={program} className="border-b border-formula-frost/[0.07]">
                  <td className="py-2 pr-3 align-top text-formula-paper/95">{program}</td>
                  <td className="py-2 pr-3 align-top">{ages}</td>
                  <td className="py-2 align-top text-formula-frost/85">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="!mt-14">Formula Minis — weekday (ages 2–3)</h2>
        <p>
          <strong>{FORMULA_MINIS_SIX_WEEK.label}</strong> · ${FORMULA_MINIS_SIX_WEEK.priceUsd} ({FORMULA_MINIS_SIX_WEEK.sessionsInPack} sessions in the published
          package · ${FORMULA_MINIS_SIX_WEEK.perSessionUsd}/session effective rate)
        </p>
        <p>{FORMULA_MINIS_SIX_WEEK.summary}</p>
        <p>
          After checkout, link a roster player as <strong>U6</strong> in the parent portal (Formula Minis ages 2–3), then book the matching Monday, Wednesday, or
          Friday block on the facility schedule.
        </p>
        <FormulaMinisSixWeekCheckout />

        <h3 className="!mt-10 text-formula-paper/95">Formula Juniors — weekday (ages 4–5)</h3>
        <p className="text-formula-frost/85">Weekday schedule and enrollment for Formula Juniors will be published here when ops finalizes the block. Sunday ages 4–5 are available in the weekend program below.</p>

        <h2 className="!mt-14">Sunday Weekend Program (ages 2–5)</h2>
        <p>
          <strong>{FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.label}</strong> · ${FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.priceUsd} (
          {FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.sessionsInPack} scheduled Sundays · ${FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.perSessionUsd}/Sunday effective rate)
        </p>
        <p>{FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.summary}</p>
        <p className="text-sm text-formula-frost/80">
          Season: {FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.startDateYmd} → {FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.endDateYmd}. Skipped dates:{' '}
          {FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.skippedSundayNotes.join(' · ')}. Capacity: min {FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.minEnrollment}, max{' '}
          {FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.maxCapacity} per session.
        </p>
        <ul className="text-[14px] leading-relaxed text-formula-frost/88">
          <li>
            <strong>Formula Minis (age 2)</strong> · 9:00–9:30 AM · 30 minutes
          </li>
          <li>
            <strong>Formula Minis (age 3)</strong> · 9:45–10:15 AM · 30 minutes
          </li>
          <li>
            <strong>Formula Juniors (age 4)</strong> · 10:30–11:15 AM · 45 minutes
          </li>
          <li>
            <strong>Formula Juniors (age 5)</strong> · 11:30 AM–12:15 PM · 45 minutes
          </li>
        </ul>
        <p>
          Unlike weekday Minis (ages 2–3 together), weekend sessions are <strong>split by single birth year</strong> so coaching can match developmental stage.
        </p>
        <SundayChildProgramCheckout />

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
            <Link href={MARKETING_HREF.rentals}>Field rentals</Link> · structured field time (default 2 hr blocks). Different checkout than parties.
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
