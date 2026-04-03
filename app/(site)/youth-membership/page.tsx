import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage, CtaRow } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { YOUTH_MEMBERSHIP_PRICING } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Youth membership',
  description:
    'Youth membership: 8 or 12 sessions/month, 1–12 month commitments, registration fee. Club-complementary blocks, capped density, Performance and Elite cadence.',
}

export default function YouthMembershipPage() {
  return (
  <MarketingInnerPage
  wide
  eyebrow="Youth membership"
  title="Anchor product - structure that respects club life."
  intro="Published blocks, controlled density, coaching that holds. Complements club - doesn’t replace it - with scheduling families can trust."
  >
  <h2>Club-complementary - not club-replacement</h2>
  <p>
  <strong>Accelerate beside</strong> the club: sharper habits, athletic literacy, application under constraint - without being your team’s Tue/Thu identity.
  Stay <strong>all-in on club</strong> while building what weekend coaches need: first touch, tempo, scanning, durability.
  </p>

  <h2>Age groups</h2>
  <p>
  <strong>Age-appropriate tiers</strong>, long-arc curriculum: technical clarity first; speed + cognition as capacity grows; application when habits can
  transfer. Tiering protects ratios - honest work per athlete, not one drill for everyone.
  </p>

  <h2>Published block system</h2>
  <p>
  <strong>Published blocks</strong> = known rhythms, known rotations, known ops - no surprise “open play” replacing progression. Predictability is part of
  the premium - especially with travel, school, recovery.
  </p>

  <h2>Capacity & scarcity</h2>
  <p>
  <strong>Capped density</strong>, protected coaching bandwidth, on-time finishes - serious quality control. <strong>Structural scarcity</strong>: when demand outruns
  supply, we protect standards - overcrowding dilutes development.
  </p>

  <div className="not-prose marketing-glass my-10 border border-white/[0.08] bg-white/[0.02] p-5 md:p-6">
  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Session cadence</p>
  <ul className="mt-4 list-none space-y-4 p-0 font-sans text-sm leading-relaxed text-zinc-400">
  <li className="pl-0 before:hidden">
  <strong className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-200">Performance - 2 sessions / week</strong>
  <p className="mt-2">
  Minimum rhythm for real adaptation - without unsustainable volume.
  </p>
  </li>
  <li className="pl-0 before:hidden">
  <strong className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-200">Elite - up to 3 sessions / week</strong>
  <p className="mt-2">
  Third session for consistent attenders who recover - <strong className="text-zinc-300">still under density caps.</strong>
  </p>
  </li>
  </ul>
  </div>

  <h2>Membership pricing (published)</h2>
  <p>
  Two session volumes: <strong>8 sessions per month</strong> and <strong>12 sessions per month</strong>. Monthly rate depends on commitment length.{' '}
  {YOUTH_MEMBERSHIP_PRICING.registrationFeeNote}
  </p>
  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
  Formula Skills Check ({' '}
  <Link href={MARKETING_HREF.assessment} className="text-formula-volt/90 underline-offset-2 hover:underline">
  assessments
  </Link>
  ): $200; may be waived with a minimum 6-month membership signup.
  </p>
  <div className="not-prose my-8 overflow-x-auto border border-white/[0.08]">
  <table className="w-full min-w-[480px] border-collapse text-left font-sans text-sm">
  <thead>
  <tr className="border-b border-white/[0.08] bg-white/[0.03] font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
  <th className="px-4 py-3 font-medium">Commitment</th>
  <th className="px-4 py-3 font-medium">8 sessions / mo</th>
  <th className="px-4 py-3 font-medium">12 sessions / mo</th>
  </tr>
  </thead>
  <tbody className="text-zinc-400">
  {YOUTH_MEMBERSHIP_PRICING.rows.map(row => (
  <tr key={row.term} className="border-b border-white/[0.06]">
  <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-zinc-300">{row.term}</td>
  <td className="px-4 py-3">${row.perMonth8}/mo</td>
  <td className="px-4 py-3">${row.perMonth12}/mo</td>
  </tr>
  ))}
  </tbody>
  </table>
  </div>

  <h2>No chaotic drop-ins</h2>
  <p>
  <strong>Not a warehouse.</strong> Membership = process: roster integrity, coaching continuity - standards hold; athletes stop floating between random reps.
  </p>

  <h2>Station-based development</h2>
  <p>
  <strong>Intentional stations</strong> - technical, speed, cognitive, application - specific, measurable, transferable. Legible progression for athletes,
  coaches, and <Link href={MARKETING_HREF.fpi}>The Formula</Link>.
  </p>

  <h2>Protected fields</h2>
  <p>
  Fields = <strong>protected performance real estate</strong> - not open rental noise. Surfaces for programmed development, aligned club packages,{' '}
  <strong>application</strong> (arena, <Link href={MARKETING_HREF.fridayCircuit}>Friday circuit</Link>) - habits stress-tested with structure. A <strong>system</strong>, not a hangout.
  </p>

  <h2>Flex with club reality</h2>
  <p>
  Structure ≠ rigidity for show. Blocks <strong>interlock</strong> with travel, peaks, school load; staff flex within boundaries that protect density and
  quality.
  </p>
  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
  Exact tier availability, lane placement, and pricing are confirmed at assessment - structure always beats discounting.
  </p>

  <p>
  Next: <Link href={MARKETING_HREF.assessment}>Book assessment</Link> · <Link href={MARKETING_HREF.fpi}>The Formula</Link> ·{' '}
  <Link href={MARKETING_HREF.facility}>Facility</Link>
  </p>

  <CtaRow
    primary={{ label: 'Book assessment', href: MARKETING_HREF.assessment }}
    secondary={{ label: 'Membership waitlist', waitlist: true }}
  />
  </MarketingInnerPage>
  )
}
