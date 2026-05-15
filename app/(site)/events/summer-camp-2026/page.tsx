import type { Metadata } from 'next'
import { SummerCamp2026Landing } from '@/components/marketing/summer-camp-2026-landing'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { SUMMER_CAMP_2026 } from '@/lib/marketing/summer-camp-2026-data'
import { summerCamp2026PublicPriceLine } from '@/lib/marketing/public-pricing'

export async function generateMetadata(): Promise<Metadata> {
  const price = summerCamp2026PublicPriceLine()
  return {
    title: 'Summer Camp 2026',
    description: `Formula Soccer Center summer camp 2026: ${SUMMER_CAMP_2026.ageRange}, Mon–Fri ${SUMMER_CAMP_2026.dayHours}, themed weeks across Footbot, Speed Brain, Speed Track, Double Speed Court, and Performance Center. ${price}`,
  }
}

export default function SummerCamp2026Page() {
  const priceLine = summerCamp2026PublicPriceLine()
  return (
    <MarketingInnerPage
      eyebrow="Events"
      title={SUMMER_CAMP_2026.seasonLabel}
      intro={`${SUMMER_CAMP_2026.ageRange} · Mon–Fri · ${SUMMER_CAMP_2026.dayHours} · eight themed weeks (Footbot, Speed Brain, Speed Track, Double Speed Court, Performance Center). ${priceLine}`}
      wide
    >
      <SummerCamp2026Landing />
    </MarketingInnerPage>
  )
}
