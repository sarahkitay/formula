import type { ReactNode } from 'react'
import Link from 'next/link'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { MembershipWaitlistCapture } from '@/components/marketing/membership-waitlist-capture'
import type { CheckoutType } from '@/lib/stripe/checkout-types'

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-mist">{children}</p>
}

export function MarketingInnerPage({
  prepend,
  eyebrow,
  title,
  intro,
  children,
  wide = false,
}: {
  /** Renders above eyebrow/title — e.g. hero offer. */
  prepend?: ReactNode
  eyebrow: string
  title: string
  intro?: string
  children: ReactNode
  wide?: boolean
}) {
  return (
    <article className={`mx-auto px-6 pb-24 pt-28 md:pb-32 md:pt-32 ${wide ? 'max-w-[1100px]' : 'max-w-[720px]'}`}>
      {prepend}
      <SectionLabel>{eyebrow}</SectionLabel>
      <h1 className="mt-4 font-mono text-[clamp(1.75rem,4.5vw,2.75rem)] font-semibold leading-tight tracking-tight text-formula-paper">{title}</h1>
      {intro ? <p className="mt-6 max-w-[62ch] text-[15px] leading-relaxed text-formula-frost/85">{intro}</p> : null}
      <div className="prose-marketing mt-12">{children}</div>
    </article>
  )
}

export function CtaRow({
  primary,
  secondary,
}: {
  primary: { label: string; href: string } | { label: string; checkoutType: CheckoutType }
  secondary?: { label: string; href: string } | { label: string; waitlist: true }
}) {
  const primaryIsCheckout = 'checkoutType' in primary

  return (
    <div className="not-prose mt-12 flex flex-wrap gap-3 border-t border-formula-frost/12 pt-10">
      {primaryIsCheckout ? (
        <CheckoutLaunchButton checkoutType={primary.checkoutType} label={primary.label} />
      ) : (
        <Link
          href={primary.href}
          className="inline-flex h-11 items-center border border-black/20 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] !text-black no-underline transition-[filter] hover:brightness-105 hover:!text-black"
        >
          {primary.label}
        </Link>
      )}
      {secondary && 'waitlist' in secondary && secondary.waitlist ? (
        <MembershipWaitlistCapture
          source="youth-membership"
          label={secondary.label}
          buttonClassName="inline-flex h-11 items-center border border-formula-frost/14 bg-formula-paper/[0.04] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper no-underline hover:border-formula-frost/22"
        />
      ) : secondary && 'href' in secondary ? (
        <Link
          href={secondary.href}
          className="inline-flex h-11 items-center border border-formula-frost/14 bg-formula-paper/[0.04] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] !text-formula-paper no-underline hover:border-formula-frost/22 hover:!text-formula-paper"
        >
          {secondary.label}
        </Link>
      ) : null}
    </div>
  )
}
