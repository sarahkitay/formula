import Link from 'next/link'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { MembershipWaitlistCapture } from '@/components/marketing/membership-waitlist-capture'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SESSION_PACKAGE_5, SESSION_PACKAGE_10, SESSION_PACKAGE_EARLY_BIRD } from '@/lib/marketing/public-pricing'

/**
 * Top-of-page hero: early bird session packages + memberships coming soon. Keeps youth membership
 * feeling product-led rather than long-form doc.
 */
export function YouthMembershipPackageHero() {
  return (
    <div id="session-package" className="not-prose mb-12 space-y-6 md:mb-14 scroll-mt-[calc(3.5rem+1rem)]">
      <div className="relative overflow-hidden rounded-sm border border-formula-frost/[0.14] bg-gradient-to-br from-formula-paper/[0.06] via-formula-deep/40 to-formula-base/80 shadow-[inset_0_1px_0_0_rgb(220_255_0_/_.12)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          aria-hidden
          style={{
            backgroundImage: `linear-gradient(135deg, transparent 40%, rgb(220 255 0 / 0.04) 100%),
              linear-gradient(to bottom, rgb(220 255 0 / 0.07) 0, transparent 1px)`,
            backgroundSize: '100% 100%, 100% 100%',
          }}
        />
        <div className="relative px-6 py-10 md:px-10 md:py-12">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-formula-volt">
            {SESSION_PACKAGE_EARLY_BIRD.headline} · {SESSION_PACKAGE_EARLY_BIRD.validThrough}
          </p>
          <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-formula-frost/88">{SESSION_PACKAGE_EARLY_BIRD.validityNote}</p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-sm border border-formula-frost/16 bg-formula-base/40 p-5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">{SESSION_PACKAGE_5.label}</p>
              <div className="mt-4 flex flex-wrap items-end gap-4">
                <p className="font-mono text-[clamp(2.25rem,6vw,3.25rem)] font-bold leading-none tracking-[-0.03em] text-formula-paper tabular-nums">
                  {SESSION_PACKAGE_5.sessions}
                  <span className="ml-2 text-[11px] font-medium uppercase tracking-[0.18em] text-formula-mist">sessions</span>
                </p>
                <p className="font-mono text-[clamp(2rem,5vw,2.75rem)] font-bold leading-none text-formula-paper tabular-nums">
                  ${SESSION_PACKAGE_5.priceUsd}
                </p>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-formula-frost/85">{SESSION_PACKAGE_5.purchaseNote}</p>
              <div className="mt-5">
                <CheckoutLaunchButton checkoutType="package-5" label={`Buy ${SESSION_PACKAGE_5.sessions}-session package`} />
              </div>
            </div>

            <div className="rounded-sm border border-formula-volt/25 bg-formula-volt/[0.04] p-5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt">{SESSION_PACKAGE_10.label}</p>
              <div className="mt-4 flex flex-wrap items-end gap-4">
                <p className="font-mono text-[clamp(2.25rem,6vw,3.25rem)] font-bold leading-none tracking-[-0.03em] text-formula-paper tabular-nums">
                  {SESSION_PACKAGE_10.sessions}
                  <span className="ml-2 text-[11px] font-medium uppercase tracking-[0.18em] text-formula-mist">sessions</span>
                </p>
                <p className="font-mono text-[clamp(2rem,5vw,2.75rem)] font-bold leading-none text-formula-paper tabular-nums">
                  ${SESSION_PACKAGE_10.priceUsd}
                </p>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-formula-frost/85">{SESSION_PACKAGE_10.purchaseNote}</p>
              <div className="mt-5">
                <CheckoutLaunchButton checkoutType="package-10" label={`Buy ${SESSION_PACKAGE_10.sessions}-session package`} />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={MARKETING_HREF.bookAssessmentPortal}
              className="inline-flex h-11 items-center justify-center border border-black/25 bg-formula-volt/[0.14] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-volt shadow-[inset_0_0_0_1px_rgb(220_255_0_/_0.08)] transition-[filter,background-color] hover:bg-formula-volt/[0.2] hover:brightness-105"
            >
              Book an assessment
            </Link>
            <Link
              href={MARKETING_HREF.clinics}
              className="inline-flex h-11 items-center border border-formula-frost/18 bg-formula-paper/[0.04] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper hover:border-formula-frost/28"
            >
              Clinics & programs
            </Link>
          </div>
        </div>
      </div>

      <div className="marketing-glass flex flex-col gap-5 rounded-sm border border-formula-frost/12 bg-formula-paper/[0.03] px-6 py-7 md:flex-row md:items-center md:justify-between md:px-8 md:py-8">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-formula-mist">
            Monthly memberships
          </p>
          <p className="mt-2 font-mono text-lg font-semibold tracking-tight text-formula-paper md:text-xl">
            Coming soon
          </p>
          <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-formula-frost/80">
            Youth memberships are coming within the next month. Join the waitlist to get first access when published blocks and pricing go live.
          </p>
        </div>
        <MembershipWaitlistCapture
          source="youth-membership"
          label="Join the membership waitlist"
          buttonClassName="inline-flex h-11 shrink-0 items-center border border-formula-frost/18 bg-formula-paper/[0.06] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper hover:border-formula-volt/35"
        />
      </div>
    </div>
  )
}
