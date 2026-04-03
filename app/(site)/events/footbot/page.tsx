import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export const metadata: Metadata = {
  title: 'Footbot',
  description:
    'State-of-the-art precision reps: Footbot rentals + competition formats - structured windows, Formula coaching standard.',
}

export default function FootbotPage() {
  return (
  <MarketingInnerPage
  eyebrow="Precision reps"
  title="Footbot - reps with standards."
  intro="High-volume touch work, measurable consistency - rentals + comps match Formula structure."
  >
  <h2>Rentals</h2>
  <p>
  Book in <strong>structured windows</strong> - aligned turnover, clean, coachable, on schedule.
  </p>
  <h2>Competitions</h2>
  <p>
  Repeatable execution, fair rules - energy without door chaos.
  </p>
  <h2>Why it fits Formula</h2>
  <p>
  Like speed + cognitive stations: <strong>narrow constraints · high reps · measurable feedback</strong>.
  </p>
  <p>
  See the <Link href={MARKETING_HREF.facility}>facility plan</Link> for placement context. Events: <Link href={MARKETING_HREF.events}>hub</Link>.
  </p>
  </MarketingInnerPage>
  )
}
