import type { Metadata } from 'next'
import { Suspense } from 'react'
import { OrganizerSignupClient } from '@/components/organizer/organizer-signup-client'

export const metadata: Metadata = {
  title: 'Create organizer account',
  robots: { index: false, follow: false },
}

export default function OrganizerSignupPage() {
  return (
    <div className="marketing-site min-h-[100dvh]">
      <div className="mx-auto max-w-lg px-6 pb-24 pt-28 md:pb-32 md:pt-32">
        <Suspense fallback={<p className="font-mono text-[11px] text-formula-mist">Loading…</p>}>
          <OrganizerSignupClient />
        </Suspense>
      </div>
    </div>
  )
}
