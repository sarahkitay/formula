import type { Metadata } from 'next'
import { SummerCamp2026Landing } from '@/components/marketing/summer-camp-2026-landing'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { SUMMER_CAMP_2026 } from '@/lib/marketing/summer-camp-2026-data'
import { SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT, SUMMER_CAMP_2026_WEEK_CHECKOUT } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Summer Camp 2026',
  description: `Formula Soccer Center summer camp 2026: ${SUMMER_CAMP_2026.ageRange}, Mon–Fri ${SUMMER_CAMP_2026.dayHours}, themed weeks across Footbot, Speed Brain, Speed Track, Double Speed Court, and Performance Center. $${SUMMER_CAMP_2026_WEEK_CHECKOUT.priceUsd} per week or $${SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT.priceUsd} for a four-week bundle.`,
}

export default function SummerCamp2026Page() {
  return (
    <MarketingInnerPage
      eyebrow="Events"
      title={SUMMER_CAMP_2026.seasonLabel}
      intro={`${SUMMER_CAMP_2026.ageRange} · Mon–Fri · ${SUMMER_CAMP_2026.dayHours} · eight themed weeks (Footbot, Speed Brain, Speed Track, Double Speed Court, Performance Center). $${SUMMER_CAMP_2026_WEEK_CHECKOUT.priceUsd} per week or $${SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT.priceUsd} for a four-week bundle (weeks 1–4 or 5–8).`}
      wide
    >
      <SummerCamp2026Landing />
    </MarketingInnerPage>
  )
}
