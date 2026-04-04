import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
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

  <div className="mx-auto max-w-[1200px] border-t border-formula-frost/10 px-6 py-8 text-center">
    <Link
      href={MARKETING_HREF.rentals}
      className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt hover:opacity-90"
    >
      Rental & package inquiries →
    </Link>
    <p className="mx-auto mt-3 max-w-md text-[12px] leading-relaxed text-formula-mist">
      Explore the interactive floor plan on the{' '}
      <Link href={MARKETING_HREF.home} className="text-formula-frost underline-offset-4 hover:text-formula-paper hover:underline">
        homepage
      </Link>{' '}
      under Training.
    </p>
  </div>

  <div className="marketing-section-divider" aria-hidden />
  <TrustLayer />
  </>
  )
}
