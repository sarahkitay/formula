import type { Metadata } from 'next'
import { BookAssessmentClient } from '@/components/marketing/book-assessment-client'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { FORMULA_SKILLS_CHECK } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Reserve your spot',
  description:
    'Booking hub: Formula Skills Check (June pre-book), youth block preview, field rental holds, birthday party deposit, and rental waiver — pay securely; optional parent portal after checkout.',
}

export default function BookAssessmentPage() {
  return (
    <MarketingInnerPage eyebrow="Booking hub" title="Reserve your spot" wide>
      <BookAssessmentClient skillsCheckPriceUsd={FORMULA_SKILLS_CHECK.priceUsd} />
    </MarketingInnerPage>
  )
}
