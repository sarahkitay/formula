import type { Metadata } from 'next'
import { MarketingHome } from '@/components/marketing/marketing-home'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Formula Soccer Center in Van Nuys: elite soccer development, real performance data, and structured programming for every level. Assessments, The Formula, clinics, and adult programming.',
}

export default function HomePage() {
  return <MarketingHome />
}
