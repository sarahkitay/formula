import dynamic from 'next/dynamic'
import { HomeFacilitySection } from '@/components/marketing/home-facility-section'
import { HomeIntentDialog } from '@/components/marketing/home-intent-dialog'
import { HomeWhatWeOfferNow } from '@/components/marketing/home-what-we-offer-now'
import { MarketingHero } from '@/components/marketing/marketing-hero'

const HomeAssessmentVideoSection = dynamic(() =>
  import('@/components/marketing/home-assessment-video-section').then(m => ({ default: m.HomeAssessmentVideoSection }))
)

const HomeWhatWeTrainIntro = dynamic(() =>
  import('@/components/marketing/home-what-we-train-intro').then(m => ({ default: m.HomeWhatWeTrainIntro }))
)

const HomeFieldsFormulaSection = dynamic(() =>
  import('@/components/marketing/home-fields-formula-section').then(m => ({ default: m.HomeFieldsFormulaSection }))
)

const HomeSpeedCourtSection = dynamic(() =>
  import('@/components/marketing/home-speed-court-section').then(m => ({ default: m.HomeSpeedCourtSection }))
)

const HomeSpeedTrackSection = dynamic(() =>
  import('@/components/marketing/home-speed-track-section').then(m => ({ default: m.HomeSpeedTrackSection }))
)

const HomeTeamworkSection = dynamic(() =>
  import('@/components/marketing/home-teamwork-section').then(m => ({ default: m.HomeTeamworkSection }))
)

const HomeNextSteps = dynamic(() => import('@/components/marketing/home-next-steps').then(m => ({ default: m.HomeNextSteps })))

const HomeCherundoloQuoteSection = dynamic(() =>
  import('@/components/marketing/home-cherundolo-quote-section').then(m => ({ default: m.HomeCherundoloQuoteSection }))
)

const HomeStartHereSection = dynamic(() =>
  import('@/components/marketing/home-start-here-section').then(m => ({ default: m.HomeStartHereSection }))
)

function SectionDivider() {
  return <div className="marketing-section-divider" aria-hidden />
}

export function MarketingHome() {
  return (
    <>
      <HomeIntentDialog />
      <MarketingHero />

      <SectionDivider />
      <HomeWhatWeOfferNow />

      <SectionDivider />
      <HomeFacilitySection />

      <SectionDivider />
      <HomeAssessmentVideoSection />

      <SectionDivider />
      <HomeWhatWeTrainIntro />

      <SectionDivider />
      <HomeFieldsFormulaSection />

      <SectionDivider />
      <HomeSpeedCourtSection />

      <SectionDivider />
      <HomeSpeedTrackSection />

      <SectionDivider />
      <HomeTeamworkSection />

      <SectionDivider />
      <HomeNextSteps />

      <SectionDivider />
      <HomeCherundoloQuoteSection />

      <SectionDivider />
      <HomeStartHereSection />
    </>
  )
}
