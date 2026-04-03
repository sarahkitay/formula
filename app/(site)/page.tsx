import type { Metadata } from 'next'
import { MarketingHome } from '@/components/marketing/marketing-home'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Elevate your game at Formula Soccer Center - top-tier programs, cutting-edge training tech, elite facilities. Youth to adult, The Formula, membership, leagues, clinics, camps.',
}

export default function HomePage() {
  return <MarketingHome />
}
