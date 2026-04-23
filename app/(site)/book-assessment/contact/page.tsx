import type { Metadata } from 'next'
import { BookAssessmentGuardianContactClient } from '@/components/marketing/book-assessment-guardian-contact-client'
import { BookingHubBackLink } from '@/components/marketing/booking-hub-back-link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'

export const metadata: Metadata = {
  title: 'Guardian contact',
  description: 'Save guardian name and email for Skills Check receipts on the Formula booking hub.',
}

export default function BookAssessmentContactPage() {
  return (
    <MarketingInnerPage eyebrow="Booking hub" title="Guardian contact" wide>
      <BookingHubBackLink href={BOOKING_HUB_PUBLIC.hub} />
      <BookAssessmentGuardianContactClient variant="public" />
    </MarketingInnerPage>
  )
}
