import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { PublicFacilityMap } from '@/components/marketing/public-facility-map'
import { TrustLayer } from '@/components/marketing/trust-layer'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export const metadata: Metadata = {
  title: 'Facility',
  description:
    'State-of-the-art asset model: stations, protected fields, speed + cognitive infrastructure, application zones.',
}

export default function FacilityPage() {
  return (
  <>
  <MarketingInnerPage
  eyebrow="Facility"
  title="Performance building <br> not a rental hall."
  intro="Integrated system: protected field inventory, purposeful stations, disciplined transitions. Random space = random training."
  wide
  >
  <h2>Station-based development</h2>
  <p>
  Sequenced technical, athletic, cognitive, and application work - coaching stays <strong>precise</strong>, athletes stay <strong>accountable</strong>.
  </p>
  <h2>Protected field inventory</h2>
  <p>
  Premium surfaces on a real schedule - not open slots that fragment quality. That’s how curriculum and <Link href={MARKETING_HREF.fpi}>The Formula</Link> stay honest.
  </p>
  <h2>Why it matters</h2>
  <p>
  Repetition needs standards. An ops-shaped building delivers reps without chaos.
  </p>
  </MarketingInnerPage>

  <section className="border-t border-formula-frost/10 bg-formula-deep/50" aria-label="Interactive facility floor plan">
    <div className="mx-auto max-w-[1200px] px-6 py-14 md:py-16">
      <div className="not-prose max-w-3xl">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-formula-mist">Floor plan · select a zone</p>
        <p className="mt-2 max-w-2xl text-[13px] leading-snug text-formula-frost/80 md:text-[14px] md:leading-relaxed">
          Tap a zone: fields, speed, specialized stations — how each layer supports training and application.
        </p>
      </div>
      <div className="not-prose mt-6">
        <PublicFacilityMap />
      </div>
    </div>
  </section>

  <div className="mx-auto max-w-[1200px] border-t border-formula-frost/10 px-6 py-8 text-center">
    <Link
      href={MARKETING_HREF.rentals}
      className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt hover:opacity-90"
    >
      Rental & package inquiries →
    </Link>
  </div>

  <div className="marketing-section-divider" aria-hidden />
  <TrustLayer />
  </>
  )
}
