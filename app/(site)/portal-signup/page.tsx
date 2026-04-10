import type { Metadata } from 'next'
import { Suspense } from 'react'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { PortalSignupClient } from '@/components/marketing/portal-signup-client'

export const metadata: Metadata = {
  title: 'Create parent portal',
  robots: { index: false, follow: false },
}

export default function PortalSignupPage() {
  return (
    <MarketingInnerPage
      eyebrow="After checkout"
      title="Set up your parent portal"
      intro="Start with your athletes’ names; they’ll show at the top of your portal. Then set a password using the same email you used at checkout."
      wide
    >
      <Suspense fallback={<p className="font-mono text-[11px] text-formula-frost/50">Loading…</p>}>
        <PortalSignupClient />
      </Suspense>
    </MarketingInnerPage>
  )
}
