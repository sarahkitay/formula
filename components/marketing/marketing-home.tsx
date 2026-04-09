import { HomeFacilitySection } from '@/components/marketing/home-facility-section'
import { HomeSpeedCourtSection } from '@/components/marketing/home-speed-court-section'
import { HomeSpeedTrackSection } from '@/components/marketing/home-speed-track-section'
import { HomeFieldsFormulaSection } from '@/components/marketing/home-fields-formula-section'
import { HomeCherundoloQuoteSection } from '@/components/marketing/home-cherundolo-quote-section'
import { HomeTeamworkSection } from '@/components/marketing/home-teamwork-section'
import { MarketingHero } from '@/components/marketing/marketing-hero'
import { HomeNextSteps } from '@/components/marketing/home-next-steps'

function SectionDivider() {
  return <div className="marketing-section-divider" aria-hidden />
}

export function MarketingHome() {
  return (
    <>
      <MarketingHero />

      <SectionDivider />
      <HomeFacilitySection />

      <SectionDivider />
      <HomeSpeedCourtSection />

      <SectionDivider />
      <HomeFieldsFormulaSection />

      <SectionDivider />
      <HomeSpeedTrackSection />

      <SectionDivider />
      <HomeTeamworkSection />

      <SectionDivider />
      <HomeCherundoloQuoteSection />

      <SectionDivider />
      <HomeNextSteps />
    </>
  )
}
