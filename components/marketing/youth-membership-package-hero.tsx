import Link from 'next/link'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { MembershipWaitlistCapture } from '@/components/marketing/membership-waitlist-capture'
import { YouthPackageAckStrip } from '@/components/marketing/youth-package-ack-strip'
import { marketingInnerH1CompactClassName } from '@/lib/marketing/display-typography'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import {
  FORMULA_SKILLS_CHECK,
  SESSION_PACKAGE_5,
  SESSION_PACKAGE_10,
  SESSION_PACKAGE_EARLY_BIRD,
} from '@/lib/marketing/public-pricing'
import { cn } from '@/lib/utils'

const sessionTableClass = 'w-full min-w-[320px] border-collapse font-mono text-[11px] text-formula-frost/90'

/**
 * Top-of-page hero: memberships narrative, quick start flow, session packages, waitlist.
 */
export function YouthMembershipPackageHero() {
  return (
    <div className="not-prose mb-12 space-y-10 md:mb-14">
      <header className="scroll-mt-[calc(3.5rem+1rem)]">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-formula-volt">Formula memberships</p>
        <h1 className={cn(marketingInnerH1CompactClassName, 'mt-3 max-w-4xl')}>Formula Memberships</h1>
        <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-formula-frost/88">
          Start with an assessment, grab early bird session packages (thru June), join waitlist for monthly tiers. Data-tracked training that fits your schedule.
        </p>
      </header>

      <section
        aria-labelledby="youth-membership-quick-start"
        className="relative overflow-hidden rounded-sm border border-formula-frost/[0.14] bg-gradient-to-br from-formula-paper/[0.06] via-formula-deep/40 to-formula-base/80 p-6 shadow-[inset_0_1px_0_0_rgb(220_255_0_/_.12)] md:p-8"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          aria-hidden
          style={{
            backgroundImage: `linear-gradient(135deg, transparent 40%, rgb(220 255 0 / 0.04) 100%),
              linear-gradient(to bottom, rgb(220 255 0 / 0.07) 0, transparent 1px)`,
            backgroundSize: '100% 100%, 100% 100%',
          }}
        />
        <div className="relative space-y-8">
          <h2
            id="youth-membership-quick-start"
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-formula-mist"
          >
            Quick start flow
          </h2>

          <div>
            <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-mist">Book assessment</h3>
            <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-formula-frost/88">
              Book Assessment (${FORMULA_SKILLS_CHECK.priceUsd}, waived w/ membership): 1-hr Skills Check across {FORMULA_SKILLS_CHECK.measures.length}{' '}
              pillars → personalized plan + parent report.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-mist">Buy sessions (early bird thru June)</h3>
            <div className="mt-3 overflow-x-auto rounded-sm border border-formula-frost/12 bg-formula-base/40">
              <table className={sessionTableClass}>
                <caption className="sr-only">Early bird session package pricing</caption>
                <thead>
                  <tr className="border-b border-formula-frost/15 text-left text-formula-mist uppercase tracking-wide">
                    <th className="px-3 py-2.5 font-medium">Package</th>
                    <th className="px-3 py-2.5 font-medium">Price</th>
                    <th className="px-3 py-2.5 font-medium">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-formula-frost/[0.07]">
                    <td className="px-3 py-2.5 align-top text-formula-paper/95">{SESSION_PACKAGE_5.sessions} sessions</td>
                    <td className="px-3 py-2.5 align-top">${SESSION_PACKAGE_5.priceUsd}</td>
                    <td className="px-3 py-2.5 align-top text-formula-frost/80">Schedule post-purchase</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 align-top text-formula-paper/95">{SESSION_PACKAGE_10.sessions} sessions</td>
                    <td className="px-3 py-2.5 align-top">${SESSION_PACKAGE_10.priceUsd}</td>
                    <td className="px-3 py-2.5 align-top text-formula-frost/80">Schedule post-purchase</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-mist">Waitlist for monthly</h3>
            <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-formula-frost/85">
              Weekly blocks, capped groups, reassessments—opens next month.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em]">
            <Link
              href={MARKETING_HREF.bookAssessmentPortal}
              className="inline-flex h-10 items-center justify-center border border-black/25 bg-formula-volt/[0.16] px-4 text-formula-volt shadow-[inset_0_0_0_1px_rgb(220_255_0_/_0.08)] transition-[filter,background-color] hover:bg-formula-volt/[0.22] hover:brightness-105"
            >
              Book assessment
            </Link>
            <span className="px-0.5 text-formula-mist/40" aria-hidden>
              |
            </span>
            <Link
              href="#session-package"
              className="inline-flex h-10 items-center justify-center border border-formula-frost/18 bg-formula-paper/[0.04] px-4 text-formula-paper hover:border-formula-frost/28"
            >
              Buy package
            </Link>
            <span className="px-0.5 text-formula-mist/40" aria-hidden>
              |
            </span>
            <Link
              href="#membership-waitlist"
              className="inline-flex h-10 items-center justify-center border border-formula-frost/18 bg-formula-paper/[0.04] px-4 text-formula-paper hover:border-formula-frost/28"
            >
              Join waitlist
            </Link>
          </div>
        </div>
      </section>

      <div id="session-package" className="scroll-mt-[calc(3.5rem+1rem)] space-y-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-formula-volt">
          {SESSION_PACKAGE_EARLY_BIRD.headline} · {SESSION_PACKAGE_EARLY_BIRD.validThrough}
        </p>
        <p className="max-w-[52ch] text-[14px] leading-relaxed text-formula-frost/88">{SESSION_PACKAGE_EARLY_BIRD.validityNote}</p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-sm border border-formula-frost/16 bg-formula-base/40 p-5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">{SESSION_PACKAGE_5.label}</p>
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <p className="font-mono text-[clamp(2.25rem,6vw,3.25rem)] font-bold leading-none tracking-[-0.03em] text-formula-paper tabular-nums">
                {SESSION_PACKAGE_5.sessions}
                <span className="ml-2 text-[11px] font-medium uppercase tracking-[0.18em] text-formula-mist">sessions</span>
              </p>
              <p className="font-mono text-[clamp(2rem,5vw,2.75rem)] font-bold leading-none text-formula-paper tabular-nums">${SESSION_PACKAGE_5.priceUsd}</p>
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
              <p className="font-mono text-[clamp(2rem,5vw,2.75rem)] font-bold leading-none text-formula-paper tabular-nums">${SESSION_PACKAGE_10.priceUsd}</p>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-formula-frost/85">{SESSION_PACKAGE_10.purchaseNote}</p>
            <div className="mt-5">
              <CheckoutLaunchButton checkoutType="package-10" label={`Buy ${SESSION_PACKAGE_10.sessions}-session package`} />
            </div>
          </div>
        </div>

        <YouthPackageAckStrip />

        <p className="text-sm text-formula-frost/70">Session expiration window: confirm with the desk before launch.</p>
      </div>

      <div id="membership-waitlist" className="scroll-mt-[calc(3.5rem+1rem)]">
        <div className="marketing-glass flex flex-col gap-5 rounded-sm border border-formula-frost/12 bg-formula-paper/[0.03] px-6 py-7 md:flex-row md:items-center md:justify-between md:px-8 md:py-8">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-formula-mist">Monthly tiers</p>
            <p className="mt-2 font-mono text-lg font-semibold tracking-tight text-formula-paper md:text-xl">Waitlist</p>
            <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-formula-frost/80">
              Weekly blocks, capped groups, reassessments—opens next month. Join the waitlist for first access when published blocks go live.
            </p>
          </div>
          <MembershipWaitlistCapture
            source="youth-membership"
            label="Join waitlist"
            buttonClassName="inline-flex h-11 shrink-0 items-center border border-formula-frost/18 bg-formula-paper/[0.06] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper hover:border-formula-volt/35"
          />
        </div>
      </div>
    </div>
  )
}
