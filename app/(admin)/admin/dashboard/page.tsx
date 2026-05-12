import React from 'react'
import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { AdminExecutiveOverviewSection } from '@/components/admin/admin-executive-overview-section'
import { AdminModulesGrid } from '@/components/admin/admin-modules-grid'
import { adminModuleDestinations } from '@/lib/nav/admin'
import { getTodaysCheckIns } from '@/lib/mock-data/checkins'
import { getStripeRevenueSummary } from '@/lib/billing/stripe-purchases-server'
import { FACILITY_TIMEZONE } from '@/lib/facility/facility-day'

/** Always fresh shell + nav; do not serve a cached dashboard layout from an older build. */
export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const recentCheckIns = getTodaysCheckIns()
  const stripeSummary = await getStripeRevenueSummary()
  const lastCheck = recentCheckIns[0]
  const lastPay = stripeSummary.lastCompleted

  return (
    <PageContainer>
      <AdminExecutiveOverviewSection />

      <div id="modules-directory" className="scroll-mt-28">
        <h2 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-formula-mist">Modules</h2>
        <p className="mb-4 max-w-2xl text-[12px] leading-relaxed text-formula-mist">
          Every programming and facility module in one place. Use the header for{' '}
          <strong className="text-formula-paper/90">Finance</strong>, <strong className="text-formula-paper/90">Schedule</strong>, and{' '}
          <strong className="text-formula-paper/90">Rentals</strong>; this grid mirrors{' '}
          <Link href="/admin/modules" className="text-formula-volt underline-offset-2 hover:underline">
            /admin/modules
          </Link>
          .
        </p>
        <AdminModulesGrid items={adminModuleDestinations} />
      </div>

      <div className="mt-12 border border-formula-frost/14 bg-formula-paper/[0.04] p-8 font-mono shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
        <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-formula-paper">
          Live System Feed // logs.txt
        </h4>
        <div className="space-y-1 text-[11px] text-formula-mist">
          {lastCheck && (
            <p>
              [{new Date(lastCheck.checkedInAt).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: FACILITY_TIMEZONE,
              })}] - CHECK_IN SUCCESS:{' '}
              {lastCheck.playerName.toUpperCase().replace(/\s+/g, ' ')}
            </p>
          )}
          {lastPay && (
            <p>
              [{new Date(lastPay.createdAt).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: FACILITY_TIMEZONE,
              })}] - PAYMENT VERIFIED:{' '}
              {lastPay.playerName.toUpperCase().replace(/\s+/g, ' ')} (
              {lastPay.description.slice(0, 24).toUpperCase().replace(/\s/g, '_')}
              )
            </p>
          )}
          <p className="font-bold text-formula-frost/95">
            [{new Date().toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
              timeZone: FACILITY_TIMEZONE,
            })}] - SYSTEM_READY: WAITING FOR WRISTBAND_BUFFER...
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
