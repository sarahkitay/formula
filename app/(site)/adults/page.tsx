import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage, CtaRow } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export const metadata: Metadata = {
  title: 'Adult programming',
  description:
    'State-of-the-art adult pickup + leagues: hosted format, division structure, seasonal/annual paths - intensity with control.',
}

export default function AdultsPage() {
  return (
  <MarketingInnerPage
  eyebrow="Adult programming"
  title="Adult soccer - same standard as the building."
  intro="Clocks, rules, staff - real games without rec-center chaos eroding fields and bodies."
  >
  <h2>Adult pickup</h2>
  <p>
  <strong>Hosted format</strong> - check-in, balanced teams, tempo - minutes worth showing up for. Formula as a <strong>system</strong>: on-time starts, defined lengths,
  intervention when play slips.
  </p>

  <div className="not-prose marketing-glass my-10 border border-white/[0.08] bg-white/[0.02] p-5 md:p-6">
  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Pickup rules - summary</p>
  <ul className="mt-4 list-none space-y-2.5 p-0 font-sans text-sm leading-relaxed text-zinc-400">
  <li className="pl-0 before:hidden">
  <strong className="text-zinc-300">Check-in:</strong> posted windows; staff-balanced rotation - no permanent “winner stays.”
  </li>
  <li className="pl-0 before:hidden">
  <strong className="text-zinc-300">Clock:</strong> segments, quick restarts, subs - flow protected.
  </li>
  <li className="pl-0 before:hidden">
  <strong className="text-zinc-300">Safety:</strong> fouls, recklessness, abuse - standard holds when tired.
  </li>
  <li className="pl-0 before:hidden">
  <strong className="text-zinc-300">Facility:</strong> gear, sidelines, youth adjacency - non-negotiable.
  </li>
  </ul>
  </div>

  <h2>Adult leagues</h2>
  <p>
  <strong>Season integrity</strong>: plan-able schedules, skill-respecting matchups, clear comms on weather/facility shifts - no rumor chain.
  </p>

  <h2>League philosophy</h2>
  <p>
  <strong>Honest competition</strong> - fewer blowouts, fewer sandbag games. Table matters for motivation, not youth sold out to ego. Captains + staff keep
  nights playable: <strong>intensity with control</strong>.
  </p>

  <h2>Division structure</h2>
  <p>
  <strong>Protect the night</strong>: fewer mismatches, clear expectations, room to rebalance cohorts. Placement = fair games - not permanent labels.
  </p>

  <h2>Seasonal & annual</h2>
  <p>
  <strong>Seasonal</strong> league + pickup bundles; <strong>annual</strong> for continuity, billing, priority when tight. Calibrated vs youth blocks - adult stays{' '}
  <strong>additive</strong>, not cannibal.
  </p>

  <h2>Controlled environment</h2>
  <p>
  Same bar as youth: <strong>on-time</strong>, escalation when behavior slips, no arguments owning the building. <strong>Respectful intensity</strong> - hard where allowed,
  zero tolerance on safety + dignity.
  </p>

  <h2>Additive - not dominant</h2>
  <p>
  Brand stays <strong>youth-first</strong>. Adults use governed windows, respect sightlines + schedules - never “adult hour” as default. Pros on behavior;
  youth families never feel like guests here.
  </p>

  <p>
  Group training or recurring field blocks: <Link href={MARKETING_HREF.rentals}>Structured field rentals</Link> (default 2 hr). Large hosted blocks:{' '}
  <Link href={MARKETING_HREF.events}>Events</Link>. Context: <Link href={MARKETING_HREF.facility}>Facility</Link>. Youth:{' '}
  <Link href={MARKETING_HREF.youthMembership}>Membership</Link>.
  </p>

  <CtaRow primary={{ label: 'Facility', href: MARKETING_HREF.facility }} secondary={{ label: 'Field rentals', href: MARKETING_HREF.rentals }} />
  </MarketingInnerPage>
  )
}
