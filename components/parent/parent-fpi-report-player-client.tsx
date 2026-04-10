'use client'

import { useMemo } from 'react'
import { notFound } from 'next/navigation'
import { FpiReportPremium } from '@/components/parent/fpi-report-premium'
import { useParentLinkedPlayers } from '@/components/parent/parent-linked-players-context'

export function ParentFpiReportPlayerClient({ playerId }: { playerId: string }) {
  const { players, loading } = useParentLinkedPlayers()
  const player = useMemo(() => players.find((p) => p.id === playerId), [players, playerId])

  if (!loading && !player) {
    notFound()
  }

  if (loading || !player) {
    return (
      <div className="portal-brand-surface parent-os flex min-h-[40vh] items-center justify-center text-formula-mist">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em]">Loading report…</p>
      </div>
    )
  }

  return (
    <FpiReportPremium
      player={{
        firstName: player.firstName,
        lastName: player.lastName,
        ageGroup: player.ageGroup,
      }}
      backHref="/parent/fpi-report"
    />
  )
}
