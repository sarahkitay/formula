'use client'

import { Inbox } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { ParentPanel } from '@/components/parent/parent-panel'

export function ParentMessagesPageClient() {
  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Messages"
          subtitle="Session reminders, schedule changes, check-in confirmations, and invitations - in one place."
        />

        <ParentPanel title="Inbox" eyebrow="COMMUNICATION">
          <div className="flex flex-col items-center py-10 text-center">
            <Inbox className="h-10 w-10 text-formula-mist/50" aria-hidden />
            <p className="mt-4 text-sm font-medium text-formula-paper">No messages yet</p>
            <p className="mt-2 max-w-md text-sm text-formula-frost/75">
              When staff or the system send reminders and updates, they&apos;ll show here. This inbox isn&apos;t connected to demo data — your real thread starts
              empty.
            </p>
          </div>
          <p className="mt-6 text-center text-xs text-formula-mist">Push & SMS preferences - coming with mobile app.</p>
        </ParentPanel>
      </div>
    </PageContainer>
  )
}
