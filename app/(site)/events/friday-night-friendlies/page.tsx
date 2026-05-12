import type { Metadata } from 'next'
import { FridayNightFriendliesLanding } from '@/components/marketing/friday-night-friendlies-landing'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'

export const metadata: Metadata = {
  title: 'Friday Night Friendlies',
  description:
    'Coach-run pickup soccer for ages 6–14 at Formula Soccer Center. Ongoing Friday nights when we are open: 5:30 arrival, games 6:00–7:30 PM. $20 per player; pre-register or walk up. King of the Hill small-sided games.',
}

export default function FridayNightFriendliesPage() {
  return (
    <MarketingInnerPage
      eyebrow="Events"
      title="Friday Night Friendlies"
      intro="Coach-run pickup soccer for ages 6–14 - balanced teams, small-sided games, and Friday-night energy. Ongoing Friday nights when we are open (5:30 arrival, 6:00–7:30 PM games). $20 per player; walk-ups welcome."
      wide
    >
      <FridayNightFriendliesLanding />
    </MarketingInnerPage>
  )
}
