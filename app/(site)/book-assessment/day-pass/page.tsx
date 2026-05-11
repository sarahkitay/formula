import type { Metadata } from 'next'
import { BookDayPassLanding } from '@/components/marketing/book-day-pass-landing'
import { BookingHubBackLink } from '@/components/marketing/booking-hub-back-link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'
import { DAY_PASS_ONE_DAY } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'One-day pass',
  description: `${DAY_PASS_ONE_DAY.productName} · $${DAY_PASS_ONE_DAY.priceUsd} single visit. Age groups and check-in details for Formula Soccer Center.`,
}

export default function BookAssessmentDayPassPage() {
  return (
    <MarketingInnerPage
      eyebrow="Booking hub"
      title={`One-day pass · $${DAY_PASS_ONE_DAY.priceUsd}`}
      intro="Pick the age band that fits your athlete. Staff confirm placement when you arrive."
      wide
    >
      <BookingHubBackLink href={BOOKING_HUB_PUBLIC.hub} />
      <BookDayPassLanding variant="public" />
    </MarketingInnerPage>
  )
}
