import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage, CtaRow } from '@/components/marketing/marketing-inner'
import { FieldRentalBookingFlow } from '@/components/marketing/field-rental-booking-flow'
import { FieldRentalAgreementForm } from '@/components/marketing/field-rental-agreement-form'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { FIELD_RENTAL_PUBLISHED_RATES } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Rentals',
  description:
    'Field rentals at Formula Soccer Center: published hourly rate, packaged inventory, 12-week alignment, and protected performance scheduling.',
}

export default function RentalsPage() {
  return (
  <MarketingInnerPage
  eyebrow="Structured rentals"
  title="Packaged inventory. Recurring-friendly."
  intro="Not open-dock booking - packages, protected turnover, inventory discipline. Reliable partners, not commodity hall energy."
  >
  <h2>Core principle</h2>
  <p>
  The system <strong>classifies, enforces, and filters</strong> rentals before arrival - less on-site friction, documented compliance, and a protected
  performance environment.
  </p>

  <FieldRentalBookingFlow />

  <h2>Published hourly rate</h2>
  <p>
  <strong className="text-zinc-200">${FIELD_RENTAL_PUBLISHED_RATES.perHourUsd}/hr</strong> for all rental windows. No separate peak or non-peak pricing.
  </p>
  <p>
  {FIELD_RENTAL_PUBLISHED_RATES.packages}
  </p>

  <h2>Check-in model</h2>
  <p>
  <strong>Low friction:</strong> no traditional check-in line. Staff monitor sessions and intervene only when needed: headcount over limit, use that does
  not match classification, or unsafe / prohibited behavior.
  </p>

  <h2>Philosophy</h2>
  <p>
  Blocks run as <strong>programmed ops</strong>: start/stop, buffers, staff sync - premium for everyone on the clock. We want <strong>recurring, respectful</strong>{' '}
  clubs, trainers, teams - not loudest hourly bidder.
  </p>

  <h2>Package-based model</h2>
  <p>
  <strong>Packages</strong> = window + surface + setup + inclusions - not ad-hoc hourly chaos. Aligned expectations; defensible schedule for the whole building.
  </p>

  <div className="not-prose marketing-glass my-10 border border-white/[0.08] bg-white/[0.02] p-5 md:p-6">
  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Recurring rhythm</p>
  <ul className="mt-4 list-none space-y-3 p-0 font-sans text-sm leading-relaxed text-zinc-400">
  <li className="pl-0 before:hidden">
  <strong className="text-zinc-300">12-week alignment:</strong> recurring packages lock to <strong className="text-zinc-300">12-week cycles</strong> - habits + tactical season
  tweaks.
  </li>
  <li className="pl-0 before:hidden">
  <strong className="text-zinc-300">Why:</strong> less whiplash, youth blocks protected, partnerships run pro week to week.
  </li>
  </ul>
  </div>

  <h2>Club packages</h2>
  <p>
  <strong>Recurring blocks</strong> - weekday lanes, weekend bridges, combined formats - same internal ops discipline. <strong>Continuity</strong>: fields, transitions,
  comms that respect coaches, parents, desk.
  </p>

  <h2>Private training</h2>
  <p>
  Trainers get <strong>fit windows</strong> for surface need - tech, speed, constrained games - no margin improvisation. <strong>Structured use</strong>: right space,
  duration, buffers - quality + liability managed.
  </p>

  <h2>Inventory + structured use</h2>
  <p>
  <strong>Protected inventory</strong> - performance environments, not “whatever’s open.” Calendar reflects youth blocks, application windows, staffing,
  recovery between sessions. Rentals inherit Formula tempo, behavior, transitions - scale demand without eroding premium.
  </p>

  <h2 id="participant-waiver-heading">Participant waiver (each player)</h2>
  <p>
  One signed waiver per participant. Waivers must be complete before field access; the booking flow above describes renter dashboard progress and
  reminder timing once email and persistence are connected.
  </p>
  <FieldRentalAgreementForm />

  <p>
  See the <Link href={MARKETING_HREF.facility}>facility & asset model</Link>. Youth families start with{' '}
  <Link href={MARKETING_HREF.bookAssessmentPortal}>assessment booking</Link>; hosted weekends live in{' '}
  <Link href={MARKETING_HREF.tournaments}>tournaments</Link> and <Link href={MARKETING_HREF.events}>events</Link>.
  </p>

  <CtaRow
  primary={{ label: 'Facility & map', href: MARKETING_HREF.facility }}
  secondary={{ label: 'Youth membership', href: MARKETING_HREF.youthMembership }}
  />
  </MarketingInnerPage>
  )
}
