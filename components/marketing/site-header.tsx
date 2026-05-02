'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { SiteSearchModal } from '@/components/marketing/site-search-modal'
import { FormulaLogoMarkLink } from '@/components/shared/formula-logo-mark'
import { getSiteHeaderPrimaryNav, MARKETING_HREF } from '@/lib/marketing/nav'
import { FACILITY_APPLE_MAPS_URL, SITE } from '@/lib/site-config'

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

/** `key={pathname}` on this subtree resets open state on navigation without an effect. */
function SiteHeaderMobileNav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded border border-formula-frost/20 text-formula-paper transition-colors hover:border-formula-frost/40 hover:bg-formula-frost/5 md:hidden"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="site-header-mobile-nav"
        onClick={() => setOpen(v => !v)}
      >
        {open ? <X className="h-4 w-4" strokeWidth={1.75} /> : <Menu className="h-4 w-4" strokeWidth={1.75} />}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <button
            type="button"
            className="absolute inset-0 bg-formula-base/70 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav
            id="site-header-mobile-nav"
            className="absolute right-0 top-0 flex h-full w-[min(100%,18rem)] flex-col gap-1 border-l border-formula-frost/15 bg-formula-deep/98 px-4 pb-6 pt-16 shadow-2xl"
            aria-label="Primary"
          >
            {getSiteHeaderPrimaryNav().map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-formula-paper transition-colors hover:bg-formula-frost/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const showFacilityAddress =
    pathname === '/' ||
    pathname === '/book-assessment' ||
    pathname?.startsWith('/book-assessment/')
  const showHomePhone = pathname === '/'

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-formula-frost/10 bg-formula-deep/55 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex h-14 items-center gap-3 md:h-16 md:gap-4">
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

          <div className="ml-auto flex shrink-0 items-center gap-1.5 md:gap-3 lg:gap-4">
            <SiteHeaderMobileNav key={pathname} />
            <SiteSearchModal />
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

        {showHomePhone ? (
          <p className="-mx-5 border-t border-formula-frost/10 px-5 py-2 text-center md:-mx-8 md:px-8">
            <a
              href={`tel:${SITE.publicPhoneTel}`}
              className="font-mono text-[11px] font-medium tracking-[0.12em] text-formula-mist underline-offset-2 transition-colors hover:text-formula-volt hover:underline"
            >
              {SITE.publicPhoneDisplay}
            </a>
          </p>
        ) : null}

        {showFacilityAddress ? (
          <p className="-mx-5 border-t border-formula-frost/10 px-5 py-2 text-center md:-mx-8 md:px-8">
            <a
              href={FACILITY_APPLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${SITE.facilityAddressLine} in Apple Maps`}
              className="font-mono text-[10px] font-medium leading-snug tracking-wide text-formula-mist underline-offset-2 transition-colors hover:text-formula-volt hover:underline"
            >
              {SITE.facilityAddressLine}
            </a>
          </p>
        ) : null}
      </div>
    </header>
  )
}
