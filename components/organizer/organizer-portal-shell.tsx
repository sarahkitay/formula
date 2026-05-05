'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { loadProfileForUser } from '@/lib/auth/load-profile'
import { getPortalRoute } from '@/lib/getPortalRoute'
import { supabase } from '@/lib/supabase'
import { FACILITY_APPLE_MAPS_URL, SITE } from '@/lib/site-config'
import type { NavItem } from '@/lib/nav/types'

const organizerNav: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/organizer/dashboard',
    icon: 'LayoutDashboard',
    description: 'Roster links · waiver progress',
    gridStatus: 'neutral',
  },
]

export function OrganizerPortalShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<'loading' | 'ready' | 'redirect'>('loading')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    let cancelled = false

    async function run() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (cancelled) return
      if (!user?.email) {
        router.replace(`/login?role=organizer&next=${encodeURIComponent(pathname ?? '/organizer/dashboard')}`)
        setPhase('redirect')
        return
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) {
        router.replace('/login?role=organizer')
        setPhase('redirect')
        return
      }

      const res = await fetch('/api/organizer/waiver-invites', { headers: { Authorization: `Bearer ${token}` } })
      const body = (await res.json()) as { invites?: unknown[] }
      if (cancelled) return
      if (!res.ok || !Array.isArray(body.invites)) {
        router.replace('/login?role=organizer')
        setPhase('redirect')
        return
      }

      const { profile } = await loadProfileForUser(user.id)
      if (cancelled) return

      const rn = (profile?.role ?? '').toLowerCase()
      if (rn === 'coach' || rn === 'staff' || rn === 'admin') {
        router.replace(getPortalRoute(profile?.role))
        setPhase('redirect')
        return
      }

      if (body.invites.length === 0) {
        if (rn === 'organizer') {
          await supabase.auth.signOut()
          router.replace('/login?role=organizer&error=no-rentals')
        } else {
          router.replace('/parent/dashboard')
        }
        setPhase('redirect')
        return
      }

      setDisplayName(profile?.full_name?.trim() || user.email?.split('@')[0] || 'Organizer')
      setEmail((profile?.email ?? user.email ?? '').trim())
      setPhase('ready')
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [router, pathname])

  if (phase === 'loading' || phase === 'redirect') {
    return (
      <div className="portal-brand-surface parent-os flex min-h-dvh flex-col items-center justify-center gap-3 text-formula-mist">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em]">{phase === 'redirect' ? 'Redirecting…' : 'Loading…'}</p>
      </div>
    )
  }

  return (
    <AppShell
      role="parent"
      dashboardHref="/organizer/dashboard"
      logoHref="/"
      navItems={organizerNav}
      operatorLine={`RENTER // ${(email.split('@')[0] || 'ORGANIZER').toUpperCase()}`}
      operatorContextLabel="FIELD RENTAL"
      surface="parent-os"
      identityName={displayName}
      identityEmail={email}
      endSessionVariant="logout-button"
      logoutRedirectTo="/login?role=organizer"
      facilityAddressLine={SITE.facilityAddressLine}
      facilityAddressHref={FACILITY_APPLE_MAPS_URL}
    >
      {children}
    </AppShell>
  )
}
