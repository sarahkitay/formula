import type { Metadata } from 'next'
import { TheFormulaFpiPage } from '@/components/marketing/the-formula-fpi-page'

export const metadata: Metadata = {
  title: 'The Formula',
  description:
    'How Formula Soccer Center measures performance: six pillars, age-weighted scoring, reassessment cadence, and family reporting in the parent portal.',
}

export default function TheFormulaPage() {
  return <TheFormulaFpiPage />
}
