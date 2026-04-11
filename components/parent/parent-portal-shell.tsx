'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { ParentPortalSessionContext } from '@/components/parent/parent-portal-context'
import { ParentLinkedPlayersProvider } from '@/components/parent/parent-linked-players-context'
import { ParentPortalQuickSearch } from '@/components/parent/parent-portal-quick-search'
import { loadProfileForUser } from '@/lib/auth/load-profile'
import { guardianOperatorSlug } from '@/lib/parent/guardian-operator-slug'
import { parentNav } from '@/lib/nav/parent'
import { supabase } from '@/lib/supabase'

type PlayerRow = { first_name: string | null; last_name: string | null }

function embedOne<T>(row: T | T[] | null | undefined): T | null {
  if (row == null) return null
  return Array.isArray(row) ? (row[0] ?? null) : row
}

function formatAthleteNames(rows: { players: PlayerRow | PlayerRow[] | null }[]): string {
  const names: string[] = []
  for (const row of rows) {
    const p = embedOne<PlayerRow>(row.players)
    if (!p) continue
    const n = [p.first_name, p.last_name].filter(Boolean).join(' ').trim()
    if (n.length > 0) names.push(n)
  }
  return names.join(' · ')
}

export function ParentPortalShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<'loading' | 'ready' | 'redirect'>('loading')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [athletesSummary, setAthletesSummary] = useState('')
  const [operatorSlug, setOperatorSlug] = useState('GUARDIAN')

  useEffect(() => {
    let cancelled = false

    async function run() {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser()

      if (cancelled) return

      if (userErr || !user) {
        const next = pathname && pathname.startsWith('/parent') ? pathname : '/parent/dashboard'
        router.replace(`/login?role=parent&next=${encodeURIComponent(next)}`)
        setPhase('redirect')
        return
      }

      const { profile, error: profileErr } = await loadProfileForUser(user.id)

      if (cancelled) return

      if (profileErr || !profile) {
        router.replace(`/login?role=parent&next=${encodeURIComponent(pathname ?? '/parent/dashboard')}`)
        setPhase('redirect')
        return
      }

      const role = (profile.role ?? '').toLowerCase()
      if (role === 'staff' || role === 'admin' || role === 'coach') {
        router.replace('/staff-portal')
        setPhase('redirect')
        return
      }

      if (role !== 'parent') {
        router.replace(`/login?role=parent&next=${encodeURIComponent(pathname ?? '/parent/dashboard')}`)
        setPhase('redirect')
        return
      }

      const name = profile.full_name?.trim() || user.email?.split('@')[0] || 'Parent'
      const mail = (profile.email ?? user.email ?? '').trim()

      const { data: ppData, error: ppErr } = await supabase
        .from('parent_players')
        .select('players ( first_name, last_name )')
        .eq('parent_user_id', user.id)

      if (cancelled) return

      let summary = ''
      if (!ppErr && Array.isArray(ppData)) {
        summary = formatAthleteNames(ppData as { players: PlayerRow | PlayerRow[] | null }[])
      }

      setDisplayName(name)
      setEmail(mail)
      setAthletesSummary(summary)
      setOperatorSlug(guardianOperatorSlug(profile.full_name, mail || user.email))
      setPhase('ready')
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [router, pathname])

  if (phase === 'loading') {
    return (
      <div className="portal-brand-surface parent-os flex min-h-dvh flex-col items-center justify-center gap-3 text-formula-mist">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em]">Loading your portal…</p>
      </div>
    )
  }

  if (phase === 'redirect') {
    return (
      <div className="portal-brand-surface parent-os flex min-h-dvh flex-col items-center justify-center gap-3 text-formula-mist">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em]">Redirecting…</p>
      </div>
    )
  }

  const sessionValue = { displayName, email, athletesSummary }

  return (
    <ParentPortalSessionContext.Provider value={sessionValue}>
      <AppShell
        role="parent"
        dashboardHref="/parent/dashboard"
        logoHref="/"
        navItems={parentNav}
        operatorLine={`GUARDIAN // ${operatorSlug}`}
        operatorContextLabel="GUARDIAN PORTAL"
        surface="parent-os"
        identityName={displayName}
        identityEmail={email}
        athletesSummary={athletesSummary}
        endSessionVariant="logout-button"
        mainTop={<ParentPortalQuickSearch />}
      >
        <ParentLinkedPlayersProvider>{children}</ParentLinkedPlayersProvider>
      </AppShell>
    </ParentPortalSessionContext.Provider>
  )
}
