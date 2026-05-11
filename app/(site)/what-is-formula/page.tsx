import type { Metadata } from 'next'
import { WhatIsFormulaPageContent } from '@/components/marketing/what-is-formula-page'

export const metadata: Metadata = {
  title: 'What Formula Is',
  description:
    'Data-driven individual soccer training that complements your club team: measurable skill gains via assessments and tech, without travel or team commitments.',
}

export default function WhatIsFormulaPage() {
  return <WhatIsFormulaPageContent />
}
