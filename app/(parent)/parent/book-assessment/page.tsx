import type { Metadata } from 'next'
import { ParentBookAssessmentClient } from '@/components/parent/parent-book-assessment-client'

export const metadata: Metadata = {
  title: 'Book a Skills Check',
  description: 'Book a Formula Skills Check from your parent portal using live availability.',
  robots: { index: false, follow: false },
}

export default function ParentBookAssessmentPage() {
  return <ParentBookAssessmentClient />
}
