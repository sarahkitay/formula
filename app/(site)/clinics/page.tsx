import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage, CtaRow } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export const metadata: Metadata = {
  title: 'Clinics',
  description:
    'Cutting-edge refinement labs: scarce rosters, high reps, members-first, Formula-informed themes, specialty blocks, transparent bands.',
}

function ClinicThemesTable() {
  const rows: [string, string, string][] = [
  ['First touch under pressure', 'Receive + scan + play forward in one rhythm', 'Technical · small-group lanes'],
  ['Distribution & weight', 'Line-breaking passes, third-man timing, tempo control', 'Technical / cognitive'],
  ['1v1 duel craft', 'Approach angle, change of speed, end product discipline', 'Technical / application'],
  ['Finishing architecture', 'Shot selection, prep touch, composure constraints', 'Technical'],
  ['Change of direction', 'Braking, re-acceleration, repeatability', 'Physical / technical bridge'],
  ['Press & compactness (intro / advanced)', 'Triggers, cover shadows, recovery runs', 'Tactical application'],
  ]
  return (
  <div className="not-prose my-10 overflow-x-auto border border-white/[0.08]">
  <table className="w-full min-w-[560px] border-collapse text-left font-sans text-sm">
  <thead>
  <tr className="border-b border-white/[0.08] bg-white/[0.03] font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
  <th className="px-4 py-3 font-medium">Clinic theme</th>
  <th className="px-4 py-3 font-medium">Problem set</th>
  <th className="px-4 py-3 font-medium">Primary pillar lean</th>
  </tr>
  </thead>
  <tbody className="text-zinc-400">
  {rows.map(([a, b, c]) => (
  <tr key={a} className="border-b border-white/[0.06] last:border-0">
  <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-300">{a}</td>
  <td className="px-4 py-3 leading-relaxed">{b}</td>
  <td className="px-4 py-3 leading-relaxed">{c}</td>
  </tr>
  ))}
  </tbody>
  </table>
  <p className="border-t border-white/[0.06] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-600">
  Live schedule rotates themes seasonally - published with capacity and coach roster.
  </p>
  </div>
  )
}

function SpecialtyLabs() {
  const labs: [string, string][] = [
  [
  'Velocity finishing lab',
  'High repetition finishing with shot-clock or defender constraint - composure stressed, not chaos.',
  ],
  ['Wide play + cross execution', 'Service quality, near-post/far-post reads, arrival timing - rehearsed until automatic.'],
  ['Press-resist pocket', 'Body shape, first touch out of pressure, simple plus-one decisions under live bother.'],
  ['Speed + ball hybrid', 'Short explosive bouts paired with technical precision - fatigue managed, standards held.'],
  ['Goalkeeper invitational (when offered)', 'Technique + decision sequencing for GKs - adjacent to field themes when scheduled.'],
  ]
  return (
  <div className="not-prose my-10 grid gap-px bg-white/[0.08] md:grid-cols-2">
  {labs.map(([title, body]) => (
  <div key={title} className="marketing-glass bg-[#080808] p-5 md:p-6">
  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-formula-volt/95">Specialty lab</p>
  <p className="mt-2 font-mono text-sm font-semibold tracking-tight text-zinc-100">{title}</p>
  <p className="mt-3 text-sm leading-relaxed text-zinc-500">{body}</p>
  </div>
  ))}
  </div>
  )
}

function PricingBandsTable() {
  const rows: [string, string, string][] = [
  ['Member standard', 'Formula youth member · published registration window', '$XXX per session / multi-pack discounts posted'],
  ['Member priority', 'Early access / hold window before general release', 'Bundled pricing where seasonal flyer applies'],
  ['Guest / non-member (if offered)', 'Limited seats · subject to roster fit and coach approval', '$XXX+ premium band - capacity gated'],
  ['Specialty intensive', 'Extended lab OR guest specialist block', '$XXX–$XXX by duration & inventory'],
  ]
  return (
  <div className="not-prose my-10 overflow-x-auto border border-white/[0.08]">
  <table className="w-full min-w-[520px] border-collapse text-left font-sans text-sm">
  <thead>
  <tr className="border-b border-white/[0.08] bg-white/[0.03] font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
  <th className="px-4 py-3 font-medium">Pricing band</th>
  <th className="px-4 py-3 font-medium">Who / when</th>
  <th className="px-4 py-3 font-medium">Structure</th>
  </tr>
  </thead>
  <tbody className="text-zinc-400">
  {rows.map(([a, b, c]) => (
  <tr key={a} className="border-b border-white/[0.06] last:border-0">
  <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-300">{a}</td>
  <td className="px-4 py-3 leading-relaxed">{b}</td>
  <td className="px-4 py-3 leading-relaxed">{c}</td>
  </tr>
  ))}
  </tbody>
  </table>
  <p className="border-t border-white/[0.06] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-600">
  Replace $XXX with live rates in your registration portal - bands reflect scarcity and coaching density, not discount logic.
  </p>
  </div>
  )
}

export default function ClinicsPage() {
  return (
  <MarketingInnerPage
  wide
  eyebrow="Clinics"
  title="Refinement labs - narrow, scarce, coach-led."
  intro="Small rosters, one problem set, high reps - premium by design, not a random session catalog."
  >
  <h2>What clinics are</h2>
  <p>
  <strong>Targeted · scarce · premium · coach-led.</strong> High repetition: demo → execute → correct → repeat until habits survive pressure.{' '}
  <strong>Supplement</strong> the membership spine - compress time, not replace the arc.
  </p>

  <h2>Members-first access</h2>
  <p>
  <strong>Priority + early windows</strong> where posted. Best when they plug into the block story athletes already run.
  </p>

  <h2>Formula-informed recommendations</h2>
  <p>
  <Link href={MARKETING_HREF.fpi}>The Formula</Link> + observation → recs when a pillar limits - not generic upsell. Prescription energy: narrow theme, defined outcome.
  </p>

  <h2>Clinic themes</h2>
  <p>
  <strong>Published calendar</strong> - problem set, age, capacity, coach roster per block. Know what you buy.
  </p>
  <ClinicThemesTable />

  <h2>Specialty labs</h2>
  <p>
  <strong>Higher-constraint intensives</strong> - longer rep blocks, tougher standards, unique inventory pairings when staffing allows. Always capped.
  </p>
  <SpecialtyLabs />

  <h2>Age rotation</h2>
  <p>
  <strong>Foundations / Development / Performance</strong> rotations - honest cues, load, cognition. Not every theme every week - <strong>rotation protects quality</strong>.
  Night-one coach check for edge cases.
  </p>

  <h2>Pricing bands</h2>
  <p>
  <strong>Bands</strong> for tier, scarcity, length - transparent at signup, no surprise add-ons.
  </p>
  <PricingBandsTable />

  <p>
  Pair with <Link href={MARKETING_HREF.camps}>camps</Link> for immersion weeks, or anchor year-round progression with{' '}
  <Link href={MARKETING_HREF.youthMembership}>youth membership</Link>. New athletes:{' '}
  <Link href={MARKETING_HREF.bookAssessmentPortal}>book assessment</Link>.
  </p>

  <CtaRow
  primary={{ label: 'Register for clinics', href: '/login?role=parent' }}
  secondary={{ label: 'The Formula', href: MARKETING_HREF.fpi }}
  />
  </MarketingInnerPage>
  )
}