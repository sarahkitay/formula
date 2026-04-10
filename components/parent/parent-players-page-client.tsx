'use client'

import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { StatusPill } from '@/components/ui/badge'
import { getInitials, getAvatarColor, cn } from '@/lib/utils'
import { useParentLinkedPlayers } from '@/components/parent/parent-linked-players-context'

export function ParentPlayersPageClient() {
  const { players, loading, error } = useParentLinkedPlayers()

  if (loading) {
    return (
      <PageContainer>
        <div className="py-16 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">Loading players…</div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="My Players" subtitle="Linked athletes" />
        <p className="text-sm text-amber-200/90">{error}</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader title="My Players" subtitle={`${players.length} athlete${players.length !== 1 ? 's' : ''} linked to your account`} />

        {players.length === 0 ? (
          <p className="text-sm text-text-muted">
            No players linked yet. Complete registration or ask staff to link your athlete to this parent account.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {players.map((player) => (
              <div key={player.id} className="space-y-5 rounded-xl border border-border bg-surface p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xl font-black',
                      getAvatarColor(player.id)
                    )}
                  >
                    {getInitials(player.firstName, player.lastName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold text-text-primary">
                        {player.firstName} {player.lastName}
                      </h3>
                      <StatusPill status="active" />
                    </div>
                    <p className="mt-0.5 text-sm text-text-secondary">{player.ageGroup}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-surface-raised p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Membership</p>
                  <p className="mt-2 text-sm text-text-muted">
                    Session packages and recurring plans will show here when connected to billing. For balances, check with the front desk.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-surface-raised p-3 text-center">
                    <p className="text-2xl font-black text-text-primary">—</p>
                    <p className="mt-0.5 text-xs text-text-muted">Sessions attended</p>
                    <p className="mt-1 text-[10px] text-text-muted">When attendance syncs</p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface-raised p-3 text-center">
                    <p className="text-2xl font-black text-accent-foreground">—</p>
                    <p className="mt-0.5 text-xs text-text-muted">Sessions left</p>
                    <p className="mt-1 text-[10px] text-text-muted">Ask at desk</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href="/parent/bookings" className="flex-1">
                    <Button variant="primary" size="sm" className="w-full">
                      Book Session
                    </Button>
                  </Link>
                  <Link href={`/parent/progress/${player.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      View Progress
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
