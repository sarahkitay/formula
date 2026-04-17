import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { ParentMembershipsLinkedAthletes } from '@/components/parent/parent-memberships-linked-athletes'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SESSION_PACKAGE_10, SESSION_PACKAGE_5, SESSION_PACKAGE_EARLY_BIRD } from '@/lib/marketing/public-pricing'
import { cn } from '@/lib/utils'

export default function ParentMembershipsPage() {
  return (
    <PageContainer>
      <div className="space-y-10">
        <PageHeader
          title="Membership"
          subtitle="Session packages and membership options. Recurring plans are not live in the app yet."
        />

        {/* Session package / premium hero */}
        <div className="relative overflow-hidden rounded-2xl border border-border-bright/25 bg-gradient-to-br from-elevated via-surface to-surface-raised shadow-[inset_0_1px_0_0_rgb(255_255_255_/_.06)]">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,color-mix(in_srgb,var(--color-primary)_12%,transparent),transparent_55%)] opacity-90"
            aria-hidden
          />
          <div className="relative px-6 py-9 md:px-10 md:py-11">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-primary">
              {SESSION_PACKAGE_EARLY_BIRD.headline}
            </p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">{SESSION_PACKAGE_EARLY_BIRD.validityNote}</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-control border border-border bg-surface-raised/80 p-5">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-text-muted">{SESSION_PACKAGE_5.label}</p>
                <p className="mt-2 text-3xl font-bold tabular-nums text-text-primary md:text-4xl">
                  {SESSION_PACKAGE_5.sessions} <span className="text-lg font-semibold text-text-muted">sessions</span>
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-text-primary">${SESSION_PACKAGE_5.priceUsd}</p>
                <p className="mt-3 text-xs leading-relaxed text-text-secondary">{SESSION_PACKAGE_5.summary}</p>
              </div>
              <div className="rounded-control border border-primary/30 bg-primary/5 p-5">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-text-muted">{SESSION_PACKAGE_10.label}</p>
                <p className="mt-2 text-3xl font-bold tabular-nums text-text-primary md:text-4xl">
                  {SESSION_PACKAGE_10.sessions} <span className="text-lg font-semibold text-text-muted">sessions</span>
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-text-primary">${SESSION_PACKAGE_10.priceUsd}</p>
                <p className="mt-3 text-xs leading-relaxed text-text-secondary">{SESSION_PACKAGE_10.summary}</p>
              </div>
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-text-secondary">
              Purchase and scheduling are handled at the front desk, on the public programs page, or during your assessment — not in this portal yet.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/parent/bookings"
                className={cn(
                  'inline-flex h-10 items-center justify-center rounded-control px-4 text-sm font-medium',
                  'bg-primary text-primary-foreground shadow-glow-blue transition-[filter] hover:brightness-110 hover:shadow-glow-accent-sm'
                )}
              >
                Book training
              </Link>
              <Link
                href={MARKETING_HREF.assessment}
                className={cn(
                  'inline-flex h-10 items-center justify-center rounded-control border border-border bg-muted px-4 text-sm font-medium text-text-primary',
                  'transition-colors hover:border-border-bright hover:bg-elevated'
                )}
              >
                Assessment info
              </Link>
            </div>
          </div>
        </div>

        {/* Monthly memberships / coming soon */}
        <div className="rounded-2xl border border-border bg-surface p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-text-muted">
              Monthly memberships
            </p>
            <p className="mt-2 text-xl font-bold tracking-tight text-text-primary md:text-2xl">
              Coming soon
            </p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
              Recurring youth membership tiers aren&apos;t available here yet. We&apos;ll open enrollment when tiers and published blocks are finalized.
            </p>
          </div>
          <Link
            href={MARKETING_HREF.youthMembership}
            className={cn(
              'mt-5 inline-flex h-10 shrink-0 items-center justify-center rounded-control border border-border bg-muted px-4 text-sm font-medium text-text-primary md:mt-0',
              'transition-colors hover:border-border-bright hover:bg-elevated'
            )}
          >
            View public pricing page
          </Link>
        </div>

        <ParentMembershipsLinkedAthletes />
      </div>
    </PageContainer>
  )
}
