import React from 'react'
import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { SectionHeader } from '@/components/ui/section-header'
import { StatCard } from '@/components/ui/stat-card'
import { CountUp } from '@/components/ui/count-up'
import { Badge } from '@/components/ui/badge'
import { getInitials, getAvatarColor, cn } from '@/lib/utils'
import { listFacilityPlayers } from '@/lib/facility/roster-list-server'
import { SITE } from '@/lib/site-config'
import { Button } from '@/components/ui/button'

const METRICS = ['speed', 'agility', 'endurance', 'strength', 'technicalScore'] as const

function PerformanceBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="relative h-1.5 bg-surface-raised rounded-full overflow-hidden">
      <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
    </div>
  )
}

export default async function PerformancePage() {
  const roster = await listFacilityPlayers(500)
  const playersWithPerf = roster.filter(p => p.performance)
  const n = playersWithPerf.length
  const avgTechnical = n > 0 ? Math.round(playersWithPerf.reduce((s, p) => s + (p.performance?.technicalScore ?? 0), 0) / n) : 0
  const avgSpeed = n > 0 ? Math.round(playersWithPerf.reduce((s, p) => s + (p.performance?.speed ?? 0), 0) / n) : 0
  const topPerformer = [...playersWithPerf].sort(
    (a, b) => (b.performance?.technicalScore ?? 0) - (a.performance?.technicalScore ?? 0)
  )[0]

  return (
    <PageContainer>
      <div className="space-y-7">
        <PageHeader
          title="Performance Overview"
          subtitle="Facility-wide metrics · official FPI model lives in FPI console (internal)"
          actions={
            <Link href="/admin/fpi">
              <Button variant="secondary" size="sm">
                FPI management
              </Button>
            </Link>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Players Assessed"
            value={<CountUp end={playersWithPerf.length} format="integer" />}
            accent
            href="/admin/performance"
          />
          <StatCard
            label="Avg. Technical Score"
            value={
              <>
                <CountUp end={avgTechnical} format="integer" />%
              </>
            }
            href="/admin/performance"
          />
          <StatCard
            label="Avg. Speed Score"
            value={
              <>
                <CountUp end={avgSpeed} format="integer" />%
              </>
            }
            href="/admin/performance"
          />
          <StatCard
            label="Top Performer"
            value={topPerformer ? `${topPerformer.firstName} ${topPerformer.lastName}` : 'N/A'}
            sublabel={
              topPerformer ? (
                <>
                  <CountUp end={topPerformer.performance?.technicalScore ?? 0} format="integer" />% technical
                </>
              ) : undefined
            }
            href={topPerformer ? `/admin/performance/${topPerformer.id}` : undefined}
          />
        </div>

        {/* Integration notice */}
        <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
          <p className="text-sm font-semibold text-text-primary">Machine and lab data: integration roadmap</p>
          <p className="mt-0.5 text-xs text-text-muted">
            Planned feeds: speed track, double speed court, Footbot, and coach input. {SITE.performanceDataPolicy}
          </p>
        </div>

        {/* Player performance cards */}
        <div className="space-y-4">
          <SectionHeader title="Player Assessments" description={`${playersWithPerf.length} players with FPI scores in app`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {playersWithPerf.length === 0 && (
              <p className="text-sm text-text-muted lg:col-span-2">
                No in-app performance summaries yet. Open a player from the roster below once assessments are stored, or wire lab feeds per the integration notice.
              </p>
            )}
            {playersWithPerf.map(player => {
              const perf = player.performance!
              return (
                <Link
                  key={player.id}
                  href={`/admin/performance/${player.id}`}
                  className="block rounded-xl border border-border bg-surface p-5 space-y-4 text-inherit no-underline transition-colors hover:border-border-bright hover:bg-surface-raised/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005700]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn('h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold', getAvatarColor(player.id))}>
                        {getInitials(player.firstName, player.lastName)}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">{player.firstName} {player.lastName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" size="sm">{player.ageGroup}</Badge>
                          <span className="text-xs text-text-muted">{player.position}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-accent-foreground">{perf.technicalScore}</p>
                      <p className="text-xs text-text-muted">tech score</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {METRICS.map(metric => (
                      <div key={metric} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-muted capitalize">{metric === 'technicalScore' ? 'Technical' : metric}</span>
                          <span className="text-text-secondary font-medium">{perf[metric]}</span>
                        </div>
                        <PerformanceBar
                          value={perf[metric]}
                          color={perf[metric] >= 85 ? '#f4fe00' : perf[metric] >= 70 ? '#005700' : '#6b7280'}
                        />
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-text-muted">
                    Last assessed: {new Date(perf.lastAssessed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
