import type { Metadata } from 'next'
import { TheFormulaFpiPage } from '@/components/marketing/the-formula-fpi-page'

export const metadata: Metadata = {
  title: 'The Formula',
  description:
    'Six pillars scored objectively—limiter, personalized plan, and reassessment every six months. Age-weighted composite score; results and reporting in the parent portal.',
}

export default function TheFormulaPage() {
  return <TheFormulaFpiPage />
}
