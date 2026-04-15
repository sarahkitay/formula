import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { isEventsHubPublished, SUMMER_EVENT_SECTIONS } from '@/lib/marketing/events-public'
import { GENERAL_EVENTS_PRICING_STATUS } from '@/lib/marketing/public-pricing'

export async function generateMetadata(): Promise<Metadata> {
  const published = isEventsHubPublished()
  return {
    title: 'Events',
    description:
      'Parties, Footbot, tournaments, summer programming — premium hosted experiences with the same Formula ops discipline.',
    ...(published ? {} : { robots: { index: false, follow: true } }),
  }
}

const PATH_CARDS: { title: string; line: string; href: string }[] = [
  {
    title: 'Birthday parties',
    line: 'Hosted ops · protected windows · premium floor standard.',
    href: MARKETING_HREF.parties,
  },
  {
    title: 'Footbot',
    line: 'Rentals + comps — precision reps under Formula structure.',
    href: MARKETING_HREF.footbot,
  },
  {
    title: 'Tournaments',
    line: 'Controlled weekends — schedule discipline, protected inventory.',
    href: MARKETING_HREF.tournaments,
  },
  {
    title: 'Assessment bookings',
    line: 'Youth entry standard — baseline + honest expectations.',
    href: MARKETING_HREF.bookAssessmentPortal,
  },
]

export default function EventsHubPage() {
  const published = isEventsHubPublished()

  return (
    <MarketingInnerPage
      eyebrow="Events"
      title="Premium events — same OS as training."
      intro="Clear timelines, pro staff, and facility behavior that protects athletes and families — whether it is a party, Footbot block, tournament weekend, or summer programming."
    >
      <section aria-labelledby="summer-events-heading" className="not-prose">
        <h2 id="summer-events-heading" className="!mt-0">
          Summer events
        </h2>
        {published ? (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {SUMMER_EVENT_SECTIONS.map(block => (
              <li
                key={block.id}
                className="border border-formula-frost/14 bg-formula-paper/[0.03] p-5 md:p-6"
              >
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-volt/90">
                  {block.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-formula-frost/85">{block.summary}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 border border-formula-frost/14 bg-formula-deep/60 p-5 md:p-6">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Coming soon</p>
            <p className="mt-3 text-[15px] leading-relaxed text-formula-frost/88">
              Summer programming details, dates, and registration will be posted here first. Check back soon, or call the front desk for the latest on hosted
              weekends and camps.
            </p>
          </div>
        )}
      </section>

      <h2 className="!mt-14">Pick a path</h2>
      <div className="not-prose mt-6 grid gap-px bg-white/[0.08] sm:grid-cols-2">
        {PATH_CARDS.map(c => (
          <div key={c.href} className="marketing-glass bg-[#080808] p-6">
            <Link href={c.href} className="group block no-underline">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-200 group-hover:text-white">
                {c.title}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">{c.line}</p>
              <span className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.18em] text-formula-volt/95">
                Open →
              </span>
            </Link>
          </div>
        ))}
      </div>

      <p className="!mt-10">
        <strong>{GENERAL_EVENTS_PRICING_STATUS}</strong>
      </p>
      <p>
        Facility context: <Link href={MARKETING_HREF.facility}>Facility & asset model</Link>. Rentals:{' '}
        <Link href={MARKETING_HREF.rentals}>Rentals</Link>.
      </p>
    </MarketingInnerPage>
  )
}
