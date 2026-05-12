'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, Search, X } from 'lucide-react'
import { SiteSearchModal, SiteSearchOpenButton } from '@/components/marketing/site-search-modal'
import { SiteHeaderBookMenu } from '@/components/marketing/site-header-book-menu'
import { FormulaLogoMarkLink } from '@/components/shared/formula-logo-mark'
import { getSiteHeaderPrimaryNav } from '@/lib/marketing/nav'
import { FACILITY_APPLE_MAPS_URL, SITE } from '@/lib/site-config'
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

/** `key={pathname}` on this subtree resets open state on navigation without an effect. */
function SiteHeaderMobileNav({ onOpenSiteSearch }: { onOpenSiteSearch: () => void }) {
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
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded border border-formula-frost/20 text-formula-paper transition-colors hover:border-formula-frost/40 hover:bg-formula-frost/5 md:hidden"
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
            className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col gap-0.5 border-l border-formula-frost/15 bg-[var(--color-formula-deep)] px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(4.25rem,env(safe-area-inset-top,0px)+3.25rem)] shadow-2xl sm:px-4"
            aria-label="Primary"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                queueMicrotask(() => onOpenSiteSearch())
              }}
              className="flex min-h-12 items-center gap-2 rounded-md px-3 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-formula-paper transition-colors hover:bg-formula-frost/10 active:bg-formula-frost/15"
            >
              <Search className="h-4 w-4 shrink-0 text-formula-volt/90" aria-hidden />
              Search
            </button>
            {getSiteHeaderPrimaryNav().map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center rounded-md px-3 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-formula-paper transition-colors hover:bg-formula-frost/10 active:bg-formula-frost/15"
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
  const [searchOpen, setSearchOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const contactWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setContactOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!contactOpen) return
    const onDoc = (e: MouseEvent) => {
      const el = contactWrapRef.current
      if (el && !el.contains(e.target as Node)) setContactOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContactOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [contactOpen])

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
            <SiteHeaderMobileNav key={pathname} onOpenSiteSearch={() => setSearchOpen(true)} />
            <SiteSearchModal open={searchOpen} onOpenChange={setSearchOpen} hideTrigger />
            <SiteSearchOpenButton
              className="hidden md:inline-flex"
              open={searchOpen}
              onOpen={() => setSearchOpen(true)}
            />
            <SiteHeaderBookMenu />
            <Link
              href="/login?role=parent"
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-volt transition-opacity hover:opacity-90"
            >
              Parent portal
            </Link>
          </div>
        </div>

        <div ref={contactWrapRef} className="-mx-5 border-t border-formula-frost/10 md:-mx-8">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 py-3 text-center font-mono text-sm font-semibold uppercase tracking-[0.18em] text-formula-paper transition-colors hover:bg-formula-paper/[0.04] md:text-[15px] md:tracking-[0.16em]"
            aria-expanded={contactOpen}
            aria-controls="site-header-contact-panel"
            id="site-header-contact-trigger"
            onClick={() => setContactOpen(v => !v)}
          >
            Contact
            <ChevronDown
              className={cn('h-4 w-4 shrink-0 text-formula-volt/90 transition-transform duration-200', contactOpen && 'rotate-180')}
              strokeWidth={2}
              aria-hidden
            />
          </button>

          {contactOpen ? (
            <div
              id="site-header-contact-panel"
              role="region"
              aria-labelledby="site-header-contact-trigger"
              className="border-t border-formula-frost/10 bg-formula-deep/80 px-5 pb-6 pt-1 md:px-8"
            >
              <div className="mx-auto flex max-w-2xl flex-col gap-5 pt-4">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Call</p>
                  <a
                    href={`tel:${SITE.publicPhoneTel}`}
                    className="mt-1.5 block text-[15px] font-medium leading-snug text-formula-paper underline-offset-2 transition-colors hover:text-formula-volt hover:underline md:text-base"
                  >
                    {SITE.publicPhoneDisplay}
                  </a>
                </div>
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Email</p>
                  <a
                    href={`mailto:${SITE.publicContactEmail}`}
                    className="mt-1.5 block text-[15px] font-medium leading-snug text-formula-paper underline-offset-2 transition-colors hover:text-formula-volt hover:underline md:text-base"
                  >
                    {SITE.publicContactEmail}
                  </a>
                </div>
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Address</p>
                  <a
                    href={FACILITY_APPLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 block text-[15px] font-medium leading-snug text-formula-paper underline-offset-2 transition-colors hover:text-formula-volt hover:underline md:text-base"
                    aria-label={`Open ${SITE.facilityAddressLine} in Apple Maps`}
                  >
                    {SITE.facilityAddressLine}
                  </a>
                </div>
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Social</p>
                  <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
                    <a
                      href={SITE.publicInstagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[15px] font-medium leading-snug text-formula-paper underline-offset-2 transition-colors hover:text-formula-volt hover:underline md:text-base"
                    >
                      Instagram
                    </a>
                    <a
                      href={SITE.publicFacebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[15px] font-medium leading-snug text-formula-paper underline-offset-2 transition-colors hover:text-formula-volt hover:underline md:text-base"
                    >
                      Facebook
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
