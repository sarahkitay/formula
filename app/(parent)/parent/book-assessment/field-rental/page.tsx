import { FieldRentalBookingFlow } from '@/components/marketing/field-rental-booking-flow'
import { BookingHubBackLink } from '@/components/marketing/booking-hub-back-link'
import { BOOKING_HUB_PARENT } from '@/lib/marketing/book-assessment-paths'

export default function ParentBookAssessmentFieldRentalPage() {
  return (
    <>
      <BookingHubBackLink href={BOOKING_HUB_PARENT.hub} />
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-formula-frost/80">
        Field rental checkout only — not the hosted birthday party deposit.
      </p>
      <FieldRentalBookingFlow sectionId="field-rental-booking" />
    </>
  )
}
