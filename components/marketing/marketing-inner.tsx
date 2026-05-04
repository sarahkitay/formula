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

export function SectionLabel({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-mist">
      {children}
    </p>
  )
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
        'mx-auto w-full min-w-0 max-w-full px-4 pb-28 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-32 sm:pt-28 md:pt-32',
        wide ? 'max-w-[1100px]' : 'max-w-[720px]',
        articleClassName
      )}
    >
      {prepend}
      <ScrollFadeIn className="min-w-0 w-full">
        <SectionLabel>{eyebrow}</SectionLabel>
        <h1 className={cn(marketingDisplayH1ClassName, 'mt-3 sm:mt-4')}>
          {marketingTitleContent(title)}
        </h1>
        {intro ? (
          <p className="mt-4 max-w-[62ch] break-words text-sm leading-relaxed text-formula-frost/85 sm:mt-6 sm:text-[15px]">
            {intro}
          </p>
        ) : null}
        <div className="prose-marketing mt-8 min-w-0 w-full max-w-full sm:mt-10 md:mt-12">{children}</div>
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
    <div className="not-prose mt-10 flex flex-col gap-3 border-t border-formula-frost/12 pt-8 sm:mt-12 sm:flex-row sm:flex-wrap sm:pt-10">
      {primaryIsCheckout ? (
        <CheckoutLaunchButton checkoutType={primary.checkoutType} label={primary.label} />
      ) : (
        <Link
          href={primary.href}
          className="inline-flex min-h-12 w-full items-center justify-center border border-black/20 bg-formula-volt px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] !text-black no-underline transition-[filter] hover:brightness-105 hover:!text-black sm:h-11 sm:w-auto sm:min-h-0 sm:px-6 sm:text-[11px]"
        >
          {primary.label}
        </Link>
      )}
      {secondary && 'waitlist' in secondary && secondary.waitlist ? (
        <MembershipWaitlistCapture
          source="youth-membership"
          label={secondary.label}
          buttonClassName="inline-flex min-h-12 w-full items-center justify-center border border-formula-frost/14 bg-formula-paper/[0.04] px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-formula-paper no-underline hover:border-formula-frost/22 sm:h-11 sm:w-auto sm:min-h-0 sm:px-6 sm:text-[11px]"
        />
      ) : secondary && 'href' in secondary ? (
        <Link
          href={secondary.href}
          className="inline-flex min-h-12 w-full items-center justify-center border border-formula-frost/14 bg-formula-paper/[0.04] px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] !text-formula-paper no-underline hover:border-formula-frost/22 hover:!text-formula-paper sm:h-11 sm:w-auto sm:min-h-0 sm:px-6 sm:text-[11px]"
        >
          {secondary.label}
        </Link>
      ) : null}
    </div>
  )
}
