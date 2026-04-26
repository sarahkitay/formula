'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { loadProfileForUser } from '@/lib/auth/load-profile'
import { getPortalRoute } from '@/lib/getPortalRoute'
import { supabase } from '@/lib/supabase'

/**
 * Legacy/auth entry: parents go straight to the full AppShell dashboard.
 * This route remains valid for bookmarks and older links.
 */
export default function ParentPortalRedirectPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser()

      if (cancelled) return

      if (userErr || !user) {
        router.replace('/login?role=parent')
        return
      }

      const { profile: p, error: profileErr } = await loadProfileForUser(user.id)

      if (cancelled) return

      if (profileErr || !p) {
        setError(profileErr?.message ?? 'No profile found for this account.')
        return
      }

      const hub = getPortalRoute(p.role)

      if (hub === '/staff-portal' || hub === '/admin/dashboard' || hub === '/coach/today') {
        router.replace(hub)
        return
      }

      if (hub === '/login' || p.role?.toLowerCase() !== 'parent') {
        setError('This account is not set up as a parent.')
        return
      }

      router.replace('/parent/dashboard')
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [router])

  if (error) {
    return (
      <div className="portal-brand-surface admin-os flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center text-formula-paper">
        <p className="max-w-md text-formula-frost/90">{error}</p>
        <Link
          href="/login"
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt hover:opacity-90"
        >
          Back to sign in →
        </Link>
      </div>
    )
  }

  return (
    <div className="portal-brand-surface admin-os flex min-h-dvh flex-col items-center justify-center gap-3 text-formula-mist">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em]">Opening your dashboard…</p>
    </div>
  )
}
