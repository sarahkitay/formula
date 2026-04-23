import type { Metadata } from 'next'
import Link from 'next/link'
import { YouthBlocksWeekPanel } from '@/components/marketing/youth-blocks-week-panel'
import { BookingHubBackLink } from '@/components/marketing/booking-hub-back-link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'

export const metadata: Metadata = {
  title: 'Youth training blocks',
  description: 'Preview published youth block weeks at Formula Soccer Center.',
}

export default function BookAssessmentYouthBlocksPage() {
  return (
    <MarketingInnerPage eyebrow="Booking hub" title="Youth training blocks" wide>
      <BookingHubBackLink href={BOOKING_HUB_PUBLIC.hub} />
      <p className="not-prose mb-8 max-w-2xl text-sm leading-relaxed text-formula-frost/80">
        Published schedule preview. Final enrollment still happens in the parent portal with an active package.
      </p>
      <YouthBlocksWeekPanel />
      <div className="marketing-section-divider not-prose my-10" aria-hidden />
      <p className="not-prose text-[12px] text-formula-frost/55">
        <Link href={BOOKING_HUB_PUBLIC.hub} className="text-formula-volt underline-offset-2 hover:underline">
          ← Booking hub
        </Link>
      </p>
    </MarketingInnerPage>
  )
}
