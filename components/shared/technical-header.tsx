'use client'

import Link from 'next/link'
import { LogoutButton } from '@/components/auth/logout-button'
import { FormulaLogoMarkLink } from '@/components/shared/formula-logo-mark'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export interface TechnicalNavItem {
  label: string
  href: string
  /** Path prefixes that belong to this nav section (admin select); longest prefix wins. */
  sectionPaths?: readonly string[]
}

export interface TechnicalHeaderProps {
  operatorContextLabel?: string
  operatorLine: string
  navItems: TechnicalNavItem[]
  /** Root dashboard href: exact match for active state on the primary nav item */
  homeHref: string
  /** Logo link; defaults to `homeHref` (parent portal often uses `/` to return to the marketing site) */
  logoHref?: string
  /** Optional sign-out target when endSessionVariant is login-link */
  signOutHref?: string
  /** After logout-button sign-out (default `/login`) */
  logoutRedirectTo?: string
  /** Admin facility OS: dark chrome */
  variant?: 'light' | 'dark'
  /** Readable name (parent / staff demo) */
  identityName?: string
  identityEmail?: string
  /** Parent: linked athletes */
  athletesSummary?: string
  endSessionVariant?: 'login-link' | 'logout-button'
  /** Shown in a slim row below primary nav (e.g. facility street address). */
  addressLine?: string
  /** When set with `addressLine`, the row becomes a link (e.g. Apple Maps). */
  addressHref?: string
  /** `scroll` keeps one horizontal row (overflow scroll); `wrap` allows wrapping. */
  navOverflow?: 'wrap' | 'scroll'
  /** `select` = one compact dropdown (admin); `tabs` = link row (default). */
  primaryNavPresentation?: 'tabs' | 'select'
}

function pathWithoutHash(href: string): string {
  const i = href.indexOf('#')
  return i === -1 ? href : href.slice(0, i)
}

function navItemActive(pathname: string | null, href: string, homeHref: string): boolean {
  if (!pathname) return false
  const base = pathWithoutHash(href)
  const home = pathWithoutHash(homeHref)
  if (base === home) return pathname === home
  return pathname === base || pathname.startsWith(`${base}/`)
}

function candidateBases(item: TechnicalNavItem): string[] {
  const out: string[] = [pathWithoutHash(item.href)]
  for (const p of item.sectionPaths ?? []) {
    out.push(pathWithoutHash(p))
  }
  return out
}

/** Longest-prefix match among primary nav items; returns whether any section matched. */
function primaryNavSelectState(
  pathname: string | null,
  items: TechnicalNavItem[],
  homeHref: string
): { valueHref: string; showDeepHint: boolean } {
  if (!pathname || !pathname.startsWith('/admin')) {
    return { valueHref: homeHref, showDeepHint: false }
  }
  let bestLen = -1
  let bestItemHref = ''
  for (const item of items) {
    for (const base of candidateBases(item)) {
      if (!base) continue
      if (pathname === base || pathname.startsWith(`${base}/`)) {
        if (base.length > bestLen) {
          bestLen = base.length
          bestItemHref = item.href
        }
      }
    }
  }
  if (bestLen >= 0) {
    return { valueHref: bestItemHref, showDeepHint: false }
  }
  return { valueHref: homeHref, showDeepHint: true }
}

export function TechnicalHeader({
  operatorContextLabel = 'OPERATOR_CONTEXT',
  operatorLine,
  navItems,
  homeHref,
  logoHref: logoHrefProp,
  signOutHref = '/login',
  logoutRedirectTo = '/login',
  variant = 'light',
  identityName,
  identityEmail,
  athletesSummary,
  endSessionVariant = 'login-link',
  addressLine,
  addressHref,
  navOverflow = 'wrap',
  primaryNavPresentation = 'tabs',
}: TechnicalHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const logoHref = logoHrefProp ?? homeHref
  const dark = variant === 'dark'
  const showIdentity = Boolean(identityName?.trim() || identityEmail?.trim())
  const matchedPrimary = primaryNavSelectState(pathname, navItems, homeHref)
  const onDeepAdminPage =
    primaryNavPresentation === 'select' &&
    Boolean(pathname?.startsWith('/admin/')) &&
    matchedPrimary.showDeepHint

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
            href={logoHref}
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
                redirectTo={logoutRedirectTo}
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
            '-mx-6 flex gap-0 border-t px-6',
            primaryNavPresentation === 'select'
              ? 'flex-col items-stretch gap-2 py-3 sm:flex-row sm:items-center sm:gap-4 sm:py-2.5'
              : navOverflow === 'scroll'
                ? 'flex-nowrap overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
                : 'flex-wrap overflow-x-auto',
            dark ? 'border-formula-frost/10' : 'border-black'
          )}
        >
          {primaryNavPresentation === 'select' ? (
            <>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                <label
                  htmlFor="portal-primary-nav"
                  className={cn(
                    'shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.18em]',
                    dark ? 'text-formula-mist' : 'text-zinc-500'
                  )}
                >
                  Section
                </label>
                <select
                  id="portal-primary-nav"
                  className={cn(
                    'min-h-10 w-full min-w-0 max-w-xl rounded border px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-tight sm:max-w-md',
                    dark
                      ? 'border-formula-frost/22 bg-formula-base/55 text-formula-paper focus:border-formula-volt/45 focus:outline-none'
                      : 'border-black/15 bg-white text-[#1a1a1a] focus:border-[#005700]/50 focus:outline-none'
                  )}
                  aria-label="Jump to admin section"
                  value={matchedPrimary.valueHref}
                  onChange={e => {
                    const next = e.target.value
                    if (next) router.push(next)
                  }}
                >
                  {navItems.map(item => (
                    <option key={item.href} value={item.href}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              {onDeepAdminPage ? (
                <p
                  className={cn(
                    'max-w-xl font-mono text-[10px] leading-snug sm:ml-auto sm:max-w-xs sm:text-right',
                    dark ? 'text-formula-mist' : 'text-zinc-500'
                  )}
                >
                  This screen is not a top-level tab. Use header search or Modules for the full directory.
                </p>
              ) : null}
            </>
          ) : (
            navItems.map(item => {
              const active = navItemActive(pathname, item.href, homeHref)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'border-r py-2.5 text-[11px] font-bold uppercase tracking-tight transition-colors last:border-r-0',
                    navOverflow === 'scroll' ? 'shrink-0 whitespace-nowrap px-3 sm:px-3.5' : 'px-4',
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
            })
          )}
        </nav>
        {addressLine?.trim() ? (
          <div
            className={cn(
              '-mx-6 border-t px-6 py-2 text-center font-mono text-[10px] font-medium uppercase leading-snug tracking-[0.14em]',
              dark ? 'border-formula-frost/10 text-formula-mist' : 'border-black/10 text-zinc-500'
            )}
          >
            {addressHref?.trim() ? (
              <a
                href={addressHref.trim()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${addressLine.trim()} in Apple Maps`}
                className={cn(
                  'normal-case tracking-normal underline-offset-2 transition-colors hover:underline',
                  dark ? 'text-formula-frost/90 hover:text-formula-volt' : 'text-zinc-600 hover:text-[#005700]'
                )}
              >
                {addressLine.trim()}
              </a>
            ) : (
              <span className="normal-case tracking-normal">{addressLine.trim()}</span>
            )}
          </div>
        ) : null}
      </div>
    </header>
  )
}
