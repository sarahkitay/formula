import type { Metadata } from 'next'
import Link from 'next/link'
import { FpiPillarsInteractive } from '@/components/marketing/fpi-pillars-interactive'
import { MarketingInnerPage, CtaRow } from '@/components/marketing/marketing-inner'
import { FormulaLiveChamber } from '@/components/marketing/formula-live-chamber'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export const metadata: Metadata = {
  title: 'The Formula',
  description:
    'How Formula measures performance: speed, agility, decisions, technique, and application - weighted by age, tested on advanced protocols, advanced over time with reassessment.',
}

const PILLARS = [
  {
    title: 'Speed & explosiveness',
    description:
      'Acceleration, top speed where appropriate, and repeatability - captured with timing-based protocols and game-relevant distances.',
  },
  {
    title: 'Agility & change of direction',
    description:
      'Braking, re-acceleration, and multi-directional mobility that show up in duels and tight spaces.',
  },
  {
    title: 'Decision-making & cognitive tempo',
    description:
      'Scanning, choice speed, and risk discipline under constraint - the bridge between "busy" and effective.',
  },
  {
    title: 'Technical execution',
    description: 'First touch, distribution, duels - repeatability as pressure rises.',
  },
  {
    title: 'Game application',
    description: 'Transfer into constrained games and circuit scenarios - execution vs live defense.',
  },
  {
    title: 'Consistency & coachability',
    description:
      'Attendance rhythm, training intent, adaptability - what makes coaching stick week to week.',
  },
] as const

export default function TheFormulaPage() {
  return (
    <MarketingInnerPage
      eyebrow="The Formula"
      title="How we score performance <br> and how you move up."
      intro="The Formula is our internal performance model: a weighted blend of speed, agility, decision-making, technique, application, and consistency. It is measured, not guessed - through standardized testing, facility-grade capture where equipped, and professional coaching judgment. Below, the model wakes like an instrument being tuned: inputs, weights, composite, calm."
      wide
    >
      <FormulaLiveChamber />

      <h2>What “The Formula” is</h2>
      <p>
        A <strong>developmental index</strong> for placement and progression: shared language for coaches, programming, and families. It stays{' '}
        <strong>internal and supportive</strong> - built to coach athletes, not to publish youth leaderboards.
      </p>

      <h2>How we calculate it</h2>
      <ol>
        <li>
          <strong>Domain scores:</strong> each pillar (speed, agility, decisions, technical, application, plus consistency) is scored from{' '}
          <strong>structured tasks</strong> in our environment - not a single “trick drill” and not vibes-only.
        </li>
        <li>
          <strong>Measurement stack:</strong> protocols combine <strong>timing and reaction tasks</strong>, <strong>movement and agility challenges</strong>,{' '}
          <strong>ball-execution under constraint</strong>, and <strong>small-sided / circuit observation</strong>. As we deploy additional hardware and software
          (e.g. electronic timing, motion and reaction analytics, precision repetition tools), those layers feed the same domains - always reviewed by
          staff so numbers serve coaching, not the reverse.
        </li>
        <li>
          <strong>Age-based weights:</strong> we apply <strong>different weights by age band</strong> so U10 isn’t scored like U16 - technical and safe athletic literacy
          anchor early; cognitive and tactical influence grows with maturity; durability and consistency stay in the mix.
        </li>
        <li>
          <strong>Composite:</strong> weighted inputs produce an internal profile used for <strong>lane placement</strong>, <strong>session emphasis</strong>, and{' '}
          <strong>readiness</strong> for application settings like the <Link href={MARKETING_HREF.fridayCircuit}>Friday circuit</Link>.
        </li>
      </ol>

      <h2>How each athlete advances</h2>
      <ul>
        <li>
          <strong>Find the limiter:</strong> coaching identifies which domain caps performance right now (speed vs decisions vs technique, etc.).
        </li>
        <li>
          <strong>Train the block plan:</strong> weekly programming stresses the right stimulus - stations, speed exposure, cognitive constraints, application
          reps - in <Link href={MARKETING_HREF.youthMembership}>structured membership blocks</Link>.
        </li>
        <li>
          <strong>Precision bursts:</strong> when one pillar is clearly the bottleneck, <Link href={MARKETING_HREF.clinics}>clinics</Link> compress learning time
          without random volume.
        </li>
        <li>
          <strong>Re-test on cadence:</strong> baseline plus default <strong>6-month reassessment</strong> (and off-cycle when injury, growth, or a tier change
          demands it) confirms adaptation and updates priorities.
        </li>
        <li>
          <strong>Application gate:</strong> higher-demand environments open when readiness and behavior support safe, productive load - not when a single
          number says so in isolation.
        </li>
      </ul>

      <div className="not-prose marketing-glass my-10 border border-white/[0.08] bg-white/[0.02] p-5 md:p-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Reassessment rhythm</p>
        <ul className="mt-4 list-none space-y-3 p-0 font-sans text-sm leading-relaxed text-zinc-400">
          <li className="pl-0 before:hidden">
            <strong className="text-zinc-300">Default:</strong> full Formula review every <strong className="text-zinc-300">6 months</strong> - enough adaptation to show, soon
            enough to correct course.
          </li>
          <li className="pl-0 before:hidden">
            <strong className="text-zinc-300">Off-cycle:</strong> return-to-play, tier transitions, growth spurts, or stalled progress - clinical triggers only.
          </li>
        </ul>
      </div>

      <h2>The six pillars (detail)</h2>
      <FpiPillarsInteractive
        intro="Six dimensions describe the full player. Together they feed the weighted composite described above."
        pillars={PILLARS}
      />

      <h2>Reporting & families</h2>
      <p>
        Families receive <strong>cohort context</strong> and <strong>trend</strong> - developmental intelligence, not a public ranking product. The athlete is always more than
        a snapshot; the snapshot is a coaching tool.
      </p>

      <h2>Not a leaderboard</h2>
      <p>
        The Formula is <strong>not a public scoreboard</strong>. Stress behavior in structured environments like the{' '}
        <Link href={MARKETING_HREF.fridayCircuit}>Friday circuit</Link> - not permanent online rankings for kids.
      </p>

      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
        Internal systems may still reference legacy shorthand “FPI” in staff tools - on the public site we call it The Formula.
      </p>

      <CtaRow
        primary={{ label: 'Book assessment', href: MARKETING_HREF.bookAssessmentPortal }}
        secondary={{ label: 'Clinics', href: MARKETING_HREF.clinics }}
      />
    </MarketingInnerPage>
  )
}
