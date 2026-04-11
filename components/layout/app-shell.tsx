'use client'

import * as React from 'react'
import { TechnicalHeader } from '@/components/shared/technical-header'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/lib/nav/types'

export interface AppShellProps {
  children: React.ReactNode
  role: 'admin' | 'coach' | 'parent'
  dashboardHref: string
  navItems: NavItem[]
  /** Shown in header, e.g. FRONT_DESK // ROY */
  operatorLine: string
  operatorContextLabel?: string
  /** Facility OS: dark control surface + inverted header */
  surface?: 'default' | 'admin-os' | 'coach-os' | 'parent-os'
  /** Parent portal: readable name under operator slug */
  identityName?: string
  identityEmail?: string
  /** Parent portal: linked athletes, e.g. "Alex M. · Jordan M." */
  athletesSummary?: string
  /** Parent: real Supabase sign-out vs marketing link to /login */
  endSessionVariant?: 'login-link' | 'logout-button'
  /** Header logo destination (parent portal: public site `/`) */
  logoHref?: string
  /** Rendered at top of `<main>` (e.g. parent portal quick search) */
  mainTop?: React.ReactNode
}

export function AppShell({
  children,
  dashboardHref,
  navItems,
  operatorLine,
  operatorContextLabel,
  surface = 'default',
  identityName,
  identityEmail,
  athletesSummary,
  endSessionVariant = 'login-link',
  logoHref,
  mainTop,
}: AppShellProps) {
  const technicalNav = navItems.map(item => ({ label: item.label, href: item.href }))
  const isDarkOs = surface === 'admin-os' || surface === 'coach-os' || surface === 'parent-os'
  const osClass =
    surface === 'coach-os' ? 'coach-os' : surface === 'parent-os' ? 'parent-os' : surface === 'admin-os' ? 'admin-os' : ''

  return (
    <div
      className={cn(
        'flex min-h-screen flex-col',
        isDarkOs && cn(osClass, 'portal-brand-surface text-formula-paper'),
        !isDarkOs && 'bg-background text-[#1a1a1a]'
      )}
    >
      <TechnicalHeader
        navItems={technicalNav}
        homeHref={dashboardHref}
        logoHref={logoHref}
        operatorLine={operatorLine}
        operatorContextLabel={operatorContextLabel}
        variant={isDarkOs ? 'dark' : 'light'}
        identityName={identityName}
        identityEmail={identityEmail}
        athletesSummary={athletesSummary}
        endSessionVariant={endSessionVariant}
      />
      <main className="lab-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-10">
        {mainTop}
        {children}
      </main>
    </div>
  )
}

export function PageContainer({
  children,
  className,
  fullWidth,
}: {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}) {
  return (
    <div className={cn('mx-auto w-full', fullWidth ? 'max-w-[1600px]' : 'max-w-[1400px]', className)}>
      {children}
    </div>
  )
}
