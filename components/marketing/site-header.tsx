'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { FormulaLogoMarkLink } from '@/components/shared/formula-logo-mark'
import { HEADER_MAIN } from '@/lib/marketing/nav'

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
          aria-label="Primary"
        >
          {HEADER_MAIN.map(item => (
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
