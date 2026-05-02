import type { Metadata } from 'next'
import { FridayNightFriendliesLanding } from '@/components/marketing/friday-night-friendlies-landing'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'

export const metadata: Metadata = {
  title: 'Friday Night Friendlies',
  description:
    'Coach-run pickup soccer for ages 6–13 at Formula Soccer Center. First night Friday May 8, 2026. $20 per player; pre-register or walk up. King of the Hill small-sided games.',
}

export default function FridayNightFriendliesPage() {
  return (
    <MarketingInnerPage
      eyebrow="Events"
      title="Friday Night Friendlies"
      intro="Coach-run pickup soccer for ages 6–13 — balanced teams, small-sided games, and Friday-night energy. First night Friday May 8, 2026. $20 per player; walk-ups welcome."
      wide
    >
      <FridayNightFriendliesLanding />
    </MarketingInnerPage>
  )
}
