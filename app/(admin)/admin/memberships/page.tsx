'use client'

import React from 'react'
import { Plus, CheckCircle2, Crown } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { SectionHeader } from '@/components/ui/section-header'
import { Button } from '@/components/ui/button'
import { Badge, StatusPill } from '@/components/ui/badge'
import { DataTable, Column } from '@/components/ui/data-table'
import { mockMembershipPlans, mockMembershipInstances } from '@/lib/mock-data/memberships'
import { membershipByAge } from '@/lib/mock-data/admin-operating-system'
import { AdminMonoTable } from '@/components/admin/admin-panel'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { SITE } from '@/lib/site-config'
import { MembershipInstance } from '@/types'

export default function MembershipsPage() {
  const active = mockMembershipInstances.filter(m => m.status === 'active')
  const expired = mockMembershipInstances.filter(m => m.status === 'expired')

  const columns: Column<MembershipInstance>[] = [
    {
      key: 'playerName',
      header: 'Player',
      render: (m) => <span className="font-medium text-text-primary">{m.playerName}</span>,
    },
    {
      key: 'planName',
      header: 'Plan',
      render: (m) => {
        const plan = mockMembershipPlans.find(p => p.id === m.planId)
        return (
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: plan?.color ?? '#a3a3a3' }} />
            <span className="text-text-primary">{m.planName}</span>
          </div>
        )
      },
    },
    {
      key: 'sessions',
      header: 'Sessions',
      render: (m) => (
        <div className="flex items-center gap-2">
          <span className={cn('font-semibold', m.sessionsTotal !== 'unlimited' && (m.sessionsTotal - m.sessionsUsed) === 0 ? 'text-error' : 'text-text-primary')}>
            {m.sessionsTotal === 'unlimited' ? '∞' : m.sessionsTotal - m.sessionsUsed}
          </span>
          <span className="text-text-muted text-xs">/ {m.sessionsTotal === 'unlimited' ? '∞' : m.sessionsTotal}</span>
        </div>
      ),
    },
    {
      key: 'expiryDate',
      header: 'Expires',
      render: (m) => <span className="text-text-secondary text-sm">{formatDate(m.expiryDate)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (m) => <StatusPill status={m.status} />,
    },
    {
      key: 'autoRenew',
      header: 'Auto-Renew',
      render: (m) => m.autoRenew
        ? <span className="text-xs text-success flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />On</span>
        : <span className="text-xs text-text-muted">Off</span>,
    },
  ]

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Memberships"
          subtitle={`${active.length} active · ${expired.length} expired · anchor identity · Performance Elite is earned, not purchased`}
          actions={
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
              New Membership
            </Button>
          }
        />

        <div className="border border-white/10 bg-[#0f0f0f] p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Age bands · scarcity</p>
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
        </div>

        {/* Plan cards */}
        <div className="space-y-4">
          <SectionHeader title="Membership Plans" description={SITE.youthBasePlanSummary} />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {mockMembershipPlans.map(plan => {
              const subscriberCount = mockMembershipInstances.filter(m => m.planId === plan.id && m.status === 'active').length
              return (
                <div key={plan.id} className={cn(
                  'relative rounded-xl border bg-surface p-5 space-y-4',
                  plan.popular ? 'border-primary/40' : 'border-border'
                )}>
                  {plan.popular && (
                    <div className="absolute -top-2.5 left-4">
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Crown className="h-3 w-3" />Popular
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="h-2.5 w-2.5 rounded-full mb-3" style={{ backgroundColor: plan.color }} />
                    <p className="text-md font-bold text-text-primary">{plan.name}</p>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">{plan.description}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-text-primary">{formatCurrency(plan.price)}</p>
                    <p className="text-xs text-text-muted">
                      {plan.sessionCount === 'unlimited' ? 'Unlimited sessions' : `${plan.sessionCount} sessions`} · {plan.validityDays} days
                    </p>
                  </div>
                  <ul className="space-y-1.5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                        <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-text-muted">{subscriberCount} active</span>
                    <Button variant="secondary" size="sm">Edit</Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Active memberships table */}
        <div className="space-y-4">
          <SectionHeader title="Active Memberships" description={`${active.length} players`} />
          <DataTable
            columns={columns}
            data={active}
            keyField="id"
            emptyTitle="No active memberships"
          />
        </div>

        {/* Expired */}
        {expired.length > 0 && (
          <div className="space-y-4">
            <SectionHeader title="Expired / Needs Renewal" description={`${expired.length} players`} />
            <DataTable
              columns={columns}
              data={expired}
              keyField="id"
              emptyTitle="No expired memberships"
            />
          </div>
        )}
      </div>
    </PageContainer>
  )
}
