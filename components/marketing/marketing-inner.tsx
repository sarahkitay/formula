import { Fragment, type ReactNode } from 'react'
import Link from 'next/link'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { MembershipWaitlistCapture } from '@/components/marketing/membership-waitlist-capture'
import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'
import { marketingDisplayH1ClassName } from '@/lib/marketing/display-typography'
import type { CheckoutType } from '@/lib/stripe/checkout-types'
import { cn } from '@/lib/utils'

/** Renders a title string; `<br>`, `<br/>`, `<br />` become line breaks (React escapes raw HTML in strings). */
function marketingTitleContent(title: string | ReactNode): ReactNode {
  if (typeof title !== 'string') return title
  const parts = title.split(/<\s*br\s*\/?\s*>/gi)
  if (parts.length === 1) return title
  return parts.map((segment, i) => (
    <Fragment key={i}>
      {i > 0 ? <br /> : null}
      {segment}
    </Fragment>
  ))
}

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
  articleClassName,
}: {
  /** Renders above eyebrow/title (e.g. hero offer). */
  prepend?: ReactNode
  eyebrow: string
  title: string | ReactNode
  intro?: string
  children: ReactNode
  wide?: boolean
  /** Merged onto the article (e.g. tighter top when content above already clears the header). */
  articleClassName?: string
}) {
  return (
    <article
      className={cn(
        'mx-auto px-4 pb-24 pt-24 sm:px-6 sm:pt-28 md:pb-32 md:pt-32',
        wide ? 'max-w-[1100px]' : 'max-w-[720px]',
        articleClassName
      )}
    >
      {prepend}
      <ScrollFadeIn>
        <SectionLabel>{eyebrow}</SectionLabel>
        <h1 className={cn(marketingDisplayH1ClassName, 'mt-4')}>
          {marketingTitleContent(title)}
        </h1>
        {intro ? (
          <p className="mt-6 max-w-[62ch] text-sm leading-relaxed text-formula-frost/85 sm:text-[15px]">{intro}</p>
        ) : null}
        <div className="prose-marketing mt-12">{children}</div>
      </ScrollFadeIn>
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
