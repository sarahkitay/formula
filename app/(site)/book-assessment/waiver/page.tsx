import type { Metadata } from 'next'
import { FieldRentalAgreementForm } from '@/components/marketing/field-rental-agreement-form'
import { BookingHubBackLink } from '@/components/marketing/booking-hub-back-link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'

export const metadata: Metadata = {
  title: 'Rental waiver',
  description: 'Sign the Formula field rental agreement on file.',
}

export default function BookAssessmentWaiverPage() {
  return (
    <MarketingInnerPage eyebrow="Booking hub" title="Rental waiver" wide>
      <BookingHubBackLink href={BOOKING_HUB_PUBLIC.hub} />
      <FieldRentalAgreementForm />
    </MarketingInnerPage>
  )
}
