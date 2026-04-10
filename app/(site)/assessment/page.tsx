import type { Metadata } from 'next'
import Link from 'next/link'
import { FpiPillarsInteractive } from '@/components/marketing/fpi-pillars-interactive'
import { FacilityMeasurementStations } from '@/components/marketing/facility-measurement-stations'
import { MarketingInnerPage, CtaRow } from '@/components/marketing/marketing-inner'
import {
  BeforeAfterProgress,
  FeelVsDataStrip,
  FormulaStoryFramework,
  ParentJourneyBlock,
  SampleMetricsPanel,
} from '@/components/marketing/scientific-story-blocks'
import { ASSESSMENT_PILLARS } from '@/lib/marketing/formula-pillars'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { FORMULA_SKILLS_CHECK } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Assessments · Formula Skills Check',
  description:
    'One-hour Formula Skills Check: six pillars, real scores in your parent portal. $200; fee waived with qualifying membership.',
}

export default function AssessmentPage() {
  return (
    <MarketingInnerPage
      wide
      eyebrow="Assessments"
      title="Formula Skills Check"
      intro="One standardized hour across six performance pillars. You get real scores and a clear training focus in your parent portal, not in a coach's hunch."
    >
      <div className="not-prose space-y-10 md:space-y-12">
        <FeelVsDataStrip />
        <FormulaStoryFramework />
        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <SampleMetricsPanel className="h-full" />
          <div className="flex flex-col justify-center gap-6">
            <BeforeAfterProgress />
            <p className="text-[13px] leading-relaxed text-formula-frost/75">
              Illustrative bars: your report uses age-weighted pillar scores and a recommended focus tied to what&apos;s limiting performance right now.
            </p>
          </div>
        </div>
        <ParentJourneyBlock />
      </div>

      <h2>What we measure</h2>
      <p>
        Six pillars. Same protocol every athlete. Technology captures the data; coaches interpret it. Details in{' '}
        <Link href={MARKETING_HREF.fpi}>The Formula</Link>.
      </p>

      <FpiPillarsInteractive
        intro="Tap or hover a pillar for how it shows up in the Skills Check."
        pillars={ASSESSMENT_PILLARS}
      />

      <h2>How it works</h2>
      <ul className="!mt-6">
        <li>
          <strong className="text-formula-paper">Same day:</strong> portal note on what ran and what comes next.
        </li>
        <li>
          <strong className="text-formula-paper">48–72 hours:</strong> scoring finalized internally.
        </li>
        <li>
          <strong className="text-formula-paper">5–7 business days:</strong> full pillar scores, profile, and training priorities in your portal.
        </li>
        <li>
          <strong className="text-formula-paper">Placement:</strong> program tier and plan aligned to your scores.
        </li>
        <li>
          <strong className="text-formula-paper">6-month reassessment:</strong> retest, compare, update the plan.
        </li>
      </ul>

      <div className="not-prose marketing-glass mt-14 mb-12 border border-white/[0.08] bg-white/[0.02] p-5 md:mt-16 md:mb-14 md:p-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Pricing</p>
        <p className="mt-3 font-mono text-2xl font-semibold tracking-tight text-zinc-100">${FORMULA_SKILLS_CHECK.priceUsd}</p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{FORMULA_SKILLS_CHECK.waiverSummary}</p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-600">
          Final terms confirmed at booking and membership signup.
        </p>
      </div>

      <h2>Assessment types</h2>
      <div className="not-prose mt-8 mb-12 overflow-x-auto border border-white/[0.08] md:mb-14">
        <table className="w-full min-w-[520px] border-collapse text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.03] font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody className="text-zinc-400">
            <tr className="border-b border-white/[0.06]">
              <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-300">Baseline</td>
              <td className="px-4 py-3 leading-relaxed">
                First visit: pillar scores, placement, first priorities. Everyone starts here.
              </td>
            </tr>
            <tr className="border-b border-white/[0.06]">
              <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-300">6-month reassessment</td>
              <td className="px-4 py-3 leading-relaxed">Full re-score; plan and report refresh.</td>
            </tr>
            <tr className="border-b border-white/[0.06]">
              <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-300">Off-cycle</td>
              <td className="px-4 py-3 leading-relaxed">Injury return, growth spurt, or tier change when it makes sense, not just on a calendar.</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-300">Team / club block</td>
              <td className="px-4 py-3 leading-relaxed">Roster windows; same protocol; individual profiles. Ask for group pricing.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Where the data comes from</h2>
      <p>
        Stations at our facility feed the assessment. Full tour:{' '}
        <Link href={MARKETING_HREF.facility}>Facility</Link>.
      </p>
      <FacilityMeasurementStations className="mt-4 md:mt-5" />

      <h2>For teams and clubs</h2>
      <p>
        Coordinated assessment blocks: same protocol at scale. Each athlete still gets an individual profile on the standard reporting timeline. Contact us for
        group size, ages, and scheduling.
      </p>

      <h2>Working with kids</h2>
      <p>
        Tasks are explained before they start; breaks when needed. Results go to parents clearly: honest with families, supportive with athletes.
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
