import React from 'react'
import Link from 'next/link'
import { Users, ChevronRight } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { getInitials, getAvatarColor, cn } from '@/lib/utils'
import { listFacilityPlayers } from '@/lib/facility/roster-list-server'

export default async function CoachGroupsPage() {
  const roster = await listFacilityPlayers(300)

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Facility roster"
          subtitle={
            roster.length > 0
              ? `${roster.length} athletes from Supabase · training groups UI pending group tables`
              : 'No players in Supabase yet, or service role is not configured'
          }
        />

        {roster.length === 0 ? (
          <p className="text-sm text-text-muted">
            When `players` is populated, the full roster appears here for session planning.
          </p>
        ) : (
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            <div className="flex items-center justify-between border-b border-border bg-surface-raised px-5 py-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-text-muted" />
                <p className="font-bold text-text-primary">All linked athletes</p>
              </div>
            </div>
            <div className="divide-y divide-border">
              {roster.map(player => (
                <div
                  key={player.id}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-raised"
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                      getAvatarColor(player.id)
                    )}
                  >
                    {getInitials(player.firstName, player.lastName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">
                      {player.firstName} {player.lastName}
                    </p>
                    <p className="text-xs text-text-muted">
                      #{player.jerseyNumber ?? 'n/a'} · {player.position} · {player.ageGroup}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        player.sessionsRemaining === 0
                          ? 'text-error'
                          : player.sessionsRemaining <= 2
                            ? 'text-warning'
                            : 'text-text-secondary'
                      )}
                    >
                      {player.sessionsRemaining} sessions left
                    </p>
                    <Link href="/coach/notes">
                      <Button variant="ghost" size="sm">
                        Notes <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
