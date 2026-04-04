import type { ReactNode } from 'react'
import Link from 'next/link'
import { ConversionPathways } from '@/components/marketing/conversion-pathways'
import { HomeHighlights } from '@/components/marketing/home-highlights'
import { HomeFacilitySection } from '@/components/marketing/home-facility-section'
import { HomeSpeedCourtSection } from '@/components/marketing/home-speed-court-section'
import { HomeSpeedTrackSection } from '@/components/marketing/home-speed-track-section'
import { HomeFieldsFormulaSection } from '@/components/marketing/home-fields-formula-section'
import { HomeTeamworkSection } from '@/components/marketing/home-teamwork-section'
import { MarketingHero } from '@/components/marketing/marketing-hero'
import { PublicFacilityMap } from '@/components/marketing/public-facility-map'
import { HomeFacilityTour } from '@/components/marketing/home-facility-tour'
import { StartHereSection } from '@/components/marketing/start-here-section'
import { MarketingTextReveal } from '@/components/marketing/marketing-text-reveal'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SITE_VOICE } from '@/lib/marketing/site-voice'

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-mist">{children}</p>
}

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
      <section id="programs" className="bg-formula-deep">
        <div className="relative mx-auto max-w-[1200px] px-6 pb-8 pt-20 md:pb-12 md:pt-28">
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <div>
              <SectionLabel>Training</SectionLabel>
              <MarketingTextReveal>
                <h2 className="mt-4 font-mono text-2xl font-semibold tracking-tight text-formula-paper md:text-[1.65rem]">
                  Precision, technique, and game intelligence for every level.
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-formula-frost/85">{SITE_VOICE.programDesign}</p>
              </MarketingTextReveal>
              <div className="mt-5 max-w-3xl">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-formula-mist">Floor plan · select a zone</p>
                <p className="mt-1 max-w-2xl text-[13px] leading-snug text-formula-frost/80">
                  Tap a zone: fields, speed, specialized stations - how each layer supports training + application.
                </p>
                <div className="mt-2">
                  <PublicFacilityMap compact />
                </div>
              </div>
            </div>
            <ul className="space-y-0 border border-formula-frost/10 bg-formula-paper/[0.02] font-mono text-[11px] uppercase tracking-[0.12em] text-formula-mist">
              {(
                [
                  ['01', 'Programs', SITE_VOICE.programInventoryLine],
                  ['02', 'Who we train', SITE_VOICE.whoWeTrain],
                  ['03', 'Partners', SITE_VOICE.partners],
                  ['04', 'What we build', SITE_VOICE.whatWeBuildLine],
                ] as const
              ).map(([id, title, body]) => (
                <li key={id} className="flex gap-4 border-b border-formula-frost/8 p-4 last:border-b-0 md:p-5">
                  <span className="shrink-0 text-formula-volt/95">{id}</span>
                  <span className="min-w-0">
                    <span className="block text-formula-paper/95">{title}</span>
                    <span className="mt-1 block font-sans text-[13px] normal-case leading-relaxed tracking-normal text-formula-mist">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SectionDivider />
      <HomeFacilityTour />

      <SectionDivider />
      <section id="ecosystem" className="relative mx-auto max-w-[1200px] px-6 py-24 md:py-32">
        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <SectionLabel>How we operate</SectionLabel>
            <MarketingTextReveal>
              <h2 className="mt-4 font-mono text-2xl font-semibold tracking-tight text-formula-paper md:text-[1.65rem]">
                State-of-the-art ecosystem. Zero warehouse energy.
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-formula-frost/85">
                <strong className="font-medium text-formula-paper">Structured · measured · premium.</strong> Published blocks, controlled competition, capped
                density, coaching standards that hold - <strong className="font-medium text-formula-paper">The Formula</strong> keeps progression visible for
                families without public leaderboards.
              </p>
            </MarketingTextReveal>
            <Link
              href={MARKETING_HREF.whatIsFormula}
              className="mt-8 inline-flex font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt hover:opacity-90"
            >
              What Formula is →
            </Link>
          </div>
          <ul className="space-y-0 border border-formula-frost/10 bg-formula-paper/[0.02] font-mono text-[11px] uppercase tracking-[0.12em] text-formula-mist">
            {[
              ['01', 'Structured', 'Published blocks. Clean transitions. Sessions run as designed.'],
              ['02', 'Measurable', 'The Formula + reassessment. Clear progression for families - no public leaderboards.'],
              ['03', 'Premium', 'Inventory, ratios, experience - non-negotiable.'],
              ['04', 'Disciplined', 'Capped capacity. Protected resets. Pro floor ops - weekly.'],
            ].map(([id, title, body]) => (
              <li key={id} className="flex gap-4 border-b border-formula-frost/8 p-4 last:border-b-0 md:p-5">
                <span className="shrink-0 text-formula-volt/95">{id}</span>
                <span className="min-w-0">
                  <span className="block text-formula-paper/95">{title}</span>
                  <span className="mt-1 block font-sans text-[13px] normal-case leading-relaxed tracking-normal text-formula-mist">{body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SectionDivider />
      <HomeHighlights />

      <SectionDivider />
      <ConversionPathways />

      <SectionDivider />
      <StartHereSection />
    </>
  )
}
