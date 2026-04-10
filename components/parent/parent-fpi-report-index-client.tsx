'use client'

import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { ParentPanel } from '@/components/parent/parent-panel'
import { useParentLinkedPlayers } from '@/components/parent/parent-linked-players-context'

export function ParentFpiReportIndexClient() {
  const { players, loading, error } = useParentLinkedPlayers()

  if (loading) {
    return (
      <PageContainer>
        <div className="py-16 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-formula-mist">Loading reports…</div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader
          title="FPI reports"
          subtitle="Choose an athlete to view their Formula Performance Index report - private to your family and coaching staff."
        />
        <p className="text-sm text-amber-200/90">{error}</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="FPI reports"
          subtitle="Choose an athlete to view their Formula Performance Index report - private to your family and coaching staff."
        />

        <ParentPanel title="Your athletes" eyebrow="REPORTS">
          {players.length === 0 ? (
            <p className="text-sm text-formula-frost/75">No linked athletes yet. Link a player to your account to open a report.</p>
          ) : (
            <ul className="divide-y divide-formula-frost/10">
              {players.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/parent/fpi-report/${p.id}`}
                    className="flex items-center justify-between py-4 text-inherit no-underline transition-colors hover:text-formula-volt"
                  >
                    <span className="font-medium text-formula-paper">
                      {p.firstName} {p.lastName}
                    </span>
                    <span className="text-sm text-formula-mist">{p.ageGroup}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </ParentPanel>
      </div>
    </PageContainer>
  )
}
