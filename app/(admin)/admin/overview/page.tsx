import React from 'react'
import Link from 'next/link'
import { UserCheck, ChevronRight, AlertTriangle } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { SectionHeader } from '@/components/ui/section-header'
import { StatusPill } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getTodaysSessions } from '@/lib/mock-data/sessions'
import { getTodaysCheckIns } from '@/lib/mock-data/checkins'
import { getStripeRevenueSummary } from '@/lib/billing/stripe-purchases-server'
import { formatCurrency, formatDate, getInitials, getAvatarColor, cn } from '@/lib/utils'
import { SITE } from '@/lib/site-config'
import { CountUp } from '@/components/ui/count-up'
import {
  adminAlerts,
  todaysYouthBlocks,
  todaysAdultBlocks,
  rentalsClinicsPartiesToday,
  checkInAttendanceSnapshot,
  facilityAssets,
  revenueByCategory,
  computeRevenueThresholds,
} from '@/lib/mock-data/admin-operating-system'
import { getRosterStats } from '@/lib/facility/roster-stats-server'
import { AdminPaymentStream } from '@/components/admin/admin-payment-stream'

export default async function AdminOverviewPage() {
  const rosterStats = await getRosterStats()
  const stripeSummary = await getStripeRevenueSummary()
  const todaysSessions = getTodaysSessions()
  const recentCheckIns = getTodaysCheckIns()
  const recentPayments = stripeSummary.recent
  const activePlayers = rosterStats.configured ? rosterStats.total : 0
  const expiredMemberships = 0
  const currentBlockCount = todaysSessions.filter(s => s.status === 'in-progress').length
  const revenueMtd = stripeSummary.totalRevenue
  const revenueCategoryRows =
    stripeSummary.configured && stripeSummary.stripeRevenueByCategory.length > 0
      ? stripeSummary.stripeRevenueByCategory
      : revenueByCategory

  return (
    <PageContainer fullWidth>
      <div className="space-y-8">
        <PageHeader
          title="Executive overview"
          subtitle={`${SITE.facilityName} · ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })} · operational snapshot`}
          breadcrumb={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Overview' },
          ]}
          actions={
            <Link href="/admin/check-in">
              <Button variant="primary" leftIcon={<UserCheck className="h-3.5 w-3.5" strokeWidth={2} />}>
                Live check-in
              </Button>
            </Link>
          }
        />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <StatCard
            label="Live check-ins"
            value={<CountUp end={recentCheckIns.length} format="integer" />}
            accent
            href="/admin/check-in"
          />
          <StatCard
            label="Roster"
            value={<CountUp end={activePlayers} format="integer" />}
            sublabel={rosterStats.configured ? undefined : 'Roster data is unavailable right now'}
            href="/admin/players"
          />
          <StatCard
            label="Session load (today)"
            value={<CountUp end={todaysSessions.length} format="integer" />}
            sublabel={
              <>
                <CountUp end={currentBlockCount} format="integer" /> current block
              </>
            }
            href="/admin/schedule"
          />
          <StatCard
            label="Revenue (Stripe, paid)"
            value={<CountUp end={revenueMtd} format="currency" />}
            href="/admin/payments"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="border border-formula-frost/12 bg-formula-paper/[0.04] p-4 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-formula-mist">Alerts</p>
            <ul className="mt-2 space-y-2">
              {adminAlerts.map(a => (
                <li key={a.id} className="flex gap-2 font-mono text-[11px] text-formula-frost/90">
                  <AlertTriangle
                    className={cn(
                      'mt-0.5 h-3.5 w-3.5 shrink-0',
                      a.severity === 'critical' && 'text-red-400',
                      a.severity === 'warning' && 'text-amber-500',
                      a.severity === 'info' && 'text-formula-mist'
                    )}
                  />
                  <span>
                    <span className="text-formula-mist">[{a.code}]</span> {a.message}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/admin/revenue-strategy" className="mt-3 inline-block font-mono text-[10px] text-formula-mist underline decoration-formula-frost/25 hover:text-formula-paper">
              Revenue thresholds →
            </Link>
          </div>
          <div className="border border-formula-frost/12 bg-formula-paper/[0.04] p-4 font-mono text-[11px] text-formula-frost/90 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
            <p className="text-[9px] uppercase tracking-[0.2em] text-formula-mist">Check-in / attendance</p>
            <p className="mt-2">
              Checked in{' '}
              <span className="tabular-nums text-formula-paper">{checkInAttendanceSnapshot.checkedIn}</span> /{' '}
              {checkInAttendanceSnapshot.expected} expected · no-show risk{' '}
              {checkInAttendanceSnapshot.noShowRisk} · late {checkInAttendanceSnapshot.lateArrival}
            </p>
            <Link href="/admin/check-in" className="mt-2 inline-block text-[10px] text-formula-mist underline decoration-formula-frost/25 hover:text-formula-paper">
              Open console →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="panel-technical space-y-3 p-5">
            <SectionHeader title="Today’s youth blocks" description="55m engine · buffer integrity" />
            <div className="divide-y divide-border font-mono text-[11px]">
              {todaysYouthBlocks.map(y => (
                <div key={y.id} className="flex flex-wrap items-center justify-between gap-2 py-2 first:pt-0">
                  <div>
                    <p className="text-text-primary">{y.window}</p>
                    <p className="text-text-muted">
                      {y.ageBand} · {y.program}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-text-secondary">{y.capacity}</p>
                    <p className="text-[10px] text-text-muted">
                      {y.bufferOk && y.onTime ? (
                        <span className="text-success">buffer + start OK</span>
                      ) : (
                        <span className="text-amber-600">
                          {!y.bufferOk ? 'buffer risk' : 'late start'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel-technical space-y-3 p-5">
            <SectionHeader title="Adult · rentals · events" description="Additive layers today" />
            <p className="font-mono text-[10px] uppercase tracking-wide text-text-muted">Adult pickup</p>
            <div className="divide-y divide-border font-mono text-[11px]">
              {todaysAdultBlocks.map((b, i) => (
                <div key={i} className="flex justify-between py-2">
                  <span className="text-text-secondary">{b.window}</span>
                  <span className="text-text-muted">
                    {b.registrations}/{b.cap}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-wide text-text-muted">Rentals / clinics / parties</p>
            <div className="space-y-1 font-mono text-[11px] text-text-secondary">
              {rentalsClinicsPartiesToday.map((r, i) => (
                <div key={i}>
                  {r.window} · {r.type} · {r.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="panel-technical p-5">
            <SectionHeader
              title="Utilization by asset"
              action={
                <Link href="/admin/facility-map">
                  <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-3 w-3" strokeWidth={2} />}>
                    Ops map
                  </Button>
                </Link>
              }
            />
            <div className="mt-3 space-y-1.5 font-mono text-[11px]">
              {facilityAssets.slice(0, 6).map(a => (
                <div key={a.id} className="flex justify-between border-b border-border/60 py-1.5 last:border-0">
                  <span className="text-text-secondary">{a.shortLabel}</span>
                  <span className="tabular-nums text-text-muted">{a.utilizationPct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel-technical p-5">
            <SectionHeader
              title="Revenue snapshot (Stripe)"
              description="Paid Checkout sessions from your webhook — includes field rental deposits, parties, assessments, packages, and custom invoices."
              action={
                <Link href="/admin/revenue-strategy">
                  <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-3 w-3" strokeWidth={2} />}>
                    Strategy
                  </Button>
                </Link>
              }
            />
            <div className="mt-3 space-y-1.5 font-mono text-[11px]">
              {revenueCategoryRows.length === 0 ? (
                <p className="text-text-muted">No completed Stripe checkouts in the ledger yet.</p>
              ) : (
                revenueCategoryRows.slice(0, 8).map(r => (
                  <div key={r.category} className="flex justify-between gap-2">
                    <span className="min-w-0 text-text-secondary">{r.category}</span>
                    <span className="shrink-0 tabular-nums text-text-muted">
                      {r.pct}% · {formatCurrency(r.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="mt-3 border-t border-border pt-3 font-mono text-[10px] text-text-muted">
              Threshold checks (share of paid Stripe total):{' '}
              {computeRevenueThresholds(revenueCategoryRows).filter(t => t.breached).length === 0
                ? 'none breached'
                : 'review required'}
            </div>
          </div>
        </div>

        {expiredMemberships > 0 && (
          <div className="flex items-start gap-3 border border-warning/30 bg-warning/10 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-warning">Readiness alert</p>
              <p className="mt-1 text-[13px] text-text-secondary">
                <span className="font-medium text-warning">{expiredMemberships} athletes</span> at zero sessions
                remaining; review membership cycle.
              </p>
            </div>
            <Link href="/admin/memberships" className="shrink-0">
              <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-3 w-3" strokeWidth={2} />}>
                Review
              </Button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="panel-technical space-y-4 p-5">
            <SectionHeader
              title="Current block"
              description={`${todaysSessions.length} scheduled sessions`}
              action={
                <Link href="/admin/schedule">
                  <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-3 w-3" strokeWidth={2} />}>
                    Schedule
                  </Button>
                </Link>
              }
            />
            <div className="divide-y divide-border">
              {todaysSessions.map(session => (
                <Link
                  key={session.id}
                  href="/admin/schedule"
                  className="flex items-center gap-3 py-2.5 text-inherit no-underline transition-colors first:pt-0 last:pb-0 hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005700]"
                >
                  <div className="w-14 shrink-0 text-center">
                    <p className="font-mono text-[11px] tabular-nums text-text-muted">
                      {new Date(session.startTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </p>
                  </div>
                  <div className="h-8 w-px shrink-0 bg-border" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-text-primary">{session.title}</p>
                    <p className="truncate text-[11px] text-text-muted">
                      {session.coachName} · {session.fieldName}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-mono text-[11px] tabular-nums text-text-secondary">
                      {session.enrolledCount}/{session.capacity}
                    </span>
                    <StatusPill status={session.status} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="panel-technical space-y-4 p-5">
            <SectionHeader
              title="Live check-in feed"
              description="Most recent facility intake"
              action={
                <Link href="/admin/check-in">
                  <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-3 w-3" strokeWidth={2} />}>
                    Console
                  </Button>
                </Link>
              }
            />
            <div className="divide-y divide-border">
              {recentCheckIns.slice(0, 6).map(ci => {
                const [fn, ...rest] = ci.playerName.split(' ')
                const ln = rest.join(' ') || fn
                return (
                  <Link
                    key={ci.id}
                    href="/admin/check-in"
                    className="flex items-center gap-3 py-2.5 text-inherit no-underline transition-colors first:pt-0 last:pb-0 hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005700]"
                  >
                    <div
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center text-[10px] font-semibold',
                        getAvatarColor(ci.playerId)
                      )}
                    >
                      {getInitials(fn ?? '', ln)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] text-text-primary">{ci.playerName}</p>
                      <p className="truncate text-[11px] text-text-muted">{ci.sessionTitle}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-success">Checked in</p>
                      <p className="font-mono text-[11px] tabular-nums text-text-muted">
                        {new Date(ci.checkedInAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </Link>
                )
              })}
              {recentCheckIns.length === 0 && (
                <p className="py-6 text-center text-[13px] text-text-muted">No check-ins for this block yet.</p>
              )}
            </div>
          </div>
        </div>

        <AdminPaymentStream configured={stripeSummary.configured} initialPayments={recentPayments} />
      </div>
    </PageContainer>
  )
}
