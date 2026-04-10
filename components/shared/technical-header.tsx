'use client'

import Link from 'next/link'
import { LogoutButton } from '@/components/auth/logout-button'
import { FormulaLogoMarkLink } from '@/components/shared/formula-logo-mark'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export interface TechnicalNavItem {
  label: string
  href: string
}

export interface TechnicalHeaderProps {
  operatorContextLabel?: string
  operatorLine: string
  navItems: TechnicalNavItem[]
  /** Root dashboard href: exact match for active state and logo link */
  homeHref: string
  /** Optional sign-out target when endSessionVariant is login-link */
  signOutHref?: string
  /** Admin facility OS: dark chrome */
  variant?: 'light' | 'dark'
  /** Readable name (parent / staff demo) */
  identityName?: string
  identityEmail?: string
  /** Parent: linked athletes */
  athletesSummary?: string
  endSessionVariant?: 'login-link' | 'logout-button'
}

function navItemActive(pathname: string | null, href: string, homeHref: string): boolean {
  if (!pathname) return false
  if (href === homeHref) return pathname === homeHref
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function TechnicalHeader({
  operatorContextLabel = 'OPERATOR_CONTEXT',
  operatorLine,
  navItems,
  homeHref,
  signOutHref = '/login',
  variant = 'light',
  identityName,
  identityEmail,
  athletesSummary,
  endSessionVariant = 'login-link',
}: TechnicalHeaderProps) {
  const pathname = usePathname()
  const dark = variant === 'dark'
  const showIdentity = Boolean(identityName?.trim() || identityEmail?.trim())

  return (
    <header
      className={cn(
        'w-full border-b font-mono',
        dark ? 'border-formula-frost/10 bg-formula-deep/55 backdrop-blur-xl' : 'border-black/10 bg-white'
      )}
    >
      <div className="mx-auto max-w-[1600px] px-6 pb-0 pt-6">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <FormulaLogoMarkLink
            href={homeHref}
            className="h-10 max-h-10 max-w-[min(100%,20rem)] sm:h-12 sm:max-h-12"
          />
          <div className="text-left sm:text-right">
            <div
              className={cn(
                'text-xs font-bold uppercase tracking-tight',
                dark ? 'text-formula-mist' : 'text-zinc-400'
              )}
            >
              {operatorContextLabel}
            </div>
            <div
              className={cn(
                'text-sm font-bold uppercase tracking-tight',
                dark ? 'text-formula-paper' : 'text-[#1a1a1a]'
              )}
            >
              {operatorLine}
            </div>
            {showIdentity ? (
              <div className="mt-2 space-y-0.5 text-left sm:text-right">
                {identityName?.trim() ? (
                  <p
                    className={cn(
                      'text-sm font-semibold normal-case tracking-normal',
                      dark ? 'text-formula-paper' : 'text-[#1a1a1a]'
                    )}
                  >
                    {identityName.trim()}
                  </p>
                ) : null}
                {identityEmail?.trim() ? (
                  <p
                    className={cn(
                      'text-[11px] font-normal normal-case tracking-normal',
                      dark ? 'text-formula-mist' : 'text-zinc-500'
                    )}
                  >
                    {identityEmail.trim()}
                  </p>
                ) : null}
                {athletesSummary?.trim() ? (
                  <p
                    className={cn(
                      'pt-1 text-[10px] font-medium uppercase leading-snug tracking-[0.12em]',
                      dark ? 'text-formula-frost/80' : 'text-zinc-500'
                    )}
                  >
                    Athletes ·{' '}
                    <span
                      className={cn('normal-case tracking-normal', dark ? 'text-formula-frost/90' : 'text-zinc-700')}
                    >
                      {athletesSummary.trim()}
                    </span>
                  </p>
                ) : null}
              </div>
            ) : null}
            {endSessionVariant === 'logout-button' ? (
              <LogoutButton
                label="End session"
                className={cn(
                  'mt-3 border-transparent bg-transparent p-0 font-mono text-[10px] font-bold uppercase tracking-wider underline underline-offset-2',
                  dark
                    ? 'text-formula-mist decoration-formula-frost/25 hover:border-transparent hover:bg-transparent hover:text-formula-volt'
                    : 'text-zinc-400 decoration-black/20 hover:text-[#005700]'
                )}
              />
            ) : (
              <Link
                href={signOutHref}
                className={cn(
                  'mt-2 inline-block text-[10px] font-bold uppercase tracking-wider underline underline-offset-2',
                  dark
                    ? 'text-formula-mist decoration-formula-frost/25 hover:text-formula-volt'
                    : 'text-zinc-400 decoration-black/20 hover:text-[#005700]'
                )}
              >
                End session
              </Link>
            )}
          </div>
        </div>

        <nav
          className={cn(
            '-mx-6 flex flex-wrap gap-0 overflow-x-auto border-t px-6',
            dark ? 'border-formula-frost/10' : 'border-black'
          )}
        >
          {navItems.map(item => {
            const active = navItemActive(pathname, item.href, homeHref)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'border-r px-4 py-2.5 text-[11px] font-bold uppercase tracking-tight transition-colors last:border-r-0',
                  dark ? 'border-formula-frost/10' : 'border-black/5',
                  active
                    ? dark
                      ? 'bg-formula-deep/90 text-formula-paper shadow-[inset_0_-1px_0_0_rgb(220_255_0_/_0.2)]'
                      : 'bg-[#005700] text-white'
                    : dark
                      ? 'text-formula-mist hover:bg-formula-paper/[0.06] hover:text-formula-paper'
                      : 'text-[#1a1a1a] hover:bg-black hover:text-white'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
