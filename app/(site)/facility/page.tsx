import type { Metadata } from 'next'
import Link from 'next/link'
import { HomeFacilityTour } from '@/components/marketing/home-facility-tour'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { PublicFacilityMap } from '@/components/marketing/public-facility-map'
import { TrustLayer } from '@/components/marketing/trust-layer'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export const metadata: Metadata = {
  title: 'Facility',
  description:
    'Purpose-built soccer performance facility in Van Nuys: match-grade turf, Speed Track, Double Speed Court, Footbot, and assessment zones tied to The Formula.',
}

export default function FacilityPage() {
  return (
    <>
      <MarketingInnerPage
        eyebrow="Facility"
        title="Built for development. <br> Not rented by the hour."
        intro="Formula Soccer Center is a purpose-built soccer performance facility, designed around structured training, not open gym access. Every surface, station, and zone has a job."
        wide
      >
        <h2>What&apos;s inside</h2>

        <h3 className="!mt-8 !mb-2 font-mono text-sm font-semibold uppercase tracking-[0.12em] text-formula-frost/90">Match-grade turf lanes</h3>
        <p>
          Multiple field zones with netting, buffers, and controlled surfaces, built for technical and application work, not chaotic open play.
        </p>

        <h3 className="!mt-8 !mb-2 font-mono text-sm font-semibold uppercase tracking-[0.12em] text-formula-frost/90">Speed Track</h3>
        <p>
          Linear acceleration measured and tracked: first-step explosiveness, repeat sprints, and mechanical efficiency in a controlled environment.
        </p>

        <h3 className="!mt-8 !mb-2 font-mono text-sm font-semibold uppercase tracking-[0.12em] text-formula-frost/90">Double Speed Court</h3>
        <p>
          Reaction time, scanning, and decision-making under pressure. The cognitive and perceptual side of soccer, with real data capture.
        </p>

        <h3 className="!mt-8 !mb-2 font-mono text-sm font-semibold uppercase tracking-[0.12em] text-formula-frost/90">Footbot</h3>
        <p>Precision ball technology for high-repetition technical training. Every rep counted and calibrated.</p>

        <h3 className="!mt-8 !mb-2 font-mono text-sm font-semibold uppercase tracking-[0.12em] text-formula-frost/90">Performance center</h3>
        <p>
          Assessment, analysis, and coaching review, where <Link href={MARKETING_HREF.fpi}>The Formula</Link> scores are captured and plans are built.
        </p>

        <h3 className="!mt-8 !mb-2 font-mono text-sm font-semibold uppercase tracking-[0.12em] text-formula-frost/90">Support zones</h3>
        <p>Gym, flex space, and party and event capacity, same operational standard throughout.</p>

        <h2 className="!mt-14">Why it matters</h2>
        <p>
          Random space produces random training. Every zone at Formula is tied to a specific pillar in{' '}
          <Link href={MARKETING_HREF.fpi}>The Formula</Link>, so when your athlete works on speed, decision-making, or technical execution, it&apos;s being
          measured in an environment designed for exactly that.
        </p>
        <p>This is what separates Formula from a rental hall with turf.</p>
      </MarketingInnerPage>

      <section className="border-t border-formula-frost/10 bg-formula-deep/50" aria-label="Interactive facility floor plan">
        <div className="mx-auto max-w-[1200px] px-6 py-14 md:py-16">
          <div className="not-prose max-w-3xl">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-formula-mist">Interactive floor plan</p>
            <p className="mt-2 max-w-2xl text-[13px] leading-snug text-formula-frost/80 md:text-[14px] md:leading-relaxed">
              Tour every zone before you walk in. Click any area to see what it does and how it connects to The Formula and your athlete&apos;s training plan.
            </p>
          </div>
          <div className="not-prose mt-6">
            <PublicFacilityMap />
          </div>
        </div>
      </section>

      <div className="marketing-section-divider" aria-hidden />
      <HomeFacilityTour />

      <div className="mx-auto max-w-[1200px] border-t border-formula-frost/10 px-6 py-8 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Link
            href={MARKETING_HREF.bookAssessmentPortal}
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt hover:opacity-90"
          >
            Book an assessment →
          </Link>
          <Link
            href={MARKETING_HREF.rentals}
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-frost/80 hover:text-formula-volt"
          >
            Rental inquiry →
          </Link>
        </div>
      </div>

      <div className="marketing-section-divider" aria-hidden />
      <TrustLayer />
    </>
  )
}
