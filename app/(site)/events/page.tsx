import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { GENERAL_EVENTS_PRICING_STATUS } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Parties, Footbot, tournaments, assessments - premium hosted experiences, same cutting-edge ops discipline.',
}

const CARDS: { title: string; line: string; href: string }[] = [
  {
  title: 'Birthday parties',
  line: 'Hosted ops · protected windows · premium floor standard.',
  href: MARKETING_HREF.parties,
  },
  {
  title: 'Footbot',
  line: 'Rentals + comps - precision reps under Formula structure.',
  href: MARKETING_HREF.footbot,
  },
  {
  title: 'Tournaments',
  line: 'Controlled weekends - schedule discipline, protected inventory.',
  href: MARKETING_HREF.tournaments,
  },
  {
  title: 'Assessment bookings',
  line: 'Youth entry standard - baseline + honest expectations.',
  href: MARKETING_HREF.assessment,
  },
]

export default function EventsHubPage() {
  return (
  <MarketingInnerPage
  eyebrow="Events"
  title="Premium events - same OS as training."
  intro="Clear timelines, pro staff, facility behavior that protects athletes and families - party, Footbot, or tournament weekend."
  >
  <h2>Pick a path</h2>
  <div className="not-prose mt-6 grid gap-px bg-white/[0.08] sm:grid-cols-2">
  {CARDS.map(c => (
  <div key={c.href} className="marketing-glass bg-[#080808] p-6">
  <Link href={c.href} className="group block no-underline">
  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-200 group-hover:text-white">{c.title}</span>
  <p className="mt-3 text-sm leading-relaxed text-zinc-500">{c.line}</p>
  <span className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.18em] text-formula-volt/95">Open →</span>
  </Link>
  </div>
  ))}
  </div>
  <p>
  <strong>{GENERAL_EVENTS_PRICING_STATUS}</strong>
  </p>
  <p>
  Facility context: <Link href={MARKETING_HREF.facility}>Facility & asset model</Link>. Rentals: <Link href={MARKETING_HREF.rentals}>Rentals</Link>.
  </p>
  </MarketingInnerPage>
  )
}
