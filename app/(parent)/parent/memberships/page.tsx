import React from 'react'
import { CheckCircle2, Crown, ArrowRight } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { SectionHeader } from '@/components/ui/section-header'
import { Button } from '@/components/ui/button'
import { Badge, StatusPill } from '@/components/ui/badge'
import { mockPlayers } from '@/lib/mock-data/players'
import { getMembershipByPlayer, mockMembershipPlans } from '@/lib/mock-data/memberships'
import { formatDate, formatCurrency, cn } from '@/lib/utils'

const PARENT_PLAYER_IDS = ['player-6', 'player-7']
const myPlayers = mockPlayers.filter(p => PARENT_PLAYER_IDS.includes(p.id))

export default function ParentMembershipsPage() {
  return (
  <PageContainer>
  <div className="space-y-8">
  <PageHeader
  title="Membership"
  subtitle="Current tier, session cadence, benefits, and reassessment rhythm - Performance Elite is earned through development fit, not purchased as status."
  />

  <div className="border border-white/10 bg-[#0f0f0f] px-5 py-4 text-sm leading-relaxed text-zinc-400">
  <strong className="font-semibold text-zinc-100">Elite qualification:</strong> coaches review training habits,
  application, and cohort fit - upgrades are offered when appropriate, never as pressure.
  </div>

  {/* Active memberships */}
  <div className="space-y-4">
  <SectionHeader title="Active Memberships" />
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  {myPlayers.map(player => {
  const mem = getMembershipByPlayer(player.id)
  if (!mem) return (
  <div key={player.id} className="rounded-xl border border-border bg-surface p-5 flex items-center gap-4">
  <div className="flex-1">
  <p className="font-semibold text-text-primary">{player.firstName} {player.lastName}</p>
  <p className="text-sm text-text-muted mt-0.5">No active membership</p>
  </div>
  <Button variant="primary" size="sm">Get Membership</Button>
  </div>
  )
  return (
  <div key={player.id} className="rounded-xl border border-border bg-surface p-5 space-y-4">
  <div className="flex items-start justify-between">
  <div>
  <p className="text-xs text-text-muted">{player.firstName} {player.lastName}</p>
  <p className="text-xl font-bold text-text-primary mt-0.5">{mem.planName}</p>
  </div>
  <StatusPill status={mem.status} />
  </div>
  <div className="space-y-2">
  <div className="flex items-center justify-between text-sm">
  <span className="text-text-secondary">Sessions remaining</span>
  <span className={cn('font-bold', player.sessionsRemaining === 0 ? 'text-error' : 'text-success')}>
  {player.sessionsRemaining} / {mem.sessionsTotal === 'unlimited' ? '∞' : mem.sessionsTotal}
  </span>
  </div>
  <div className="h-2 bg-surface-raised rounded-full overflow-hidden">
  <div
  className={cn('h-full rounded-full', player.sessionsRemaining === 0 ? 'bg-error' : 'bg-primary')}
  style={{ width: typeof mem.sessionsTotal === 'number' ? `${(player.sessionsRemaining / mem.sessionsTotal) * 100}%` : '100%' }}
  />
  </div>
  </div>
  <div className="flex items-center justify-between text-xs text-text-muted">
  <span>Started {formatDate(mem.startDate)}</span>
  <span>Expires {formatDate(mem.expiryDate)}</span>
  </div>
  <div className="flex items-center justify-between">
  <span className="text-xs text-text-muted">Auto-renew: {mem.autoRenew ? 'On' : 'Off'}</span>
  <Button variant="secondary" size="sm">Renew / Upgrade</Button>
  </div>
  </div>
  )
  })}
  </div>
  </div>

  {/* Plan options */}
  <div className="space-y-4">
  <SectionHeader title="Available Plans" description="Upgrade or add a new membership" />
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
  {mockMembershipPlans.map(plan => (
  <div key={plan.id} className={cn('relative rounded-xl border p-5 space-y-4', plan.popular ? 'border-accent/30 bg-accent/3' : 'border-border bg-surface')}>
  {plan.popular && (
  <div className="absolute -top-2.5 left-4">
  <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
  <Crown className="h-3 w-3" /> Popular
  </span>
  </div>
  )}
  <div>
  <p className="font-bold text-text-primary text-md">{plan.name}</p>
  <p className="text-2xl font-black text-text-primary mt-1">{formatCurrency(plan.price)}</p>
  <p className="text-xs text-text-muted">
  {plan.sessionCount === 'unlimited' ? 'Unlimited sessions' : `${plan.sessionCount} sessions`} · {plan.validityDays} days
  </p>
  </div>
  <ul className="space-y-1.5">
  {plan.features.map((f, i) => (
  <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
  <CheckCircle2 className="h-3 w-3 text-success mt-0.5 shrink-0" />
  {f}
  </li>
  ))}
  </ul>
  <Button variant={plan.popular ? 'primary' : 'secondary'} size="sm" className="w-full" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
  Select Plan
  </Button>
  </div>
  ))}
  </div>
  </div>
  </div>
  </PageContainer>
  )
}
