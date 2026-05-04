import type { Metadata } from 'next'
import { MarketingHome } from '@/components/marketing/marketing-home'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Serious soccer training with clear results at Formula Soccer Center in Van Nuys: structured sessions, assessments, real data, and programs for club through elite players.',
}

export default function HomePage() {
  return <MarketingHome />
}
