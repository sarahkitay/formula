import Link from 'next/link'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { MembershipWaitlistCapture } from '@/components/marketing/membership-waitlist-capture'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SESSION_PACKAGE_10 } from '@/lib/marketing/public-pricing'

/**
 * Top-of-page hero: session package + memberships coming soon. Keeps youth membership
 * feeling product-led rather than long-form doc.
 */
export function YouthMembershipPackageHero() {
  return (
    <div className="not-prose mb-12 space-y-6 md:mb-14">
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
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-formula-volt">
                Session package · Available now
              </p>
              <div className="mt-6 flex flex-wrap items-start gap-x-5 gap-y-4 md:gap-x-8">
                <div className="flex min-w-0 items-start gap-4 md:gap-6">
                  <div className="flex flex-col items-start">
                    <p className="font-mono text-[clamp(3rem,8vw,4rem)] font-bold leading-none tracking-[-0.03em] text-formula-paper tabular-nums">
                      {SESSION_PACKAGE_10.sessions}
                    </p>
                    <p className="mt-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-formula-mist">
                      sessions
                    </p>
                  </div>
                  <div
                    className="mt-1 hidden h-[clamp(2.75rem,7vw,3.75rem)] w-px shrink-0 bg-gradient-to-b from-formula-volt/55 to-transparent md:block"
                    aria-hidden
                  />
                  <p className="font-mono text-[clamp(3rem,8vw,4rem)] font-bold leading-none tracking-[-0.03em] text-formula-paper tabular-nums">
                    ${SESSION_PACKAGE_10.priceUsd}
                  </p>
                </div>
                <p className="min-w-0 max-w-none flex-1 basis-[min(100%,18rem)] text-[15px] leading-relaxed text-formula-frost/88 md:pt-1 lg:max-w-[42ch]">
                  {SESSION_PACKAGE_10.purchaseNote}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <CheckoutLaunchButton checkoutType="package-10" label="Buy package" />
                <CheckoutLaunchButton
                  checkoutType="assessment"
                  label="Book assessment"
                  className="border border-black/25"
                />
                <Link
                  href={MARKETING_HREF.clinics}
                  className="inline-flex h-11 items-center border border-formula-frost/18 bg-formula-paper/[0.04] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper hover:border-formula-frost/28"
                >
                  Clinics & programs
                </Link>
              </div>
            </div>
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
            Recurring youth membership tiers aren&apos;t open yet. Join the waitlist and we&apos;ll reach you when published blocks and pricing go live.
          </p>
        </div>
        <MembershipWaitlistCapture
          source="youth-membership"
          label="Join waitlist"
          buttonClassName="inline-flex h-11 shrink-0 items-center border border-formula-frost/18 bg-formula-paper/[0.06] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper hover:border-formula-volt/35"
        />
      </div>
    </div>
  )
}
