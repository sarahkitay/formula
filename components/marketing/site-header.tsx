'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FormulaLogoMarkLink } from '@/components/shared/formula-logo-mark'
import { HEADER_MAIN, HEADER_MORE, HOME_ANCHORS } from '@/lib/marketing/nav'

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
  const isHome = pathname === '/' || pathname === ''

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-formula-frost/10 bg-formula-deep/55 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex h-14 items-center gap-4 md:h-16">
          <FormulaLogoMarkLink
            href="/"
            className="h-10 max-h-10 max-w-[min(18rem,70vw)] no-underline md:h-12 md:max-h-12"
          />

          <nav className="hidden min-w-0 flex-1 items-center gap-x-5 overflow-x-auto py-1 md:flex lg:gap-x-6" aria-label="Primary">
            {HEADER_MAIN.map(item => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
            <details className="group relative">
              <summary className="cursor-pointer list-none font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-formula-mist marker:text-transparent hover:text-formula-paper [&::-webkit-details-marker]:hidden">
                More
              </summary>
              <div className="absolute left-0 top-full z-50 mt-2 w-[min(100vw-2rem,280px)] border border-formula-frost/12 bg-formula-base/95 p-2 py-3 shadow-2xl backdrop-blur-xl">
                <ul className="flex flex-col gap-1">
                  {HEADER_MORE.map(item => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block rounded-sm px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist hover:bg-formula-paper/[0.05] hover:text-formula-paper"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </nav>

          <Link
            href="/login?role=parent"
            className="ml-auto shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-volt transition-opacity hover:opacity-90"
          >
            Parent portal
          </Link>
        </div>

        <nav
          className="-mx-5 flex gap-4 overflow-x-auto border-t border-formula-frost/8 px-5 py-2.5 md:hidden"
          aria-label={isHome ? 'On this page' : 'Quick links'}
        >
          {isHome
            ? HOME_ANCHORS.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  className="shrink-0 whitespace-nowrap font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-formula-mist"
                >
                  {item.label}
                </a>
              ))
            : HEADER_MAIN.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 whitespace-nowrap font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-formula-mist"
                >
                  {item.label}
                </Link>
              ))}
        </nav>
      </div>
    </header>
  )
}
