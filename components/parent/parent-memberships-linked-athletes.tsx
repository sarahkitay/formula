'use client'

import { SectionHeader } from '@/components/ui/section-header'
import { SESSION_PACKAGE_10 } from '@/lib/marketing/public-pricing'
import { useParentLinkedPlayers } from '@/components/parent/parent-linked-players-context'

export function ParentMembershipsLinkedAthletes() {
  const { players, loading, error } = useParentLinkedPlayers()

  if (loading) {
    return (
      <div className="space-y-4">
        <SectionHeader title="Your athletes" description="Linked players and membership status once recurring plans go live." />
        <p className="text-sm text-text-muted">Loading…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <SectionHeader title="Your athletes" description="Linked players and membership status once recurring plans go live." />
        <p className="text-sm text-amber-200/90">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Your athletes"
        description="Linked players from your account. Session balances and plans sync here when billing is connected."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {players.length === 0 ? (
          <p className="text-sm text-text-secondary">No athletes linked to this parent account yet.</p>
        ) : (
          players.map((player) => (
            <div
              key={player.id}
              className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-bright"
            >
              <p className="text-lg font-semibold text-text-primary">
                {player.firstName} {player.lastName}
              </p>
              <p className="mt-1 text-xs text-text-muted">{player.ageGroup}</p>
              <p className="mt-2 text-sm text-text-secondary">
                No membership details in the portal yet. The {SESSION_PACKAGE_10.sessions}-session package (${SESSION_PACKAGE_10.priceUsd}) is our current
                offer. Ask staff at your next visit or assessment to purchase or redeem sessions.
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
