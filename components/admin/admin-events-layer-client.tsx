'use client'

import Link from 'next/link'
import * as React from 'react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { AdminPanel } from '@/components/admin/admin-panel'
import { TabSwitcher } from '@/components/ui/tab-switcher'
import type { FridayFriendliesSignupRow } from '@/lib/billing/stripe-purchases-server'
import type { EventsLayerSummary } from '@/lib/mock-data/admin-operating-system'
import { formatCurrency, formatDate } from '@/lib/utils'
import { adminClientProfileHref } from '@/lib/admin/client-profile-href'

export function AdminEventsLayerClient({
  overview: e,
  friendliesSignups,
  dbConfigured,
}: {
  overview: EventsLayerSummary
  friendliesSignups: FridayFriendliesSignupRow[]
  dbConfigured: boolean
}) {
  const [tab, setTab] = React.useState<'overview' | 'friendlies'>('overview')
  const totalAthleteSlots = React.useMemo(
    () => friendliesSignups.reduce((s, r) => s + r.playerCount, 0),
    [friendliesSignups]
  )

  function ageLabel(r: FridayFriendliesSignupRow): string {
    if (r.ageYoungest == null && r.ageOldest == null) return '—'
    if (r.ageYoungest != null && r.ageOldest != null && r.ageYoungest === r.ageOldest) return String(r.ageYoungest)
    if (r.ageYoungest != null && r.ageOldest != null) return `${r.ageYoungest}–${r.ageOldest}`
    return String(r.ageYoungest ?? r.ageOldest ?? '—')
  }

  return (
    <PageContainer fullWidth>
      <div className="space-y-6">
        <PageHeader
          title="Camps · tournaments · parties · Footbot"
          subtitle="Controlled additive layers · Stripe pre-reg for public events (Friday Friendlies) lives on the Sign-ups tab"
          breadcrumb={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Events' },
          ]}
        />

        <TabSwitcher
          variant="pill"
          className="max-w-xl"
          tabs={[
            { id: 'overview', label: 'Layers overview' },
            { id: 'friendlies', label: 'Friday Friendlies sign-ups', count: friendliesSignups.length },
          ]}
          activeTab={tab}
          onChange={id => setTab(id as 'overview' | 'friendlies')}
        />

        {tab === 'overview' ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AdminPanel title="Camps" eyebrow="SUMMER_BASELINE">
              <dl className="space-y-2 font-mono text-[11px] text-formula-frost/90">
                <div className="flex justify-between">
                  <dt className="text-formula-mist">Summer baseline</dt>
                  <dd>{e.camps.summerWeeks} weeks</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-formula-mist">Enrolled</dt>
                  <dd>{e.camps.enrolled}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-formula-mist">Membership conversion</dt>
                  <dd>{e.camps.conversionToMembership}</dd>
                </div>
              </dl>
            </AdminPanel>
            <AdminPanel title="Tournaments" eyebrow="CYCLE">
              <dl className="space-y-2 font-mono text-[11px] text-formula-frost/90">
                <div className="flex justify-between">
                  <dt className="text-formula-mist">Per 12-week cycle</dt>
                  <dd>{e.tournaments.perCycle}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-formula-mist">Next</dt>
                  <dd>{e.tournaments.nextDate}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-formula-mist">Fields</dt>
                  <dd>{e.tournaments.fieldsBooked} booked</dd>
                </div>
              </dl>
              <p className="mt-2 font-mono text-[10px] text-formula-mist">
                Parking flow + bracket timing: ops checklist (TBD).
              </p>
            </AdminPanel>
            <AdminPanel title="Parties" eyebrow="FIXED_WINDOWS">
              <dl className="space-y-2 font-mono text-[11px] text-formula-frost/90">
                <div className="flex justify-between">
                  <dt className="text-formula-mist">Fixed windows</dt>
                  <dd>{e.parties.fixedWindows}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-formula-mist">This month</dt>
                  <dd>{e.parties.thisMonth}</dd>
                </div>
              </dl>
            </AdminPanel>
            <AdminPanel title="Footbot" eyebrow="SUNDAY">
              <dl className="space-y-2 font-mono text-[11px] text-formula-frost/90">
                <div className="flex justify-between">
                  <dt className="text-formula-mist">Standalone</dt>
                  <dd>{e.footbot.sundayStandalone ? 'Yes' : 'No'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-formula-mist">Next slot</dt>
                  <dd>{e.footbot.nextSlot}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-formula-mist">Mode</dt>
                  <dd className="max-w-[200px] text-right">{e.footbot.mode}</dd>
                </div>
              </dl>
            </AdminPanel>
          </div>
        ) : (
          <AdminPanel
            title="Friday Night Friendlies · pre-registration"
            eyebrow="STRIPE_CHECKOUT"
            actions={
              <p className="font-mono text-[10px] text-formula-mist">
                {friendliesSignups.length} checkout{friendliesSignups.length === 1 ? '' : 's'} · {totalAthleteSlots} athlete
                {totalAthleteSlots === 1 ? '' : 's'} (player count sum)
              </p>
            }
          >
            {!dbConfigured ? (
              <p className="font-mono text-[12px] text-formula-frost/85">
                Set <span className="text-formula-volt">SUPABASE_SERVICE_ROLE_KEY</span> on the server to load paid pre-registrations from{' '}
                <code className="text-formula-paper">stripe_purchases</code>.
              </p>
            ) : friendliesSignups.length === 0 ? (
              <p className="font-mono text-[12px] text-formula-frost/85">
                No paid Friday Friendlies checkouts yet. After customers complete Stripe Checkout, rows appear here (webhook inserts into the ledger).
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-formula-frost/12 text-left text-formula-mist uppercase tracking-wide">
                      <th className="pb-2 pr-3 font-medium">Paid</th>
                      <th className="pb-2 pr-3 font-medium">Guardian</th>
                      <th className="pb-2 pr-3 font-medium">Email</th>
                      <th className="pb-2 pr-3 font-medium">Athletes</th>
                      <th className="pb-2 pr-3 font-medium">#</th>
                      <th className="pb-2 pr-3 font-medium">Ages</th>
                      <th className="pb-2 pr-3 font-medium">Total</th>
                      <th className="pb-2 font-medium">Session</th>
                    </tr>
                  </thead>
                  <tbody>
                    {friendliesSignups.map(r => {
                      const href = adminClientProfileHref({
                        id: r.id,
                        customerEmail: r.email,
                      })
                      return (
                        <tr key={r.id} className="border-b border-formula-frost/[0.08] text-formula-frost/90">
                          <td className="py-2 pr-3 align-top">
                            <Link href={href} className="text-formula-volt underline-offset-2 hover:underline">
                              {formatDate(r.createdAt)}
                            </Link>
                          </td>
                          <td className="py-2 pr-3 align-top">
                            <Link href={href} className="text-formula-paper underline-offset-2 hover:underline">
                              {r.guardianName ?? '—'}
                            </Link>
                          </td>
                          <td className="py-2 pr-3 align-top">
                            <Link href={href} className="break-all underline-offset-2 hover:underline">
                              {r.email ?? '—'}
                            </Link>
                          </td>
                          <td className="max-w-[10rem] py-2 pr-3 align-top break-words">{r.playerNames ?? '—'}</td>
                          <td className="py-2 pr-3 align-top tabular-nums">{r.playerCount}</td>
                          <td className="py-2 pr-3 align-top">{ageLabel(r)}</td>
                          <td className="py-2 pr-3 align-top">{formatCurrency(r.amountUsd)}</td>
                          <td className="py-2 align-top font-mono text-[10px] text-formula-mist">
                            <Link href={href} className="hover:text-formula-volt">
                              {r.stripeSessionId.length > 20 ? `${r.stripeSessionId.slice(0, 16)}…` : r.stripeSessionId}
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </AdminPanel>
        )}
      </div>
    </PageContainer>
  )
}
