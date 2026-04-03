import React from 'react'
import Link from 'next/link'
import { mockPlayers } from '@/lib/mock-data/players'
import { getMembershipByPlayer } from '@/lib/mock-data/memberships'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge, StatusPill } from '@/components/ui/badge'
import { formatDate, getInitials, getAvatarColor, cn } from '@/lib/utils'

const PARENT_PLAYER_IDS = ['player-6', 'player-7']
const myPlayers = mockPlayers.filter(p => PARENT_PLAYER_IDS.includes(p.id))

export default function ParentPlayersPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader title="My Players" subtitle={`${myPlayers.length} players registered`} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {myPlayers.map(player => {
            const mem = getMembershipByPlayer(player.id)
            return (
              <div key={player.id} className="rounded-xl border border-border bg-surface p-5 space-y-5">
                {/* Player identity */}
                <div className="flex items-start gap-4">
                  <div className={cn('h-14 w-14 rounded-xl flex items-center justify-center text-xl font-black shrink-0', getAvatarColor(player.id))}>
                    {getInitials(player.firstName, player.lastName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-bold text-text-primary">{player.firstName} {player.lastName}</h3>
                      <StatusPill status={player.status} />
                    </div>
                    <p className="text-sm text-text-secondary mt-0.5">
                      {player.ageGroup} · #{player.jerseyNumber ?? 'n/a'} · {player.position}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">Member since {formatDate(player.joinedAt)}</p>
                  </div>
                </div>

                {/* Membership */}
                <div className="rounded-lg border border-border bg-surface-raised p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Membership</p>
                    {mem && <StatusPill status={mem.status} />}
                  </div>
                  {mem ? (
                    <>
                      <p className="text-sm font-semibold text-text-primary">{mem.planName}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Sessions remaining</span>
                        <span className={cn('font-bold', player.sessionsRemaining === 0 ? 'text-error' : player.sessionsRemaining <= 2 ? 'text-warning' : 'text-success')}>
                          {player.sessionsRemaining}
                        </span>
                      </div>
                      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full', player.sessionsRemaining === 0 ? 'bg-error' : 'bg-primary')}
                          style={{ width: typeof mem.sessionsTotal === 'number' ? `${(player.sessionsRemaining / mem.sessionsTotal) * 100}%` : '100%' }}
                        />
                      </div>
                      <p className="text-xs text-text-muted">Expires {formatDate(mem.expiryDate)}</p>
                    </>
                  ) : (
                    <p className="text-sm text-text-muted">No active membership</p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-surface-raised p-3 text-center">
                    <p className="text-2xl font-black text-text-primary">{player.totalSessionsAttended}</p>
                    <p className="text-xs text-text-muted mt-0.5">Total sessions</p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface-raised p-3 text-center">
                    <p className="text-2xl font-black text-accent-foreground">{player.sessionsRemaining}</p>
                    <p className="text-xs text-text-muted mt-0.5">Sessions left</p>
                  </div>
                </div>

                {/* Performance preview */}
                {player.performance && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Latest Assessment</p>
                    <div className="grid grid-cols-5 gap-2">
                      {(['speed', 'agility', 'endurance', 'strength', 'technicalScore'] as const).map(metric => (
                        <div key={metric} className="text-center">
                          <p className="text-sm font-bold text-text-primary">{player.performance![metric]}</p>
                          <p className="text-xs text-text-muted capitalize" style={{ fontSize: '10px' }}>
                            {metric === 'technicalScore' ? 'Tech' : metric.slice(0, 3)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link href="/parent/bookings" className="flex-1">
                    <Button variant="primary" size="sm" className="w-full">Book Session</Button>
                  </Link>
                  <Link href="/parent/progress" className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">View Progress</Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </PageContainer>
  )
}
