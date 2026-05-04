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
  { title: 'Summer Camp 2026', line: 'Mon–Fri day camp · themed weeks · register online.', href: MARKETING_HREF.summerCamp2026 },
  { title: 'Friday Friendlies', line: 'Pickup soccer ages 6–13 · pre-register $20.', href: MARKETING_HREF.fridayNightFriendlies },
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
      intro="Use the form below for corporate blocks, tournaments, camps, and similar hosted uses - staff replies by email. This page is not field-rental checkout: structured field time (published hourly rate, default 2 hr holds) and birthday parties (party deposit) are booked on Rentals, Parties, or the booking hub."
      wide
    >
      <section id="upcoming" aria-labelledby="upcoming-heading" className="not-prose min-w-0 scroll-mt-24 sm:scroll-mt-28">
        <h2 id="upcoming-heading" className="!mt-0 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-formula-mist">
          Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-sm leading-relaxed text-formula-frost/70">Nothing listed yet - check back or submit a request below.</p>
        ) : (
          <ul className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
            {upcoming.map(block => (
              <li key={block.id} className="rounded-lg border border-formula-frost/14 bg-formula-paper/[0.03] p-4 sm:p-5">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-volt/90">{block.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-formula-frost/85">{block.summary}</p>
                {block.subLinks && block.subLinks.length > 0 ? (
                  <ul className="mt-4 flex flex-col gap-1 border-t border-formula-frost/10 pt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-2">
                    {block.subLinks.map(link => (
                      <li key={link.href} className="min-w-0 sm:inline-flex">
                        <Link
                          href={link.href}
                          className="-mx-1 block rounded-md px-1 py-2.5 text-formula-volt underline-offset-2 hover:bg-formula-frost/5 hover:underline sm:inline sm:py-1"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {block.href ? (
                  <Link
                    href={block.href}
                    className="mt-3 inline-flex min-h-11 items-center font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-volt underline-offset-2 hover:underline sm:mt-4"
                  >
                    {block.ctaLabel ?? 'See more'}
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        id="event-request"
        aria-labelledby="event-request-heading"
        className="not-prose min-w-0 scroll-mt-24 border-t border-formula-frost/10 pt-10 sm:scroll-mt-28 sm:pt-12"
      >
        <h2 id="event-request-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-formula-mist">
          Request an event
        </h2>
        <p className="mt-3 max-w-2xl break-words text-sm leading-relaxed text-formula-frost/80">
          Pick a type below - <strong className="text-formula-paper">field rental blocks</strong> and <strong className="text-formula-paper">hosted parties</strong> are
          listed separately from each other. Headcount, budget ($1k–$10k+), and space intent.
        </p>
        <div className="mt-5 w-full min-w-0 max-w-full overflow-x-clip rounded-xl border border-formula-frost/16 bg-formula-paper/[0.04] p-4 sm:mt-6 sm:p-5 md:p-8">
          <EventRequestForm />
        </div>
      </section>

      <details className="not-prose mt-8 min-w-0 max-w-full rounded-xl border border-formula-frost/14 bg-formula-base/60 open:border-formula-frost/22 sm:mt-12">
        <summary className="flex min-h-[3rem] cursor-pointer list-none items-center px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-paper marker:content-none sm:min-h-14 sm:px-6 sm:py-4 [&::-webkit-details-marker]:hidden">
          Hosted paths & facility context
        </summary>
        <div className="min-w-0 border-t border-formula-frost/10 px-4 py-4 sm:px-5 sm:py-5 md:px-6">
          <div className="grid min-w-0 grid-cols-1 gap-px bg-white/[0.08] sm:grid-cols-2">
            {PATH_CARDS.map(c => (
              <div key={c.href} className="marketing-glass min-w-0 bg-[#080808] p-4 sm:p-5">
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
            <Link href={MARKETING_HREF.rentals} className="text-formula-volt underline-offset-2 hover:underline">
              Field rentals (pricing & deposit)
            </Link>
            .
          </p>
        </div>
      </details>
    </MarketingInnerPage>
  )
}
