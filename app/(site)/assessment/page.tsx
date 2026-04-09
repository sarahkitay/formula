import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage, CtaRow } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { FORMULA_SKILLS_CHECK } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Assessments · Formula Skills Check',
  description:
    'Formula Skills Check: one-hour assessment across six performance pillars. $200; fee waived with qualifying membership. Baseline, 6-month reassessment, and team blocks.',
}

export default function AssessmentPage() {
  return (
    <MarketingInnerPage
      wide
      eyebrow="Assessments"
      title="Formula Skills Check"
      intro={`Know exactly where your athlete stands. Build from there. The Formula Skills Check is a one-hour, data-driven assessment that measures your athlete across six performance pillars and gives you real scores, not impressions. Every athlete who trains at Formula starts here. Assessment results determine placement, program fit, and the individual training focus that drives improvement. $${FORMULA_SKILLS_CHECK.priceUsd} · One hour · Parent portal report within 5 to 7 business days. ${FORMULA_SKILLS_CHECK.waiverSummary}`}
    >
      <h2>What we measure</h2>
      <p>
        Six pillars. Objective scores. No guesswork. Every task in the assessment is standardized, run the same way for every athlete, every time. Our
        technology captures the data. Our coaches review it. You get the scores. See also{' '}
        <Link href={MARKETING_HREF.fpi}>The Formula</Link>.
      </p>
      <ul>
        <li>
          <strong>Speed and explosiveness:</strong> timed on the Speed Track. Linear acceleration, first step, and repeat sprint performance with and without
          the ball.
        </li>
        <li>
          <strong>Agility and change of direction:</strong> measured through structured movement tasks. Lateral quickness, deceleration, and directional
          efficiency.
        </li>
        <li>
          <strong>Decision-making and cognitive speed:</strong> assessed on the Double Speed Court. Reaction time, scanning, and correct choices under pressure.
        </li>
        <li>
          <strong>Technical execution:</strong> ball control, passing, receiving, and manipulation assessed through Footbot and structured ball tasks.
        </li>
        <li>
          <strong>Game application:</strong> how skills transfer in applied scenarios, small-sided situations, and circuit exercises designed to reflect game
          demands.
        </li>
        <li>
          <strong>Consistency and coachability:</strong> response to instruction, effort under repeated stress, and performance across the full session.
        </li>
      </ul>

      <h2>Your athlete&apos;s scores</h2>
      <p>
        After the assessment, each pillar receives an individual score. Scores are age-weighted, so your U10 is evaluated against U10 standards, not U16.
        Together, the scores build a complete Formula performance profile.
      </p>
      <p>
        You see everything in your parent portal dashboard: individual pillar scores, an overall profile, and a recommended training focus based on what&apos;s
        limiting your athlete&apos;s overall performance right now.
      </p>
      <p>
        This is how we know whether to prioritize speed sessions, decision-making reps, or technical work. Not opinion. Data.
      </p>

      <div className="not-prose marketing-glass mt-14 mb-12 border border-white/[0.08] bg-white/[0.02] p-5 md:mt-16 md:mb-14 md:p-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Fee</p>
        <p className="mt-3 font-mono text-2xl font-semibold tracking-tight text-zinc-100">${FORMULA_SKILLS_CHECK.priceUsd}</p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{FORMULA_SKILLS_CHECK.waiverSummary}</p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-600">
          Final terms confirmed at booking and membership signup.
        </p>
      </div>

      <h2>What happens after</h2>
      <ul>
        <li>
          <strong>Assessment completed:</strong> one hour, all six pillars.
        </li>
        <li>
          <strong>Same day:</strong> summary note in your portal: what was covered, what to expect next.
        </li>
        <li>
          <strong>48 to 72 hours:</strong> internal review and scoring finalized.
        </li>
        <li>
          <strong>5 to 7 business days:</strong> full report in your parent portal: pillar scores, overall profile, training priorities.
        </li>
        <li>
          <strong>Placement confirmed:</strong> your athlete is placed into the right program tier and training plan.
        </li>
        <li>
          <strong>Training begins:</strong> sessions target the specific limiter identified in your athlete&apos;s scores.
        </li>
        <li>
          <strong>6-month reassessment:</strong> scores are retested, progress is measured, plan is updated.
        </li>
      </ul>

      <h2>Types of assessments</h2>
      <div className="not-prose mt-8 mb-12 overflow-x-auto border border-white/[0.08] md:mb-14">
        <table className="w-full min-w-[520px] border-collapse text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.03] font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
              <th className="px-4 py-3 font-medium">Assessment type</th>
              <th className="px-4 py-3 font-medium">Role in the system</th>
            </tr>
          </thead>
          <tbody className="text-zinc-400">
            <tr className="border-b border-white/[0.06]">
              <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-300">Baseline Formula assessment</td>
              <td className="px-4 py-3 leading-relaxed">
                First-time athletes. Establishes pillar scores, confirms placement, and sets the first training priorities. The starting point for all Formula
                programming.
              </td>
            </tr>
            <tr className="border-b border-white/[0.06]">
              <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-300">6-month reassessment</td>
              <td className="px-4 py-3 leading-relaxed">
                Full re-score across all six pillars. Validates what&apos;s improved, updates training emphasis, and produces a new report for families.
              </td>
            </tr>
            <tr className="border-b border-white/[0.06]">
              <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-300">Off-cycle assessment</td>
              <td className="px-4 py-3 leading-relaxed">
                For athletes returning from injury, experiencing significant growth, or moving up a training tier. Scheduled when it&apos;s clinically appropriate,
                not just on a calendar.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-300">Team / club assessment block</td>
              <td className="px-4 py-3 leading-relaxed">
                Structured group assessment windows for rosters. Same standardized protocol, same data capture, coordinated scheduling. Inquire for group pricing
                and availability.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>For teams and clubs</h2>
      <p>
        Formula offers coordinated assessment blocks for club rosters and school teams: the same standardized protocol, scaled for groups. Results are
        individual (each athlete receives their own profile) and delivered on the same reporting timeline.
      </p>
      <p>Contact us to discuss group size, age range, and scheduling against our inventory.</p>

      <h2>A note on how we work with kids</h2>
      <p>
        Assessments are structured and data-driven, but we don&apos;t forget there&apos;s a kid doing them. Our staff explains every task before it starts, takes
        breaks when needed, and communicates results directly and clearly to parents without putting pressure on athletes. Honest with families. Supportive with
        kids.
      </p>

      <CtaRow
        primary={{ label: 'Book an assessment', href: MARKETING_HREF.bookAssessmentPortal }}
        secondary={{ label: 'Youth membership and pricing', href: MARKETING_HREF.youthMembership }}
      />
      <p className="not-prose mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist">
        Already have an account?{' '}
        <Link href="/login?role=parent" className="text-formula-volt underline-offset-2 hover:underline">
          Parent portal
        </Link>
      </p>
    </MarketingInnerPage>
  )
}
