import React from 'react'
import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { SectionHeader } from '@/components/ui/section-header'
import { getGroupsByCoach } from '@/lib/mock-data/groups'
import { getPlayersByGroup } from '@/lib/mock-data/players'
import { getInitials, getAvatarColor, cn } from '@/lib/utils'
import { SITE } from '@/lib/site-config'

const COACH_ID = 'coach-1'
const METRICS = [
  { key: 'speed',          label: 'Speed' },
  { key: 'agility',        label: 'Agility' },
  { key: 'endurance',      label: 'Endurance' },
  { key: 'strength',       label: 'Strength' },
  { key: 'technicalScore', label: 'Technical' },
] as const

function MiniBar({ value }: { value: number }) {
  const color = value >= 85 ? '#f4fe00' : value >= 70 ? '#005700' : '#6b7280'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-surface-raised rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-medium text-text-secondary w-6 text-right">{value}</span>
    </div>
  )
}

export default function CoachPerformancePage() {
  const groups = getGroupsByCoach(COACH_ID)

  return (
    <PageContainer>
      <div className="space-y-7">
        <PageHeader
          title="Player Performance"
          subtitle="Assessment scores for your groups"
        />

        {/* Machine integration notice */}
        <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
          <p className="text-sm font-semibold text-text-primary">Lab and machine data: roadmap</p>
          <p className="mt-0.5 text-xs text-text-muted">
            Speed track, double speed court, Footbot, coach input. {SITE.performanceDataPolicy}
          </p>
        </div>

        {groups.map(group => {
          const players = getPlayersByGroup(group.id).filter(p => p.performance)
          if (players.length === 0) return null
          return (
            <div key={group.id} className="space-y-4">
              <SectionHeader
                title={group.name}
                description={`${players.length} assessed`}
              />
              <div className="rounded-xl border border-border bg-surface overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-[1fr_repeat(5,minmax(80px,1fr))] px-4 py-2.5 border-b border-border bg-surface-raised">
                  <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">Player</span>
                  {METRICS.map(m => (
                    <span key={m.key} className="text-xs font-semibold uppercase tracking-wide text-text-muted">{m.label}</span>
                  ))}
                </div>
                {/* Rows */}
                {players.map(player => (
                  <Link
                    key={player.id}
                    href={`/coach/performance/${player.id}`}
                    className="grid grid-cols-[1fr_repeat(5,minmax(80px,1fr))] items-center border-b border-border px-4 py-3 text-inherit no-underline transition-colors last:border-0 hover:bg-surface-raised focus-visible:bg-surface-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#005700]"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className={cn('h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0', getAvatarColor(player.id))}>
                        {getInitials(player.firstName, player.lastName)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{player.firstName} {player.lastName}</p>
                        <p className="text-xs text-text-muted">#{player.jerseyNumber ?? 'n/a'} · {player.position}</p>
                      </div>
                    </div>
                    {METRICS.map(m => (
                      <div key={m.key} className="pr-4">
                        <MiniBar value={player.performance![m.key]} />
                      </div>
                    ))}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </PageContainer>
  )
}
