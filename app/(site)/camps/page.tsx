import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage, CtaRow } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export const metadata: Metadata = {
  title: 'Camps',
  description:
    'State-of-the-art summer + holiday camps: full-facility structured days, age tiers, camp-to-membership path - not daycare soccer.',
}

function ScheduleTable() {
  const rows: [string, string][] = [
  ['Summer immersion', 'Mon–Fri weekly blocks (select weeks), full-day schedule; half-day option where offered.'],
  ['Holiday camps', 'Compact 3–5 day intensives during school breaks (e.g., winter, spring) - same day architecture, compressed calendar.'],
  ['Drop-off / pickup', 'Posted arrival and dismissal windows; staffed check-in - no unsupervised lobby clustering.'],
  ['Capacity', 'Enrollment capped by age band and coaching ratio - scarcity protects quality (waitlist when full).'],
  ]
  return (
  <div className="not-prose my-10 overflow-x-auto border border-white/[0.08]">
  <table className="w-full min-w-[520px] border-collapse text-left font-sans text-sm">
  <thead>
  <tr className="border-b border-white/[0.08] bg-white/[0.03] font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
  <th className="px-4 py-3 font-medium">Offering</th>
  <th className="px-4 py-3 font-medium">Typical schedule shape</th>
  </tr>
  </thead>
  <tbody className="text-zinc-400">
  {rows.map(([a, b]) => (
  <tr key={a} className="border-b border-white/[0.06] last:border-0">
  <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-300">{a}</td>
  <td className="px-4 py-3 leading-relaxed">{b}</td>
  </tr>
  ))}
  </tbody>
  </table>
  </div>
  )
}

function PricingTable() {
  const rows: [string, string, string][] = [
  ['Full week (summer)', '5 structured days · full facility rotation', '$XXX - early-bird window where posted'],
  ['Holiday intensive', '3–5 day block · same coaching density', '$XXX–$XXX by length'],
  ['Single day (if offered)', 'Subject to capacity · may be waitlist-only in peak weeks', '$XXX per day'],
  ['Member / sibling', 'Formula member household adjustments where applicable', 'Posted at registration'],
  ]
  return (
  <div className="not-prose my-10 overflow-x-auto border border-white/[0.08]">
  <table className="w-full min-w-[520px] border-collapse text-left font-sans text-sm">
  <thead>
  <tr className="border-b border-white/[0.08] bg-white/[0.03] font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
  <th className="px-4 py-3 font-medium">Tier</th>
  <th className="px-4 py-3 font-medium">Includes</th>
  <th className="px-4 py-3 font-medium">Pricing structure</th>
  </tr>
  </thead>
  <tbody className="text-zinc-400">
  {rows.map(([a, b, c]) => (
  <tr key={a} className="border-b border-white/[0.06] last:border-0">
  <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-300">{a}</td>
  <td className="px-4 py-3 leading-relaxed">{b}</td>
  <td className="px-4 py-3 leading-relaxed">{c}</td>
  </tr>
  ))}
  </tbody>
  </table>
  </div>
  )
}

function SampleDay() {
  const blocks: [string, string][] = [
  ['8:30 - Arrival & check-in', 'Staggered entry, name tags, equipment check, coach briefing - session clock starts clean.'],
  ['9:00 - Block 1 · Technical + ball mastery', 'Stations on fields / courts; high repetition, immediate correction - not “stations for show.”'],
  ['10:15 - Fuel & reset', 'Hydration, snack (bring or purchase per posted policy), bathroom - protected buffer before speed work.'],
  ['10:45 - Block 2 · Athletic development', 'Speed, change of direction, durability basics - age-appropriate volume and rest.'],
  ['12:00 - Lunch & recovery', 'Quiet recovery window; staff-supervised - energy regulated for afternoon quality.'],
  ['13:00 - Block 3 · Cognitive / small-sided', 'Scanning, constraints, coachable game scenarios tied to morning themes.'],
  ['14:30 - Block 4 · Application slice', 'Controlled competitive moments - tempo rules, debrief, behavioral standards.'],
  ['15:45 - Wrap & parent handoff', 'Coach summary, pickup window discipline, lost-and-found sweep - building restored to standard.'],
  ]
  return (
  <div className="not-prose marketing-glass my-10 border border-white/[0.08] bg-white/[0.02] p-5 md:p-6">
  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Sample full day (representative)</p>
  <p className="mt-2 text-xs text-zinc-500">Exact times adjust by season, age band, and facility load - published in the camp packet at registration.</p>
  <ul className="mt-6 list-none space-y-4 p-0">
  {blocks.map(([t, d]) => (
  <li key={t} className="border-l border-formula-volt/30 pl-4 before:hidden">
  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-200">{t}</p>
  <p className="mt-1 text-sm leading-relaxed text-zinc-400">{d}</p>
  </li>
  ))}
  </ul>
  </div>
  )
}

