'use client'

import { BookAssessmentGuardianContactClient } from '@/components/marketing/book-assessment-guardian-contact-client'
import { BookingHubBackLink } from '@/components/marketing/booking-hub-back-link'
import { useParentBookingProfile } from '@/components/parent/parent-book-assessment-layout-client'
import { BOOKING_HUB_PARENT } from '@/lib/marketing/book-assessment-paths'

export default function ParentBookAssessmentContactPage() {
  const { guardianName, guardianEmail } = useParentBookingProfile()

  return (
    <>
      <BookingHubBackLink href={BOOKING_HUB_PARENT.hub} />
      <BookAssessmentGuardianContactClient variant="portal" guardianFullName={guardianName} guardianEmail={guardianEmail} />
    </>
  )
}
