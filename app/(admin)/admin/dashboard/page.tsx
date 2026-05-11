import React from 'react'
import Link from 'next/link'

/** Always fresh shell + nav; do not serve a cached dashboard layout from an older build. */
export const dynamic = 'force-dynamic'
import { PageContainer } from '@/components/layout/app-shell'
import { ModuleBlock } from '@/components/dashboard/module-block'
import { AdminExecutiveOverviewSection } from '@/components/admin/admin-executive-overview-section'
import { adminDashboardPinnedTiles, adminModuleDestinations } from '@/lib/nav/admin'
import { facilityAssets, computeRevenueThresholds, revenueByCategory } from '@/lib/mock-data/admin-operating-system'
import { getTodaysSessions } from '@/lib/mock-data/sessions'
import { getTodaysCheckIns } from '@/lib/mock-data/checkins'
import { getStripeRevenueSummary } from '@/lib/billing/stripe-purchases-server'
import { mockMembershipInstances } from '@/lib/mock-data/memberships'
import { formatCurrency } from '@/lib/utils'
import type { Player, Session } from '@/types'
import { getRosterStats } from '@/lib/facility/roster-stats-server'
import { defaultIdleFacilityAssets } from '@/lib/facility/default-facility-assets'

function blockStaffAndTime(sessions: Session[]) {
  const now = Date.now()
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  )
  const live = sorted.find(s => s.status === 'in-progress')
  if (live) {
    const coach = live.coachName?.trim()
    return {
      nextTime: new Date(live.startTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      staff: coach ? coach.split(/\s+/).pop() ?? coach : 'N/A',
    }
  }
  const upcoming = sorted.find(s => new Date(s.endTime).getTime() > now)
  const upcomingCoach = upcoming?.coachName?.trim()
  return {
    nextTime: upcoming
      ? new Date(upcoming.startTime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      : 'N/A',
    staff: upcomingCoach ? upcomingCoach.split(/\s+/).pop() ?? upcomingCoach : 'N/A',
  }
}

const BLOCK_TITLE: Record<string, string> = {
  Performance: 'Data / Lab',
}

export default async function AdminDashboardPage() {
  const rosterStats = await getRosterStats()
  const stripeSummary = await getStripeRevenueSummary()
  const todaysSessions = getTodaysSessions()
  const recentCheckIns = getTodaysCheckIns()
  const activePlayers = rosterStats.configured ? rosterStats.total : 0
  const pendingDocs = 0
  const pendingFees = stripeSummary.pendingCount
  const newEnrolls = rosterStats.joinedLast45Days
  const activeMemberships = mockMembershipInstances.filter(m => m.status === 'active').length
  const autoRenewNext = mockMembershipInstances.find(m => m.autoRenew && m.status === 'active')
  const { nextTime, staff } = blockStaffAndTime(todaysSessions)

  const playersWithPerf: Player[] = []
  const avgTechnical =
    playersWithPerf.length > 0
      ? Math.round(
          playersWithPerf.reduce((s, p) => s + (p.performance?.technicalScore ?? 0), 0) /
            playersWithPerf.length
        )
      : 0
  const topScorer = [...playersWithPerf].sort(
    (a, b) => (b.performance?.technicalScore ?? 0) - (a.performance?.technicalScore ?? 0)
  )[0]

  const mapAssets = facilityAssets.length > 0 ? facilityAssets : defaultIdleFacilityAssets()
  const stripeCategoryRows =
    stripeSummary.configured && stripeSummary.stripeRevenueByCategory.length > 0
      ? stripeSummary.stripeRevenueByCategory
      : revenueByCategory
  const youthShareRow = stripeCategoryRows.find(r => r.category.startsWith('Youth'))
  const youthShareLabel = youthShareRow != null ? `${Math.round(youthShareRow.pct)}%` : '-'

  const navTiles = adminDashboardPinnedTiles

  const modules = navTiles.map((item, i) => {
    const id = String(i + 1).padStart(3, '0')
    const title = BLOCK_TITLE[item.label] ?? item.label
    const summary = item.description ?? ''

    if (item.href === '/admin/modules') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          title="Modules directory"
          summary={summary}
          href={item.href}
          dataPoints={[
            { label: 'Areas', value: String(adminModuleDestinations.length) },
            { label: 'Access', value: 'Search + hub' },
            { label: 'Depth', value: 'Full OS' },
          ]}
        />
      )
    }

    if (item.href === '/admin/finance') {
      const breached = computeRevenueThresholds(stripeCategoryRows).filter(t => t.breached).length
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          title="Finance hub"
          summary={summary}
          href={item.href}
          dataPoints={[
            { label: 'MTD revenue', value: formatCurrency(stripeSummary.totalRevenue) },
            { label: 'Youth share', value: youthShareLabel, highlight: youthShareRow ? 'green' : undefined },
            { label: 'Threshold flags', value: breached, highlight: breached ? 'volt' : undefined },
          ]}
        />
      )
    }

    if (item.href === '/admin/check-in') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          title="Active Check-In"
          summary={summary}
          href={item.href}
          dataPoints={[
            { label: 'Inside now', value: `${recentCheckIns.length} athletes`, highlight: 'green' },
            { label: 'Next block', value: nextTime, highlight: 'volt' },
            { label: 'Staff lead', value: staff },
          ]}
        />
      )
    }

    if (item.href === '/admin/schedule') {
      const inProg = todaysSessions.filter(s => s.status === 'in-progress').length
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          title={title}
          summary={summary}
          href={item.href}
          dataPoints={[
            { label: 'Today blocks', value: todaysSessions.length },
            { label: 'In progress', value: inProg, highlight: inProg ? 'volt' : undefined },
            { label: 'Turnover', value: '15m' },
          ]}
        />
      )
    }

    if (item.href === '/admin/players') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          title="Player Registry"
          summary={summary}
          href={item.href}
          dataPoints={[
            { label: 'Total active', value: activePlayers },
            {
              label: rosterStats.configured ? 'New (45d)' : 'Roster',
              value: rosterStats.configured ? `+${newEnrolls}` : '-',
              highlight: rosterStats.configured && newEnrolls > 0 ? 'green' : undefined,
            },
            { label: 'Pending docs', value: pendingDocs, highlight: pendingDocs ? 'volt' : undefined },
          ]}
        />
      )
    }

    if (item.href === '/admin/memberships') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          title={title}
          summary={summary}
          href={item.href}
          dataPoints={[
            { label: 'Active plans', value: activeMemberships },
            { label: 'At risk', value: pendingDocs },
            { label: 'Auto-renew sample', value: autoRenewNext ? 'ON' : 'N/A' },
          ]}
        />
      )
    }

    if (item.href === '/admin/rentals') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          title={title}
          summary={summary}
          href={item.href}
          dataPoints={[
            { label: 'Zones (map)', value: mapAssets.length },
            { label: 'Field rental paid (all)', value: formatCurrency(stripeSummary.fieldRentalRevenueTotal) },
            {
              label: 'Field rental paid (today)',
              value: formatCurrency(stripeSummary.fieldRentalRevenueToday),
              highlight: stripeSummary.fieldRentalRevenueToday > 0 ? 'green' : undefined,
            },
            { label: 'Paid deposits (count)', value: stripeSummary.fieldRentalCompletedCount },
          ]}
        />
      )
    }

    if (item.href === '/admin/performance') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          title={title}
          summary={summary}
          href={item.href}
          dataPoints={[
            { label: 'Avg technical', value: `${avgTechnical}%`, highlight: 'green' },
            {
              label: 'Top scorer',
              value: topScorer ? `${topScorer.firstName} ${topScorer.lastName[0]}.` : 'N/A',
            },
            { label: 'Assessed', value: playersWithPerf.length },
          ]}
        />
      )
    }

    if (item.href === '/admin/settings') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          title={title}
          summary={summary}
          href={item.href}
          dataPoints={[
            { label: 'Facility', value: 'Formula SC' },
            { label: 'Roles', value: 'RBAC' },
            { label: 'Integrations', value: stripeSummary.configured ? 'Stripe OK' : 'Stripe (env)' },
          ]}
        />
      )
    }

    if (item.href === '/admin/friday-circuit') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          title="Friday circuit"
          summary={summary}
          href={item.href}
          dataPoints={[
            { label: 'Rosters', value: 'LOCKED' },
            { label: 'Pre-reg', value: '100%' },
            { label: 'Pickup mode', value: 'OFF' },
          ]}
        />
      )
    }

    if (item.href === '/admin/events-layer') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          title="Events"
          summary={summary}
          href={item.href}
          dataPoints={[
            { label: 'Camps', value: '8 wk' },
            { label: 'Tournament', value: '1/cycle' },
            { label: 'Footbot', value: 'Sun' },
          ]}
        />
      )
    }

    return (
      <ModuleBlock
        key={item.href}
        id={id}
        title={title}
        summary={summary}
        href={item.href}
        dataPoints={[
          { label: 'Module', value: 'ACTIVE' },
          { label: 'Ref', value: id },
        ]}
      />
    )
  })

  const lastCheck = recentCheckIns[0]
  const lastPay = stripeSummary.lastCompleted

  return (
    <PageContainer>
      <AdminExecutiveOverviewSection />
      <h2 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-formula-mist">Modules</h2>
      <p className="mb-4 max-w-2xl text-[12px] leading-relaxed text-formula-mist">
        Four shortcuts here. Memberships, events, rentals, mail, performance, and settings live in{' '}
        <Link href="/admin/modules" className="text-formula-volt underline-offset-2 hover:underline">
          Modules
        </Link>{' '}
        or the header search.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">{modules}</div>

      <div className="mt-12 border border-formula-frost/14 bg-formula-paper/[0.04] p-8 font-mono shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
        <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-formula-paper">
          Live System Feed // logs.txt
        </h4>
        <div className="space-y-1 text-[11px] text-formula-mist">
          {lastCheck && (
            <p>
              [{new Date(lastCheck.checkedInAt).toLocaleTimeString('en-GB')}] - CHECK_IN SUCCESS:{' '}
              {lastCheck.playerName.toUpperCase().replace(/\s+/g, ' ')}
            </p>
          )}
          {lastPay && (
            <p>
              [{new Date(lastPay.createdAt).toLocaleTimeString('en-GB')}] - PAYMENT VERIFIED:{' '}
              {lastPay.playerName.toUpperCase().replace(/\s+/g, ' ')} (
              {lastPay.description.slice(0, 24).toUpperCase().replace(/\s/g, '_')}
              )
            </p>
          )}
          <p className="font-bold text-formula-frost/95">
            [{new Date().toLocaleTimeString('en-GB')}] - SYSTEM_READY: WAITING FOR WRISTBAND_BUFFER...
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
