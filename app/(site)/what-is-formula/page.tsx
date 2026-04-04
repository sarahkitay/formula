import type { Metadata } from 'next'
import { WhatIsFormulaPageContent } from '@/components/marketing/what-is-formula-page'

export const metadata: Metadata = {
  title: 'What Formula Is',
  description:
    'Cutting-edge club-complementary development: structured blocks, The Formula, Friday circuit, clinics, camps, adults, rentals, premium events.',
}

export default function WhatIsFormulaPage() {
  return <WhatIsFormulaPageContent />
}
