import { FieldRentalAgreementForm } from '@/components/marketing/field-rental-agreement-form'
import { BookingHubBackLink } from '@/components/marketing/booking-hub-back-link'
import { BOOKING_HUB_PARENT } from '@/lib/marketing/book-assessment-paths'

export default function ParentBookAssessmentWaiverPage() {
  return (
    <>
      <BookingHubBackLink href={BOOKING_HUB_PARENT.hub} />
      <FieldRentalAgreementForm />
    </>
  )
}
