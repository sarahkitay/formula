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
              <div className="mt-6 flex flex-wrap items-end gap-6 md:gap-10">
                <div>
                  <p className="font-mono text-[clamp(3.25rem,10vw,4.5rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-formula-paper">
                    {SESSION_PACKAGE_10.sessions}
                  </p>
                  <p className="mt-1 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-formula-mist">
                    sessions
                  </p>
                </div>
                <div className="h-px w-full min-w-[2rem] max-w-[4rem] shrink-0 self-center bg-gradient-to-r from-formula-volt/50 to-transparent md:h-16 md:w-px md:bg-gradient-to-b" />
                <div>
                  <p className="font-mono text-[clamp(2.5rem,7vw,3.5rem)] font-semibold leading-none tracking-tight text-formula-paper">
                    ${SESSION_PACKAGE_10.priceUsd}
                  </p>
                  <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-formula-frost/88">
                    {SESSION_PACKAGE_10.summary} Pay securely online, or purchase through your assessment or at the desk — we&apos;ll confirm scheduling and
                    cadence.
                  </p>
                </div>
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
