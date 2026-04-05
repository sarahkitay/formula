'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogoutButton } from '@/components/auth/logout-button'
import { loadProfileForUser } from '@/lib/auth/load-profile'
import { getPortalRoute } from '@/lib/getPortalRoute'
import { STAFF_ROSTER_SELECT } from '@/lib/supabase/staff-roster-query'
import { supabase } from '@/lib/supabase'
import type { ProfileRow } from '@/types/profile'

type ProgramRow = {
  name: string | null
}

type PlayerProgramRow = {
  status: string | null
  programs: ProgramRow | ProgramRow[] | null
}

type AssessmentRow = {
  summary: string | null
  completed_at: string | null
}

type PlayerWithDetails = {
  id: string
  first_name: string | null
  last_name: string | null
  age_group: string | null
  player_programs?: PlayerProgramRow[] | null
  assessments?: AssessmentRow[] | null
}

type ParentPlayerLinkWithDetails = {
  id: string
  parent_user_id: string
  player_id: string
  players: PlayerWithDetails | PlayerWithDetails[] | null
}

function embedOne<T>(row: T | T[] | null | undefined): T | null {
  if (row == null) return null
  return Array.isArray(row) ? (row[0] ?? null) : row
}

function formatAssessmentDate(value: string | null | undefined) {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ParentPortalHubPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [links, setLinks] = useState<ParentPlayerLinkWithDetails[]>([])
  const [linksError, setLinksError] = useState<string | null>(null)

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

      if (hub === '/staff-portal') {
        router.replace('/staff-portal')
        return
      }

      if (hub !== '/parent-portal') {
        setPhase('error')
        setError('This account is not set up as a parent.')
        return
      }

      setProfile(p)

      const { data: ppData, error: ppErr } = await supabase
        .from('parent_players')
        .select(
          `
          id,
          parent_user_id,
          player_id,
          players (
            ${STAFF_ROSTER_SELECT}
          )
        `
        )
        .eq('parent_user_id', user.id)

      if (cancelled) return

      if (ppErr) {
        setLinks([])
        setLinksError(ppErr.message)
      } else {
        setLinks((ppData as ParentPlayerLinkWithDetails[]) ?? [])
        setLinksError(null)
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
        <p className="font-mono text-[10px] uppercase tracking-[0.24em]">
          Loading parent portal…
        </p>
      </div>
    )
  }

  const displayName = profile.full_name?.trim() || profile.email || 'Parent'

  return (
    <div className="portal-brand-surface admin-os min-h-dvh text-formula-paper">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-formula-frost/10 px-6 py-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-formula-mist">
            Parent portal
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-formula-paper">
            Welcome
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/parent/dashboard"
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-volt hover:opacity-90"
          >
            Full dashboard →
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-8 px-6 py-10">
        <section className="border border-formula-frost/15 bg-formula-paper/[0.03] p-6">
          <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
            Account
          </h2>
          <p className="mt-3 text-lg text-formula-paper">{displayName}</p>
        </section>

        <section className="border border-formula-frost/15 bg-formula-paper/[0.03] p-6">
          <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
            Linked athletes
          </h2>

          {linksError ? (
            <p className="mt-4 text-sm text-amber-200/90">
              Could not load links ({linksError}).
            </p>
          ) : links.length === 0 ? (
            <p className="mt-4 text-sm text-formula-frost/80">
              No athletes linked yet. Add a row in{' '}
              <code className="text-formula-volt">parent_players</code> for this
              parent in Supabase.
            </p>
          ) : (
            <ul className="mt-4 space-y-6">
              {links.map((row) => {
                const player = embedOne<PlayerWithDetails>(row.players)

                const name = player
                  ? [player.first_name, player.last_name]
                      .filter(Boolean)
                      .join(' ') || 'Athlete'
                  : 'Unknown athlete'

                const activeProgram = Array.isArray(player?.player_programs)
                  ? player.player_programs.find((program) => program.status === 'active') ??
                    player.player_programs[0] ??
                    null
                  : null

                const activeProgramName = embedOne<ProgramRow>(activeProgram?.programs)?.name ?? 'N/A'

                const latestAssessment = Array.isArray(player?.assessments)
                  ? [...player.assessments]
                      .filter((assessment) => assessment.completed_at)
                      .sort((a, b) => {
                        const aTime = a.completed_at
                          ? new Date(a.completed_at).getTime()
                          : 0
                        const bTime = b.completed_at
                          ? new Date(b.completed_at).getTime()
                          : 0
                        return bTime - aTime
                      })[0] ?? null
                  : null

                const latestAssessmentLabel = !latestAssessment
                  ? 'N/A'
                  : [
                      latestAssessment.completed_at
                        ? formatAssessmentDate(latestAssessment.completed_at)
                        : null,
                      latestAssessment.summary?.trim() || null,
                    ]
                      .filter(Boolean)
                      .join(' · ') || 'N/A'

                return (
                  <li
                    key={row.id}
                    className="border-t border-formula-frost/10 pt-4 first:border-t-0 first:pt-0"
                  >
                    <p className="font-medium text-formula-paper">{name}</p>

                    <dl className="mt-2 grid gap-1 text-sm text-formula-frost/85">
                      <div className="flex gap-2">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist">
                          Age group
                        </dt>
                        <dd>{player?.age_group ?? 'N/A'}</dd>
                      </div>

                      <div className="flex gap-2">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist">
                          Active program
                        </dt>
                        <dd>{activeProgramName}</dd>
                      </div>

                      <div className="flex gap-2">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist">
                          Latest assessment
                        </dt>
                        <dd>{latestAssessmentLabel ?? 'N/A'}</dd>
                      </div>
                    </dl>
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