import type { Metadata } from 'next'
import Link from 'next/link'
import { EventRequestForm } from '@/components/marketing/event-request-form'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { UPCOMING_PUBLIC_EVENTS } from '@/lib/marketing/events-public'
import { GENERAL_EVENTS_PRICING_STATUS } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Request corporate, club, party, or tournament blocks. Browse hosted paths and upcoming announcements at Formula Soccer Center.',
}

const PATH_CARDS: { title: string; line: string; href: string }[] = [
  { title: 'Birthday parties', line: 'Deposits, windows, policies.', href: MARKETING_HREF.parties },
  { title: 'Footbot', line: 'Structured reps + rentals context.', href: MARKETING_HREF.footbot },
  { title: 'Tournaments', line: 'Controlled weekends.', href: MARKETING_HREF.tournaments },
  { title: 'Skills Check hub', line: 'Assessments, field holds, waiver.', href: MARKETING_HREF.bookAssessmentPortal },
]

export default function EventsHubPage() {
  const upcoming = UPCOMING_PUBLIC_EVENTS

  return (
    <MarketingInnerPage
      eyebrow="Events"
      title="Host at Formula"
      intro="Request a block below. Staff replies by email with availability and next steps. Field-time deposits for recurring rentals still live in the booking hub."
      wide
    >
      <section id="event-request" aria-labelledby="event-request-heading" className="not-prose scroll-mt-28">
        <h2 id="event-request-heading" className="!mt-0 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-formula-mist">
          Request an event
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-formula-frost/80">
          Corporate, parties, clubs, tournaments, camps — tell us headcount, budget ($1k–$10k+), and how you want to use fields or the full facility.
        </p>
        <div className="mt-6 rounded-xl border border-formula-frost/16 bg-formula-paper/[0.04] p-5 md:p-8">
          <EventRequestForm />
        </div>
      </section>

      <section id="upcoming" aria-labelledby="upcoming-heading" className="not-prose scroll-mt-28 border-t border-formula-frost/10 pt-12">
        <h2 id="upcoming-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-formula-mist">
          Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-sm text-formula-frost/70">Nothing listed yet — check back or submit a request above.</p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {upcoming.map((block) => (
              <li key={block.id} className="rounded-lg border border-formula-frost/14 bg-formula-paper/[0.03] p-5">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-volt/90">{block.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-formula-frost/85">{block.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <details className="not-prose mt-12 rounded-xl border border-formula-frost/14 bg-formula-base/60 open:border-formula-frost/22">
        <summary className="cursor-pointer px-5 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-paper md:px-6">
          Hosted paths & facility context
        </summary>
        <div className="border-t border-formula-frost/10 px-5 py-5 md:px-6">
          <div className="grid gap-px bg-white/[0.08] sm:grid-cols-2">
            {PATH_CARDS.map((c) => (
              <div key={c.href} className="marketing-glass bg-[#080808] p-5">
                <Link href={c.href} className="group block no-underline">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-200 group-hover:text-white">{c.title}</span>
                  <p className="mt-2 text-sm text-zinc-500">{c.line}</p>
                  <span className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.18em] text-formula-volt/95">Open →</span>
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-formula-frost/75">
            <strong className="text-formula-paper">{GENERAL_EVENTS_PRICING_STATUS}</strong>{' '}
            <Link href={MARKETING_HREF.facility} className="text-formula-volt underline-offset-2 hover:underline">
              Facility
            </Link>
            {' · '}
            <Link href={`${MARKETING_HREF.bookAssessment}#field-rental-on-hub`} className="text-formula-volt underline-offset-2 hover:underline">
              Field rental deposit
            </Link>
            .
          </p>
        </div>
      </details>
    </MarketingInnerPage>
  )
}
