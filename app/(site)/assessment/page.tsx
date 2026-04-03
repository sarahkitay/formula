import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage, CtaRow } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { FORMULA_SKILLS_CHECK } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Assessments · Formula Skills Check',
  description:
    'Formula Skills Check: passing, ball control, decisions, speed, strength, and agility. $200 assessment; fee may be waived with 6-month membership. Baseline + 6-month rhythm.',
}

export default function AssessmentPage() {
  return (
    <MarketingInnerPage
      wide
      eyebrow="Assessments"
      title="Formula Skills Check"
      intro={`${FORMULA_SKILLS_CHECK.name}: ${FORMULA_SKILLS_CHECK.priceUsd} per assessment. ${FORMULA_SKILLS_CHECK.waiverSummary}`}
    >
      <h2>What we measure</h2>
      <p>
        Essential markers that feed honest placement and coaching priorities inside Formula (see also{' '}
        <Link href={MARKETING_HREF.fpi}>The Formula</Link>):
      </p>
      <ul>
        {FORMULA_SKILLS_CHECK.measures.map(skill => (
          <li key={skill}>
            <strong>{skill}</strong>
          </li>
        ))}
      </ul>

      <div className="not-prose marketing-glass my-10 border border-white/[0.08] bg-white/[0.02] p-5 md:p-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Fee</p>
        <p className="mt-3 font-mono text-2xl font-semibold tracking-tight text-zinc-100">${FORMULA_SKILLS_CHECK.priceUsd}</p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{FORMULA_SKILLS_CHECK.waiverSummary}</p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-600">
          Final terms confirmed at booking and membership signup.
        </p>
      </div>

      <h2>What assessments do</h2>
      <p>
        <strong>Coachable snapshot</strong>: technical samples, athletic markers, cognitive tempo, early application and fit notes. Not internet ranking -{' '}
        <strong>placement</strong> inside Formula.
      </p>

      <h2>Baseline Formula assessments</h2>
      <p>
        <strong>Baseline</strong> starts <Link href={MARKETING_HREF.fpi}>The Formula</Link>: age-weighted pillars, limiters, honest first plan - lane, expectations,
        what “better” looks like next block. Structured tasks and observation - not one trick drill deciding a future.
      </p>

      <h2>6-month reassessments</h2>
      <p>
        Default: <strong>full Formula review every six months</strong> - adaptation visible, course correctable. Validates emphasis, updates priorities, fresh
        reporting.
      </p>

      <h2>Off-cycle assessments</h2>
      <p>
        <strong>Off-cycle</strong> when calendar is not enough - return-to-play, tier move, growth spurt, diagnostic stall. <strong>Clinical</strong>, not casual.
      </p>

      <div className="not-prose my-10 overflow-x-auto border border-white/[0.08]">
        <table className="w-full min-w-[520px] border-collapse text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.03] font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
              <th className="px-4 py-3 font-medium">Assessment type</th>
              <th className="px-4 py-3 font-medium">Role in the system</th>
            </tr>
          </thead>
          <tbody className="text-zinc-400">
            <tr className="border-b border-white/[0.06]">
              <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-300">Baseline Formula</td>
              <td className="px-4 py-3 leading-relaxed">
                Establishes pillar baselines, placement, and first priorities - entry to structured programming.
              </td>
            </tr>
            <tr className="border-b border-white/[0.06]">
              <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-300">6-month reassessment</td>
              <td className="px-4 py-3 leading-relaxed">Updates The Formula profile, confirms coaching emphasis, publishes next-phase guidance for families.</td>
            </tr>
            <tr className="border-b border-white/[0.06]">
              <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-300">Off-cycle</td>
              <td className="px-4 py-3 leading-relaxed">Event-driven checkpoint when change velocity demands a reset - injury, tier, growth, diagnostic.</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-300">Team / club block</td>
              <td className="px-4 py-3 leading-relaxed">Coordinated roster throughput with Formula ops - same rigor, scheduled throughput.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Team assessment bookings</h2>
      <p>
        <strong>Structured windows</strong> for rosters: arrival pattern, consistent tasks, disciplined reporting - comparable signal, not a crowded combine. Book
        against inventory and staff (often near <Link href={MARKETING_HREF.rentals}>rentals</Link>). Inquire: size, ages, outcomes.
      </p>

      <h2>Reporting timeline</h2>
      <p>
        <strong>After the session</strong> should never be a black hole. Representative cadence below - confirm SLAs in registration and portal.
      </p>
      <div className="not-prose marketing-glass my-8 border border-white/[0.08] bg-white/[0.02] p-5 md:p-6">
        <ul className="list-none space-y-4 p-0 text-sm leading-relaxed text-zinc-400">
          <li className="border-l border-formula-volt/35 pl-4 before:hidden">
            <strong className="text-zinc-300">Same day:</strong> athlete thank-you, recovery cue, what is next - no mystery grading.
          </li>
          <li className="border-l border-formula-volt/35 pl-4 before:hidden">
            <strong className="text-zinc-300">~48–72h:</strong> internal digest - notes, clips, pillar draft QC.
          </li>
          <li className="border-l border-formula-volt/35 pl-4 before:hidden">
            <strong className="text-zinc-300">~5–7 biz days:</strong> family summary - priorities, next block, lane / <Link href={MARKETING_HREF.clinics}>clinic</Link> / revisit.
          </li>
          <li className="border-l border-formula-volt/35 pl-4 before:hidden">
            <strong className="text-zinc-300">Portal:</strong> artifacts live in <strong>parent portal</strong> when applicable - no lost threads.
          </li>
        </ul>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-600">
          Adjust dates for peak volume or specialty testing - communication is part of the premium product.
        </p>
      </div>

      <h2>Scientific and youth-sensitive</h2>
      <p>
        <strong>Respectful</strong> measurement: age-right language, pacing, breaks, why without tension. Protocol is science; tone is care. Direct with parents;
        gentle with kids; honest always.
      </p>

      <h2>Book an assessment</h2>
      <p>
        <strong>Parent portal</strong> when slots open - returning sign in; new accounts same path.
      </p>
      <p>
        Pathway after placement: <Link href={MARKETING_HREF.youthMembership}>Youth membership</Link> · <Link href={MARKETING_HREF.fpi}>The Formula</Link> ·{' '}
        <Link href={MARKETING_HREF.fridayCircuit}>Friday circuit</Link>
      </p>

      <CtaRow
        primary={{ label: 'Book assessment', href: '/login?role=parent' }}
        secondary={{ label: 'Youth membership pricing', href: MARKETING_HREF.youthMembership }}
      />
    </MarketingInnerPage>
  )
}
