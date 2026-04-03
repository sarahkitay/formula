import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { PARTIES_PRICING_STATUS } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Birthday parties',
  description:
    'Cutting-edge hosted parties: structured timelines, pro ops, facility restored to training standard.',
}

export default function PartiesPage() {
  return (
  <MarketingInnerPage
  eyebrow="Hosted experiences"
  title="Birthday parties - disciplined hosting."
  intro="Same ops seriousness as training: protected windows, clear roles - celebrate without inheriting chaos."
  >
  <h2>Premium, not improvised</h2>
  <p>
  <strong>Structured timelines + staff</strong> - setup, flow, teardown are the product.
  </p>
  <h2>Facility respect</h2>
  <p>
  Prep + restore to standard - this building is athlete inventory all week.
  </p>
  <h2>Pricing</h2>
  <p>
  <strong>{PARTIES_PRICING_STATUS}</strong>
  </p>
  <h2>Inquire</h2>
  <p>
  Send dates, age band, headcount - availability + packages aligned to scheduling cycles.
  </p>
  <p>
  Return to <Link href={MARKETING_HREF.events}>events hub</Link> or explore <Link href={MARKETING_HREF.facility}>facility</Link>.
  </p>
  </MarketingInnerPage>
  )
}
