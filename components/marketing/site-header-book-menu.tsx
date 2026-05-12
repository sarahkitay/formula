'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { dispatchBookMenuIntentSuppress } from '@/lib/marketing/home-intent-suppression'
import { getHeaderBookMenu } from '@/lib/marketing/nav'
import { cn } from '@/lib/utils'

const triggerClass =
  'inline-flex h-9 shrink-0 items-center gap-1 border border-formula-volt/55 bg-formula-volt/95 px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-formula-base transition-[filter,box-shadow] hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-formula-volt/70 md:h-10 md:px-4 md:tracking-[0.14em]'

function BookMenuEntries({ onNavigate }: { onNavigate?: () => void }) {
  const items = getHeaderBookMenu()
  return (
    <ul className="divide-y divide-formula-frost/10 p-1" role="none">
      {items.map(item => (
        <li key={item.id} role="none">
          <Link
            href={item.href}
            onClick={onNavigate}
            className="block rounded-md px-3 py-2.5 text-left transition-colors hover:bg-formula-paper/[0.06] focus-visible:bg-formula-paper/[0.08] focus-visible:outline-none"
          >
            <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-formula-paper">{item.label}</span>
            <span className="mt-1.5 block text-[11px] leading-snug text-formula-frost/78">{item.steps}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

/** Desktop: hover / focus-within. Mobile & coarse pointers: tap toggles overlay panel. */
export function SiteHeaderBookMenu() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const desktopBookRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dispatchBookMenuIntentSuppress(mobileOpen)
  }, [mobileOpen])

  useEffect(() => {
    const el = desktopBookRef.current
    if (!el) return
    const onFocusIn = () => dispatchBookMenuIntentSuppress(true)
    const onFocusOut = (e: FocusEvent) => {
      const next = e.relatedTarget as Node | null
      if (!next || !el.contains(next)) dispatchBookMenuIntentSuppress(false)
    }
    el.addEventListener('focusin', onFocusIn)
    el.addEventListener('focusout', onFocusOut)
    return () => {
      el.removeEventListener('focusin', onFocusIn)
      el.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    dispatchBookMenuIntentSuppress(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  return (
    <>
      {/* md+: hover / focus-within – pt-2 is an invisible “bridge” under the button so the cursor can reach the panel without leaving the group (no mt gap). */}
      <div
        ref={desktopBookRef}
        className="group relative hidden md:block"
        onMouseEnter={() => dispatchBookMenuIntentSuppress(true)}
        onMouseLeave={() => dispatchBookMenuIntentSuppress(false)}
      >
        <button type="button" className={cn(triggerClass)} aria-haspopup="true" aria-expanded={false}>
          Book
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-85" strokeWidth={2} aria-hidden />
        </button>
        <div
          className={cn(
            'invisible absolute right-0 top-full z-[90] w-[min(22.5rem,calc(100vw-2.5rem))] pt-2 opacity-0 transition-[opacity,visibility] duration-150',
            'pointer-events-none group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100',
            'group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:opacity-100'
          )}
        >
          <div
            className={cn(
              'translate-y-0.5 rounded-lg border border-formula-frost/18 bg-formula-deep/98 py-1 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-transform duration-150',
              'group-hover:translate-y-0 group-focus-within:translate-y-0'
            )}
            role="menu"
            aria-label="Book a service"
          >
            <p className="border-b border-formula-frost/10 px-3 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-formula-mist">
              Choose a path · waiver or RSVP when asked · pay at checkout
            </p>
            <BookMenuEntries />
          </div>
        </div>
      </div>

      {/* Small screens: tap Book */}
      <div className="relative md:hidden">
        <button
          type="button"
          className={triggerClass}
          aria-expanded={mobileOpen}
          aria-haspopup="true"
          aria-controls="site-header-book-menu-mobile"
          onClick={() => setMobileOpen(v => !v)}
        >
          Book
          <ChevronDown
            className={cn('h-3.5 w-3.5 shrink-0 opacity-85 transition-transform', mobileOpen && 'rotate-180')}
            strokeWidth={2}
            aria-hidden
          />
        </button>

        {mobileOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-[75] bg-formula-base/55 backdrop-blur-[2px]"
              aria-label="Close book menu"
              onClick={() => setMobileOpen(false)}
            />
            <div
              id="site-header-book-menu-mobile"
              role="menu"
              aria-label="Book a service"
              className="fixed left-3 right-3 top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-[85] max-h-[min(72dvh,calc(100dvh-5rem))] overflow-y-auto overscroll-contain rounded-lg border border-formula-frost/18 bg-formula-deep/98 py-1 shadow-2xl backdrop-blur-xl"
            >
              <p className="sticky top-0 z-[1] border-b border-formula-frost/10 bg-formula-deep/95 px-3 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-formula-mist backdrop-blur-sm">
                Choose a path · waiver or RSVP when asked · pay at checkout
              </p>
              <BookMenuEntries onNavigate={() => setMobileOpen(false)} />
            </div>
          </>
        ) : null}
      </div>
    </>
  )
}
