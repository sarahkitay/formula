import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { SectionHeader } from '@/components/ui/section-header'
import { mockPlayers } from '@/lib/mock-data/players'
import { getMembershipByPlayer } from '@/lib/mock-data/memberships'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SESSION_PACKAGE_10 } from '@/lib/marketing/public-pricing'
import { formatDate, cn } from '@/lib/utils'

const PARENT_PLAYER_IDS = ['player-6', 'player-7']
const myPlayers = mockPlayers.filter((p) => PARENT_PLAYER_IDS.includes(p.id))

export default function ParentMembershipsPage() {
  return (
    <PageContainer>
      <div className="space-y-10">
        <PageHeader
          title="Membership"
          subtitle="Session packages and membership options — recurring plans are not live in the app yet."
        />

        {/* Session package — premium hero */}
        <div className="relative overflow-hidden rounded-2xl border border-border-bright/25 bg-gradient-to-br from-elevated via-surface to-surface-raised shadow-[inset_0_1px_0_0_rgb(255_255_255_/_.06)]">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,color-mix(in_srgb,var(--color-primary)_12%,transparent),transparent_55%)] opacity-90"
            aria-hidden
          />
          <div className="relative px-6 py-9 md:px-10 md:py-11">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-primary">
              Available now
            </p>
            <div className="mt-6 flex flex-wrap items-end gap-8 md:gap-12">
              <div>
                <p className="text-[clamp(2.75rem,8vw,4rem)] font-bold leading-[0.9] tracking-tight text-text-primary">
                  {SESSION_PACKAGE_10.sessions}
                </p>
                <p className="mt-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                  sessions
                </p>
              </div>
              <div className="hidden h-14 w-px shrink-0 bg-gradient-to-b from-primary/50 to-transparent md:block" />
              <div className="min-w-0">
                <p className="text-[clamp(2rem,5vw,2.75rem)] font-bold leading-none tracking-tight text-text-primary">
                  ${SESSION_PACKAGE_10.priceUsd}
                </p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
                  {SESSION_PACKAGE_10.summary} Purchase and scheduling are handled at the front desk or during your assessment — not in this portal yet.
                </p>
              </div>
            </div>
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

        {/* Monthly memberships — coming soon */}
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

        <div className="space-y-4">
          <SectionHeader
            title="Your athletes"
            description="Linked players and membership status once recurring plans go live."
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {myPlayers.map((player) => {
              const mem = getMembershipByPlayer(player.id)
              if (!mem) {
                return (
                  <div
                    key={player.id}
                    className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-bright"
                  >
                    <p className="text-lg font-semibold text-text-primary">
                      {player.firstName} {player.lastName}
                    </p>
                    <p className="mt-2 text-sm text-text-secondary">
                      No active membership on file. The {SESSION_PACKAGE_10.sessions}-session package (${SESSION_PACKAGE_10.priceUsd}) is our current offer — ask
                      staff at your next visit or assessment to purchase or redeem sessions.
                    </p>
                  </div>
                )
              }
              return (
                <div key={player.id} className="rounded-2xl border border-border bg-surface p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-text-muted">
                        {player.firstName} {player.lastName}
                      </p>
                      <p className="text-xl font-bold text-text-primary mt-0.5">{mem.planName}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Sessions remaining</span>
                      <span
                        className={cn(
                          'font-bold',
                          player.sessionsRemaining === 0 ? 'text-error' : 'text-success'
                        )}
                      >
                        {player.sessionsRemaining} /{' '}
                        {mem.sessionsTotal === 'unlimited' ? '∞' : mem.sessionsTotal}
                      </span>
                    </div>
                    <div className="h-2 bg-surface-raised rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          player.sessionsRemaining === 0 ? 'bg-error' : 'bg-primary'
                        )}
                        style={{
                          width:
                            typeof mem.sessionsTotal === 'number'
                              ? `${(player.sessionsRemaining / mem.sessionsTotal) * 100}%`
                              : '100%',
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted">
                    <span>Started {formatDate(mem.startDate)}</span>
                    <span>Expires {formatDate(mem.expiryDate)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
