'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogoutButton } from '@/components/auth/logout-button'
import { loadProfileForUser, staffDashboardHref } from '@/lib/auth/load-profile'
import { getPortalRoute } from '@/lib/getPortalRoute'
import { supabase } from '@/lib/supabase'
import type { ProfileRow } from '@/types/profile'
import type { PlayerRow } from '@/types/players'

export default function StaffPortalHubPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [players, setPlayers] = useState<PlayerRow[]>([])
  const [playersError, setPlayersError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser()

      if (cancelled) return

      if (userErr || !user) {
        router.replace('/login')
        return
      }

      const { profile: p, error: profileErr } = await loadProfileForUser(user.id)
      if (cancelled) return

      if (profileErr || !p) {
        setPhase('error')
        setError(profileErr?.message ?? 'No profile found for this account.')
        return
      }

      const hub = getPortalRoute(p.role)
      if (hub === '/parent-portal') {
        router.replace('/parent-portal')
        return
      }
      if (hub !== '/staff-portal') {
        setPhase('error')
        setError('This account is not set up for staff access.')
        return
      }

      setProfile(p)

      const { data: roster, error: rosterErr } = await supabase
        .from('players')
        .select('id, first_name, last_name, age_group, created_at')
        .order('created_at', { ascending: false })

      if (cancelled) return

      if (rosterErr) {
        setPlayers([])
        setPlayersError(rosterErr.message)
      } else {
        setPlayers((roster as PlayerRow[]) ?? [])
        setPlayersError(null)
      }

      setPhase('ready')
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [router])

  if (phase === 'error') {
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

  if (phase === 'loading' || !profile) {
    return (
      <div className="portal-brand-surface admin-os flex min-h-dvh flex-col items-center justify-center gap-3 text-formula-mist">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em]">Loading staff portal…</p>
      </div>
    )
  }

  const dashHref = staffDashboardHref(profile.role)
  const roleLabel = profile.role === 'coach' ? 'Coach' : profile.role === 'admin' ? 'Admin' : 'Staff'

  return (
    <div className="portal-brand-surface admin-os min-h-dvh text-formula-paper">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-formula-frost/10 px-6 py-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-formula-mist">Staff portal</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-formula-paper">{roleLabel} roster</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={dashHref}
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-volt hover:opacity-90"
          >
            Full dashboard →
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
        <section className="border border-formula-frost/15 bg-formula-paper/[0.03] p-6">
          <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Players</h2>
          {playersError ? (
            <p className="mt-4 text-sm text-amber-200/90">
              Could not load players ({playersError}). If the table is missing, run <code className="text-formula-volt">supabase/parent_players_players.sql</code>{' '}
              and confirm RLS allows your role.
            </p>
          ) : players.length === 0 ? (
            <p className="mt-4 text-sm text-formula-frost/80">No players yet. Add rows in the Supabase Table Editor.</p>
          ) : (
            <ul className="mt-4 divide-y divide-formula-frost/10">
              {players.map((pl) => {
                const name = [pl.first_name, pl.last_name].filter(Boolean).join(' ') || 'Unnamed'
                return (
                  <li key={pl.id} className="flex flex-wrap items-baseline justify-between gap-2 py-4 first:pt-0">
                    <div>
                      <p className="font-medium text-formula-paper">{name}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist">
                        Age group · {pl.age_group ?? '—'}
                      </p>
                    </div>
                    <div className="text-right text-sm text-formula-frost/75">
                      <p>Program · —</p>
                      <p className="mt-1">Assessments · —</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
