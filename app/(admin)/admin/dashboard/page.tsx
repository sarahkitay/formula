import React from 'react'
import { PageContainer } from '@/components/layout/app-shell'
import { ModuleBlock } from '@/components/dashboard/module-block'
import { adminNav } from '@/lib/nav/admin'
import { facilityAssets, computeRevenueThresholds, revenueByCategory } from '@/lib/mock-data/admin-operating-system'
import { getTodaysSessions } from '@/lib/mock-data/sessions'
import { getTodaysCheckIns } from '@/lib/mock-data/checkins'
import { getTotalRevenue, mockPayments } from '@/lib/mock-data/payments'
import { mockPlayers } from '@/lib/mock-data/players'
import { mockMembershipInstances } from '@/lib/mock-data/memberships'
import { formatCurrency } from '@/lib/utils'
import type { Session } from '@/types'

const MS_45D = 45 * 24 * 60 * 60 * 1000

function blockStaffAndTime(sessions: Session[]) {
  const now = Date.now()
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  )
  const live = sorted.find(s => s.status === 'in-progress')
  if (live) {
    return {
      nextTime: new Date(live.startTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      staff: live.coachName.split(' ').pop() ?? live.coachName,
    }
  }
  const upcoming = sorted.find(s => new Date(s.endTime).getTime() > now)
  return {
    nextTime: upcoming
      ? new Date(upcoming.startTime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      : 'N/A',
    staff: upcoming?.coachName.split(' ').pop() ?? 'N/A',
  }
}

const BLOCK_TITLE: Record<string, string> = {
  Performance: 'Data / Lab',
}

export default function AdminDashboardPage() {
  const todaysSessions = getTodaysSessions()
  const recentCheckIns = getTodaysCheckIns()
  const activePlayers = mockPlayers.filter(p => p.status === 'active').length
  const pendingDocs = mockPlayers.filter(p => p.sessionsRemaining === 0).length
  const pendingFees = mockPayments.filter(p => p.status === 'pending').length
  const newEnrolls = mockPlayers.filter(
    p => Date.now() - new Date(p.joinedAt).getTime() < MS_45D
  ).length
  const activeMemberships = mockMembershipInstances.filter(m => m.status === 'active').length
  const autoRenewNext = mockMembershipInstances.find(m => m.autoRenew && m.status === 'active')
  const { nextTime, staff } = blockStaffAndTime(todaysSessions)

  const playersWithPerf = mockPlayers.filter(p => p.performance)
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

  const availableFields = 2

  const navTiles = adminNav.filter(item => item.href !== '/admin/dashboard')

  const modules = navTiles.map((item, i) => {
    const id = String(i + 1).padStart(3, '0')
    const title = BLOCK_TITLE[item.label] ?? item.label
    const summary = item.description ?? ''

    if (item.href === '/admin/overview') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          title="Ops Command"
          summary={summary}
          href={item.href}
          dataPoints={[
            { label: 'Check-ins today', value: recentCheckIns.length, highlight: 'green' },
            { label: 'Blocks today', value: todaysSessions.length },
            { label: 'MTD revenue', value: formatCurrency(getTotalRevenue()) },
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
            { label: 'New enrolls', value: `+${newEnrolls}`, highlight: 'green' },
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

    if (item.href === '/admin/payments') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          title="Revenue Ledger"
          summary={summary}
          href={item.href}
          dataPoints={[
            { label: 'MTD revenue', value: formatCurrency(getTotalRevenue()) },
            { label: 'Unpaid fees', value: pendingFees, highlight: pendingFees ? 'volt' : undefined },
            { label: 'Ledger rows', value: mockPayments.length },
          ]}
        />
      )
    }

    if (item.href === '/admin/field-rentals') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          title={title}
          summary={summary}
          href={item.href}
          dataPoints={[
            { label: 'Pitches free', value: availableFields, highlight: 'green' },
            { label: 'Ext. bookings', value: 5 },
            { label: 'Today revenue', value: '$400' },
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
            { label: 'Integrations', value: 'Stripe (TBD)' },
          ]}
        />
      )
    }

    if (item.href === '/admin/facility-map') {
      const hot = facilityAssets.filter(a => a.utilizationPct > 80).length
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          title="Ops map"
          summary={summary}
          href={item.href}
          dataPoints={[
            { label: 'Assets live', value: facilityAssets.length },
            { label: 'Hot zones', value: hot, highlight: hot ? 'volt' : undefined },
            { label: 'Fields', value: '3 + arena' },
          ]}
        />
      )
    }

    if (item.href === '/admin/fpi') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          title="FPI"
          summary={summary}
          href={item.href}
          dataPoints={[
            { label: 'Pillars', value: '5' },
            { label: 'QC queue', value: '3', highlight: 'volt' },
            { label: 'Public boards', value: 'OFF' },
          ]}
        />
      )
    }

    if (item.href === '/admin/revenue-strategy') {
      const breached = computeRevenueThresholds(revenueByCategory).filter(t => t.breached).length
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          title="Revenue"
          summary={summary}
          href={item.href}
          dataPoints={[
            { label: 'Youth share', value: '46%', highlight: 'green' },
            { label: 'Threshold flags', value: breached, highlight: breached ? 'volt' : undefined },
            { label: 'Phase', value: 'P1' },
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
  const lastPay = mockPayments.find(p => p.status === 'completed')

  return (
    <PageContainer>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">{modules}</div>

      <div className="mt-12 border border-black bg-zinc-50 p-8 font-mono">
        <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-[#1a1a1a]">
          Live System Feed // logs.txt
        </h4>
        <div className="space-y-1 text-[11px] text-zinc-500">
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
          <p className="font-bold text-[#1a1a1a]">
            [{new Date().toLocaleTimeString('en-GB')}] - SYSTEM_READY: WAITING FOR WRISTBAND_BUFFER...
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
