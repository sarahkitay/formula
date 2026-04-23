'use client'

import { BookAssessmentSkillsCheckClient } from '@/components/marketing/book-assessment-skills-check-client'
import { BookingHubBackLink } from '@/components/marketing/booking-hub-back-link'
import { useParentBookingProfile } from '@/components/parent/parent-book-assessment-layout-client'
import { BOOKING_HUB_PARENT } from '@/lib/marketing/book-assessment-paths'
import { FORMULA_SKILLS_CHECK } from '@/lib/marketing/public-pricing'

export default function ParentBookAssessmentSkillsCheckPage() {
  const { guardianName, guardianEmail } = useParentBookingProfile()

  return (
    <>
      <BookingHubBackLink href={BOOKING_HUB_PARENT.hub} />
      <BookAssessmentSkillsCheckClient
        variant="portal"
        guardianFullName={guardianName}
        guardianEmail={guardianEmail}
        skillsCheckPriceUsd={FORMULA_SKILLS_CHECK.priceUsd}
      />
    </>
  )
}
