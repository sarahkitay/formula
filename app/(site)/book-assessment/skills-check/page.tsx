import type { Metadata } from 'next'
import { BookAssessmentSkillsCheckClient } from '@/components/marketing/book-assessment-skills-check-client'
import { BookingHubBackLink } from '@/components/marketing/booking-hub-back-link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'
import { FORMULA_SKILLS_CHECK } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'June Skills Check pre-book',
  description: 'Pre-book a June Formula Skills Check window and pay securely.',
}

export default function BookAssessmentSkillsCheckPage() {
  return (
    <MarketingInnerPage eyebrow="Booking hub" title="June pre-book · Skills Check" wide>
      <BookingHubBackLink href={BOOKING_HUB_PUBLIC.hub} />
      <BookAssessmentSkillsCheckClient variant="public" skillsCheckPriceUsd={FORMULA_SKILLS_CHECK.priceUsd} />
    </MarketingInnerPage>
  )
}
