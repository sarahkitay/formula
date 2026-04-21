import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export const metadata: Metadata = {
  title: 'Tournaments',
  description:
    'State-of-the-art tournament hosting: bracket discipline, protected fields, pro ops - credible competition weekends.',
}

export default function TournamentsPage() {
  return (
  <MarketingInnerPage
  eyebrow="Hosted competition"
  title="Tournaments - controlled weekends."
  intro="Field protection, clock discipline, ref support, clear comms - high-traffic weekends without eroding the building."
  >
  <h2>Scheduling discipline</h2>
  <p>
  Brackets cut dead time - <strong>transitions</strong> as important as kickoffs.
  </p>
  <h2>Inventory protection</h2>
  <p>
  Fields + support spaces allocated so facility quality stays defendable under load.
  </p>
  <h2>Inquire</h2>
  <p>
  Proposed dates, ages, field needs - we reply with feasibility + package fit.
  </p>
  <p>
  Inquire via <Link href={`${MARKETING_HREF.events}#event-request`}>Events</Link>. Field inventory: <Link href={MARKETING_HREF.rentals}>Rentals</Link>.{' '}
  <Link href={MARKETING_HREF.facility}>Facility</Link>.
  </p>
  </MarketingInnerPage>
  )
}
