import type { Metadata } from 'next'
import { BookAssessmentClient } from '@/components/marketing/book-assessment-client'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { FORMULA_SKILLS_CHECK } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Book an assessment',
  description:
    'Book a Formula Skills Check online: choose an open window, number of athletes, and pay securely. Optional parent portal signup after checkout.',
}

export default function BookAssessmentPage() {
  return (
    <MarketingInnerPage
      eyebrow="Skills Check"
      title="Book an assessment"
      intro={`No portal account required. Choose a published window (up to four athlete spots per hour), select how many players you are bringing, and pay $${FORMULA_SKILLS_CHECK.priceUsd} per athlete. After payment you can create a parent login and add names so your kids show up in the portal.`}
      wide
    >
      <BookAssessmentClient />
    </MarketingInnerPage>
  )
}