function AgeGrouping() {
  const tiers: [string, string][] = [
  ['Foundations · ~U7–U9', 'Ball relationship, movement literacy, fun with constraints - coaching density and small-group rotations.'],
  ['Development · ~U10–U12', 'Technical refinement + emerging athletic demand; introduction to cognitive prompts and small-sided application.'],
  ['Performance · ~U13+', 'Higher physical demand, faster cognitive tempo, application scenarios with accountability - still age-safe volume.'],
  ]
  return (
  <div className="not-prose my-10 grid gap-px bg-white/[0.08] md:grid-cols-3">
  {tiers.map(([title, body]) => (
  <div key={title} className="marketing-glass bg-[#080808] p-5">
  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-200">{title}</p>
  <p className="mt-3 text-sm leading-relaxed text-zinc-500">{body}</p>
  </div>
  ))}
  </div>
  )
}

export default function CampsPage() {
  return (
  <MarketingInnerPage
  wide
  eyebrow="Camps"
  title="Immersion - full facility, Formula standard."
  intro="Structured day model: coached progression, real reps, application under rules - not daycare with a ball."
  >
  <h2>Summer camps</h2>
  <p>
  <strong>Deep work weeks</strong> - published rotation through the asset stack: tech, speed, cognition, coachable competitive slices - even in heat.
  </p>

  <h2>Holiday camps</h2>
  <p>
  Same <strong>day architecture</strong>, compressed calendar - high-signal reset without a full summer week every break.
  </p>

  <h2>Structured day model</h2>
  <p>
  <strong>Block-planned</strong> days: targets, transitions, buffers, staffing - predictability for parents, consistency for athletes.
  </p>

  <h2>Facility activation</h2>
  <p>
  Not one field + pile of balls - <Link href={MARKETING_HREF.facility}>full system</Link>: fields, speed, cognitive, Footbot where programmed, application like
  year-round Formula.
  </p>

  <h2>Camp → membership</h2>
  <p>
  Credible on-ramp: standards, building discipline, how <Link href={MARKETING_HREF.fpi}>The Formula</Link> tracks priorities. Natural step into{' '}
  <Link href={MARKETING_HREF.youthMembership}>membership</Link> when fit is real - no pressure play.
  </p>

  <h2>Premium development - not daycare</h2>
  <p>
  <strong>Active coaching</strong> - structure, standards, accountability + planned recovery. Wrong building for warehousing; right one for measurably sharper
  habits.
  </p>

  <h2>Schedule</h2>
  <p>
  Shapes below are representative - <strong>confirm dates, times, half-day in live registration</strong>.
  </p>
  <ScheduleTable />

  <h2>Age grouping</h2>
  <p>
  <strong>Age + profile</strong> - labels directional; placement uses assessment history + coach judgment day one.
  </p>
  <AgeGrouping />

  <h2>Sample day</h2>
  <SampleDay />

  <h2>Pricing structure</h2>
  <p>
  <strong>Transparent tiers</strong> - full week, holiday blocks, add-ons. Placeholders show shape; <strong>swap live rates in registration</strong>.
  </p>
  <PricingTable />
  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
  Deposits, cancellation windows, and sibling/member policies are defined at registration - structure beats surprise fees.
  </p>

  <h2>Registration</h2>
  <p>
  <strong>Parent portal</strong> when rosters open - returning sign in; new accounts same flow.
  </p>

  <p>
  Narrow refinement after camp: <Link href={MARKETING_HREF.clinics}>Clinics</Link>. Year-round spine: <Link href={MARKETING_HREF.youthMembership}>Youth membership</Link>.
  </p>

  <CtaRow
  primary={{ label: 'Register for camp', href: '/login?role=parent' }}
  secondary={{ label: 'Book assessment', href: MARKETING_HREF.assessment }}
  />
  </MarketingInnerPage>
  )
}

