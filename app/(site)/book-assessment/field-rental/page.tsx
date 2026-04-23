import type { Metadata } from 'next'
import { FieldRentalBookingFlow } from '@/components/marketing/field-rental-booking-flow'
import { BookingHubBackLink } from '@/components/marketing/booking-hub-back-link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'

export const metadata: Metadata = {
  title: 'Field rental deposit',
  description: 'Book structured field rental time and pay the deposit at Formula Soccer Center.',
}

export default function BookAssessmentFieldRentalPage() {
  return (
    <MarketingInnerPage eyebrow="Booking hub" title="Field rental deposit" wide>
      <BookingHubBackLink href={BOOKING_HUB_PUBLIC.hub} />
      <p className="not-prose mb-8 max-w-2xl text-sm leading-relaxed text-formula-frost/80">
        This page is only field rental checkout — not the hosted birthday party deposit.
      </p>
      <FieldRentalBookingFlow sectionId="field-rental-booking" />
    </MarketingInnerPage>
  )
}
