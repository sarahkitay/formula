import type { Metadata } from 'next'
import Link from 'next/link'
import { FpiPillarsInteractive } from '@/components/marketing/fpi-pillars-interactive'
import { MarketingInnerPage, CtaRow } from '@/components/marketing/marketing-inner'
import { FormulaLiveChamber } from '@/components/marketing/formula-live-chamber'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export const metadata: Metadata = {
  title: 'The Formula',
  description:
    'How Formula Soccer Center measures performance: six pillars, age-weighted scoring, reassessment cadence, and family reporting in the parent portal.',
}

const PILLARS = [
  {
    title: 'Speed and explosiveness',
    description:
      'First step, separation, repeat sprint capacity. Measured on our Speed Track with and without the ball.',
  },
  {
    title: 'Agility and change of direction',
    description: 'Lateral movement, deceleration, and directional efficiency. Assessed through structured movement tasks.',
  },
  {
    title: 'Decision-making and cognitive speed',
    description:
      'Reading the field, scanning under pressure, choosing correctly and quickly. Measured on our Double Speed Court.',
  },
  {
    title: 'Technical execution',
    description: 'Passing, receiving, control, and ball manipulation under structured conditions. Measured with and by Footbot.',
  },
  {
    title: 'Game application',
    description:
      'How skills transfer when it matters, in small-sided play, circuit scenarios, and applied pressure situations.',
  },
  {
    title: 'Consistency and coachability',
    description: 'Effort, response to feedback, and performance under repeated stress. Evaluated by coaching staff across sessions.',
  },
] as const

export default function TheFormulaPage() {
  return (
    <MarketingInnerPage
      eyebrow="The Formula"
      title="How we measure your player. <br> How we make them better."
      intro={`The Formula is Formula Soccer Center's performance scoring system. It's how we assess every athlete, track their progress, and build a training plan that actually targets what's holding them back. It's not a vibe. It's not a coach's opinion. It's objective data, collected through structured assessments and advanced facility technology, reviewed and applied by our coaching staff.`}
      wide
    >
      <FormulaLiveChamber />

      <h2>The six pillars</h2>
      <p>
        Six skills. One complete picture. Every athlete is scored across six measurable domains. Together, those scores create a full performance profile, used
        for placement, programming, and tracking improvement over time.
      </p>

      <FpiPillarsInteractive
        intro="Tap a pillar for how we measure it on the floor."
        pillars={PILLARS}
      />

      <h2>How scoring works</h2>
      <p>Objective scores. Not a gut feeling.</p>
      <p>
        After your athlete&apos;s assessment, each of the six pillars receives a score. Those scores are weighted by age, because a U10 player shouldn&apos;t be
        evaluated the same way as a U16, and combined into an overall Formula performance profile.
      </p>
      <p>Here&apos;s what that looks like in practice:</p>
      <ol>
        <li>
          Your athlete completes a structured, one-hour assessment: standardized tasks across all six pillars, using our timing technology, Footbot, the Speed
          Track, and the Double Speed Court.
        </li>
        <li>
          Scores are calculated, not estimated. Our technology captures the data; our coaches review it for context.
        </li>
        <li>You receive a full report in your parent portal: individual scores for each pillar, plus an overall profile.</li>
        <li>
          A personalized training plan is built, targeting the specific pillar that&apos;s limiting your athlete&apos;s overall performance first.
        </li>
        <li>Progress is re-measured every 6 months, so you can see exactly how far they&apos;ve come and what comes next.</li>
      </ol>

      <h2>Why it matters</h2>
      <p>Every athlete has a limiter. Most programs ignore it.</p>
      <p>
        A fast player who can&apos;t make decisions under pressure will hit a ceiling. A technically gifted player with no explosive speed gets bypassed at the
        next level. A great decision-maker who can&apos;t execute technically can&apos;t translate it to the game.
      </p>
      <p>
        The Formula finds the limiter, the specific skill holding your athlete back, and builds training around fixing it. When that pillar improves, the whole
        score moves.
      </p>
      <p>That&apos;s how progress works. That&apos;s how Formula works.</p>

      <h2>Family reporting</h2>
      <p>You&apos;ll always know where your athlete stands.</p>
      <div className="not-prose marketing-glass my-10 border border-white/[0.08] bg-white/[0.02] p-5 md:p-6">
        <ul className="list-none space-y-3 p-0 font-sans text-sm leading-relaxed text-zinc-400">
          <li className="pl-0 before:hidden">
            <strong className="text-zinc-300">Same day:</strong> what was covered, what comes next. No mystery.
          </li>
          <li className="pl-0 before:hidden">
            <strong className="text-zinc-300">Within a week:</strong> full pillar scores and priority report in your parent portal.
          </li>
          <li className="pl-0 before:hidden">
            <strong className="text-zinc-300">Every 6 months:</strong> full reassessment, updated scores, updated plan.
          </li>
          <li className="pl-0 before:hidden">
            <strong className="text-zinc-300">Off-cycle:</strong> if your athlete gets injured, goes through a growth spurt, or moves up a tier, we reassess when
            it matters, not just on schedule.
          </li>
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          The parent portal keeps everything in one place. No lost emails. No wondering.
        </p>
      </div>

      <p>
        The Formula is <strong>not a public scoreboard</strong>. It is an internal coaching and family reporting tool. We stress behavior in structured
        environments like the <Link href={MARKETING_HREF.fridayCircuit}>Friday Youth Game Circuit</Link>, not permanent online rankings for kids.
      </p>

      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
        Internal systems may still reference legacy shorthand &quot;FPI&quot; in staff tools. On the public site we call it The Formula.
      </p>

      <CtaRow
        primary={{ label: 'Book an assessment', href: MARKETING_HREF.bookAssessmentPortal }}
        secondary={{ label: 'Formula Skills Check details', href: MARKETING_HREF.assessment }}
      />
    </MarketingInnerPage>
  )
}
