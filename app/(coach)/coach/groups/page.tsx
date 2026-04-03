import React from 'react'
import Link from 'next/link'
import { Users, ChevronRight } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getGroupsByCoach } from '@/lib/mock-data/groups'
import { getPlayersByGroup } from '@/lib/mock-data/players'
import { getInitials, getAvatarColor, cn } from '@/lib/utils'

const COACH_ID = 'coach-1'

export default function CoachGroupsPage() {
  const groups = getGroupsByCoach(COACH_ID)

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Today's Groups"
          subtitle={`${groups.length} active groups`}
        />

        <div className="space-y-5">
          {groups.map(group => {
            const players = getPlayersByGroup(group.id)
            return (
              <div key={group.id} className="rounded-xl border border-border bg-surface overflow-hidden">
                {/* Group header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-raised">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: group.color }} />
                    <div>
                      <p className="font-bold text-text-primary">{group.name}</p>
                      <p className="text-xs text-text-muted mt-0.5">{group.schedule}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{group.ageGroup}</Badge>
                    <span className="text-sm text-text-secondary">{players.length} players</span>
                  </div>
                </div>

                {/* Player list */}
                <div className="divide-y divide-border">
                  {players.map(player => (
                    <div key={player.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-raised transition-colors">
                      <div className={cn('h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0', getAvatarColor(player.id))}>
                        {getInitials(player.firstName, player.lastName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary">{player.firstName} {player.lastName}</p>
                        <p className="text-xs text-text-muted">#{player.jerseyNumber ?? 'n/a'} · {player.position}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={cn('text-sm font-semibold',
                            player.sessionsRemaining === 0 ? 'text-error'
                            : player.sessionsRemaining <= 2 ? 'text-warning'
                            : 'text-text-secondary'
                          )}>
                            {player.sessionsRemaining} left
                          </p>
                        </div>
                        <Link href="/coach/notes">
                          <Button variant="ghost" size="sm">
                            Notes <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </PageContainer>
  )
}
