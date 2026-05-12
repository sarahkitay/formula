import Link from 'next/link'
import { UserCheck, AlertTriangle } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { CountUp } from '@/components/ui/count-up'
import { Button } from '@/components/ui/button'
import { SITE } from '@/lib/site-config'
import { formatCurrency, cn } from '@/lib/utils'
import { getRosterStats } from '@/lib/facility/roster-stats-server'
import { getStripeRevenueSummary } from '@/lib/billing/stripe-purchases-server'
import { getTodaysSessions } from '@/lib/mock-data/sessions'
import { getTodaysCheckIns } from '@/lib/mock-data/checkins'
import { adminAlerts } from '@/lib/mock-data/admin-operating-system'
import { FACILITY_TIMEZONE } from '@/lib/facility/facility-day'

/** Compact executive strip for the top of Admin Dashboard (full report remains on /admin/overview). */
export async function AdminExecutiveOverviewSection() {
  const rosterStats = await getRosterStats()
  const stripeSummary = await getStripeRevenueSummary()
  const todaysSessions = getTodaysSessions()
  const recentCheckIns = getTodaysCheckIns()
  const activePlayers = rosterStats.configured ? rosterStats.total : 0
  const currentBlockCount = todaysSessions.filter(s => s.status === 'in-progress').length
  const revenueMtd = stripeSummary.totalRevenue
  const headline = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: FACILITY_TIMEZONE,
  })

  return (
    <section className="mb-10 space-y-5 border-b border-formula-frost/12 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-formula-mist">Executive</p>
          <h2 className="text-xl font-semibold tracking-tight text-formula-paper md:text-2xl">Today&apos;s snapshot</h2>
          <p className="mt-1 font-mono text-[11px] text-formula-mist">
            {SITE.facilityName} · {headline}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/overview">
            <Button variant="secondary" size="sm">
              Full executive report
            </Button>
          </Link>
          <Link href="/admin/check-in">
            <Button variant="primary" size="sm" leftIcon={<UserCheck className="h-3.5 w-3.5" strokeWidth={2} />}>
              Live check-in
            </Button>
          </Link>
        </div>
      </div>

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
          sublabel={rosterStats.configured ? undefined : 'Roster unavailable'}
          href="/admin/players"
        />
        <StatCard
          label="Session load (today)"
          value={<CountUp end={todaysSessions.length} format="integer" />}
          sublabel={
            <>
              <CountUp end={currentBlockCount} format="integer" /> in progress
            </>
          }
          href="/admin/schedule"
        />
        <StatCard
          label="Revenue (Stripe, paid)"
          value={<CountUp end={revenueMtd} format="currency" />}
          href="/admin/finance"
        />
      </div>

      <div className="rounded-md border border-formula-frost/12 bg-formula-paper/[0.04] p-4 font-mono text-[11px] text-formula-frost/90 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
        <p className="text-[9px] uppercase tracking-[0.2em] text-formula-mist">Alerts</p>
        <ul className="mt-2 space-y-1.5">
          {adminAlerts.slice(0, 4).map(a => (
            <li key={a.id} className="flex gap-2">
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
        <Link href="/admin/finance" className="mt-2 inline-block text-[10px] text-formula-mist underline decoration-formula-frost/25 hover:text-formula-paper">
          Finance hub →
        </Link>
      </div>
    </section>
  )
}
