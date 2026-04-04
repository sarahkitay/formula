import type { Metadata } from 'next'
import Link from 'next/link'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export const metadata: Metadata = {
  title: 'Checkout canceled',
  robots: { index: false, follow: false },
}

export default function CheckoutCancelPage() {
  return (
    <article className="mx-auto max-w-lg px-6 pb-24 pt-28 md:pb-32 md:pt-32">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-formula-mist">Checkout</p>
      <h1 className="mt-4 font-mono text-2xl font-semibold tracking-tight text-formula-paper">Payment canceled</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-formula-frost/85">
        No charge was made. You can return to pricing or assessments anytime.
      </p>
      <div className="not-prose mt-10 flex flex-wrap gap-3">
        <Link
          href={MARKETING_HREF.youthMembership}
          className="inline-flex h-11 items-center border border-black/20 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] !text-black hover:brightness-105"
        >
          Session package
        </Link>
        <Link
          href={MARKETING_HREF.assessment}
          className="inline-flex h-11 items-center border border-formula-frost/14 bg-formula-paper/[0.04] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper hover:border-formula-frost/22"
        >
          Assessments
        </Link>
      </div>
    </article>
  )
}
