'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FormulaLogoMarkLink } from '@/components/shared/formula-logo-mark'
import { getSiteHeaderPrimaryNav, MARKETING_HREF } from '@/lib/marketing/nav'
import { SITE } from '@/lib/site-config'
import { cn } from '@/lib/utils'

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="shrink-0 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-formula-mist transition-colors hover:text-formula-paper"
    >
      {children}
    </Link>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const showFacilityAddress =
    pathname === '/' ||
    pathname === '/book-assessment' ||
    pathname?.startsWith('/book-assessment/')

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-formula-frost/10 bg-formula-deep/55 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex h-14 items-center gap-4 md:h-16">
          <FormulaLogoMarkLink
            href="/"
            className="h-10 max-h-10 max-w-[min(18rem,70vw)] no-underline md:h-12 md:max-h-12"
          />

          <nav className="hidden min-w-0 flex-1 items-center gap-x-5 overflow-x-auto py-1 md:flex lg:gap-x-6" aria-label="Primary">
            {getSiteHeaderPrimaryNav().map(item => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-3 md:gap-4">
            <Link
              href={MARKETING_HREF.bookAssessmentPortal}
              className="inline-flex h-9 items-center border border-formula-volt/55 bg-formula-volt/95 px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-formula-base transition-[filter] hover:brightness-105 md:h-10 md:px-4 md:tracking-[0.14em]"
            >
              Book
            </Link>
            <Link
              href="/login?role=parent"
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-volt transition-opacity hover:opacity-90"
            >
              Parent portal
            </Link>
          </div>
        </div>

        {showFacilityAddress ? (
          <p
            className={cn(
              '-mx-5 border-t border-formula-frost/10 px-5 py-2 text-center font-mono text-[10px] font-medium leading-snug tracking-wide text-formula-mist md:-mx-8 md:px-8'
            )}
          >
            {SITE.facilityAddressLine}
          </p>
        ) : null}

        <nav
          className="-mx-5 flex gap-4 overflow-x-auto border-t border-formula-frost/8 px-5 py-2.5 md:hidden"
          aria-label="Primary"
        >
          {getSiteHeaderPrimaryNav().map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 whitespace-nowrap font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-formula-mist transition-colors hover:text-formula-paper"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
