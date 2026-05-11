import { BookDayPassLanding } from '@/components/marketing/book-day-pass-landing'
import { BookingHubBackLink } from '@/components/marketing/booking-hub-back-link'
import { BOOKING_HUB_PARENT } from '@/lib/marketing/book-assessment-paths'

export default function ParentBookAssessmentDayPassPage() {
  return (
    <>
      <BookingHubBackLink href={BOOKING_HUB_PARENT.hub} />
      <BookDayPassLanding variant="portal" />
    </>
  )
}
