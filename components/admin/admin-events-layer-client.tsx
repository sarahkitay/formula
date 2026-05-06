'use client'

import * as React from 'react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { AdminPanel, AdminMonoTable } from '@/components/admin/admin-panel'
import { TabSwitcher } from '@/components/ui/tab-switcher'
import type { FridayFriendliesSignupRow } from '@/lib/billing/stripe-purchases-server'
import type { EventsLayerSummary } from '@/lib/mock-data/admin-operating-system'
import { formatCurrency, formatDate } from '@/lib/utils'

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

  const friendliesRows = React.useMemo(
    () =>
      friendliesSignups.map(r => [
        formatDate(r.createdAt),
        r.guardianName ?? '—',
        r.email ?? '—',
        r.playerNames ?? '—',
        String(r.playerCount),
        formatCurrency(r.amountUsd),
        r.stripeSessionId.length > 18 ? `${r.stripeSessionId.slice(0, 14)}…` : r.stripeSessionId,
      ]),
    [friendliesSignups]
  )

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
              <AdminMonoTable
                headers={['Paid', 'Guardian', 'Email', 'Athlete name(s)', 'Players', 'Total', 'Session']}
                rows={friendliesRows}
              />
            )}
          </AdminPanel>
        )}
      </div>
    </PageContainer>
  )
}
