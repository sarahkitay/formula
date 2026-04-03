'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

/** Matches `viewBox` of `/formula-lockup.svg` for stable layout */
const SVG_RATIO = 1984 / 832

export type FormulaLogoMarkLinkProps = {
  href: string
  /** Bar height (e.g. `h-10`); width follows SVG aspect */
  className: string
  ariaLabel?: string
}

/**
 * Full Formula lockup SVG (wordmark + frame + SOCCER CENTER) in **marketing volt** `#dcff00`.
 * Asset: `public/formula-lockup.svg`
 */
export function FormulaLogoMarkLink({
  href,
  className,
  ariaLabel = 'Formula home',
}: FormulaLogoMarkLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex shrink-0 items-center bg-transparent opacity-[0.97]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22c55e]',
        className
      )}
      style={{ aspectRatio: `${SVG_RATIO} / 1`, maxWidth: '100%' }}
      aria-label={ariaLabel}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG from /public */}
      <img
        src="/formula-lockup.svg"
        alt=""
        width={1984}
        height={832}
        decoding="async"
        className="h-full w-full object-contain object-left"
        draggable={false}
      />
    </Link>
  )
}
