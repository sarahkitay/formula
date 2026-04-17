import React from 'react'
import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { SectionHeader } from '@/components/ui/section-header'
import { getInitials, getAvatarColor, cn } from '@/lib/utils'
import { SITE } from '@/lib/site-config'
import { listFacilityPlayers } from '@/lib/facility/roster-list-server'

const METRICS = [
  { key: 'speed', label: 'Speed' },
  { key: 'agility', label: 'Agility' },
  { key: 'endurance', label: 'Endurance' },
  { key: 'strength', label: 'Strength' },
  { key: 'technicalScore', label: 'Technical' },
] as const

function MiniBar({ value }: { value: number }) {
  const color = value >= 85 ? '#f4fe00' : value >= 70 ? '#005700' : '#6b7280'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-raised">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="w-6 text-right text-xs font-medium text-text-secondary">{value}</span>
    </div>
  )
}

export default async function CoachPerformancePage() {
  const roster = await listFacilityPlayers(300)
  const assessed = roster.filter(p => p.performance)

  return (
    <PageContainer>
      <div className="space-y-7">
        <PageHeader title="Player performance" subtitle="Athletes with FPI scores stored on their profile" />

        <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
          <p className="text-sm font-semibold text-text-primary">Lab and machine data: roadmap</p>
          <p className="mt-0.5 text-xs text-text-muted">
            Speed track, double speed court, Footbot, coach input. {SITE.performanceDataPolicy}
          </p>
        </div>

        {assessed.length === 0 ? (
          <p className="text-sm text-text-muted">
            No athletes in the roster have `performance` summaries on their profile yet. Open an athlete from the
            roster after assessments are recorded, or use Admin → Performance.
          </p>
        ) : (
          <div className="space-y-4">
            <SectionHeader title="Assessed athletes" description={`${assessed.length} with profile scores`} />
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="grid grid-cols-[1fr_repeat(5,minmax(80px,1fr))] border-b border-border bg-surface-raised px-4 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">Player</span>
                {METRICS.map(m => (
                  <span key={m.key} className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    {m.label}
                  </span>
                ))}
              </div>
              {assessed.map(player => (
                <Link
                  key={player.id}
                  href={`/coach/performance/${player.id}`}
                  className="grid grid-cols-[1fr_repeat(5,minmax(80px,1fr))] items-center border-b border-border px-4 py-3 text-inherit no-underline transition-colors last:border-0 hover:bg-surface-raised focus-visible:bg-surface-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#005700]"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                        getAvatarColor(player.id)
                      )}
                    >
                      {getInitials(player.firstName, player.lastName)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary">
                        {player.firstName} {player.lastName}
                      </p>
                      <p className="text-xs text-text-muted">
                        #{player.jerseyNumber ?? 'n/a'} · {player.position}
                      </p>
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
        )}
      </div>
    </PageContainer>
  )
}
