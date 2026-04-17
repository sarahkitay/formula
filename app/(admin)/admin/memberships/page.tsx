import React from 'react'
import { Plus, Crown } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { SectionHeader } from '@/components/ui/section-header'
import { Button } from '@/components/ui/button'
import { membershipByAge } from '@/lib/mock-data/admin-operating-system'
import { AdminMonoTable } from '@/components/admin/admin-panel'
import { formatCurrency, cn } from '@/lib/utils'
import { SITE } from '@/lib/site-config'
import type { MembershipPlan } from '@/types'
import { getStripeRevenueSummary } from '@/lib/billing/stripe-purchases-server'

const PLAN_CATALOG: MembershipPlan[] = [
  {
    id: 'youth-base',
    name: 'Youth Performance (base)',
    description: SITE.youthBasePlanSummary,
    sessionCount: 8,
    validityDays: 30,
    price: 0,
    color: '#005700',
    accentColor: '#005700',
    features: [
      'Up to two structured youth blocks per week when published',
      'FPI cadence per staff schedule',
      'Capacity-controlled enrollment',
    ],
    popular: true,
  },
]

export default async function MembershipsPage() {
  const stripe = await getStripeRevenueSummary()

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Memberships"
          subtitle={`Stripe Checkout rows on file: ${stripe.rowCount} · in-app membership rows: 0 until a membership table is connected`}
          actions={
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} type="button" disabled>
              New membership
            </Button>
          }
        />

        <div className="border border-formula-frost/12 bg-formula-paper/[0.04] p-5 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-formula-mist">Age bands · scarcity</p>
          {membershipByAge.length === 0 ? (
            <p className="mt-3 font-mono text-[11px] text-zinc-500">
              No live membership mix loaded. Wire billing + roster caps when ready.
            </p>
          ) : (
            <AdminMonoTable
              headers={['Band', 'Active', 'Wait', 'Cap', 'Perf', 'Elite', 'Demand']}
              rows={membershipByAge.map(m => [
                m.band,
                m.active,
                m.waitlist,
                m.cap,
                m.performance,
                m.performanceElite,
                m.demandIndex.toFixed(2),
              ])}
            />
          )}
        </div>

        <div className="space-y-4">
          <SectionHeader title="Plan reference" description={SITE.youthBasePlanSummary} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {PLAN_CATALOG.map(plan => (
              <div
                key={plan.id}
                className={cn(
                  'relative space-y-4 rounded-xl border bg-surface p-5',
                  plan.popular ? 'border-primary/40' : 'border-border'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-2.5 left-4">
                    <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                      <Crown className="h-3 w-3" />
                      Anchor
                    </span>
                  </div>
                )}
                <div>
                  <div className="mb-3 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: plan.color }} />
                  <p className="text-md font-bold text-text-primary">{plan.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary">{plan.description}</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-text-primary">
                    {plan.price > 0 ? formatCurrency(plan.price) : 'See billing'}
                  </p>
                  <p className="text-xs text-text-muted">
                    {plan.sessionCount === 'unlimited' ? 'Unlimited sessions' : `${plan.sessionCount} sessions`} ·{' '}
                    {plan.validityDays} days
                  </p>
                </div>
                <ul className="space-y-1.5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-success" />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="border-t border-border pt-2 text-xs text-text-muted">
                  Subscriber counts require a membership table — not shown until connected.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <SectionHeader title="Active memberships" description="Empty until membership instances are stored in the database" />
          <p className="mt-2 text-sm text-text-muted">
            Use Stripe + internal roster for revenue today; this grid will list plan instances when you add a
            `membership_instances` (or equivalent) source.
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
