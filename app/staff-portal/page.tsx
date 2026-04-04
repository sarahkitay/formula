'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogoutButton } from '@/components/auth/logout-button'
import { loadProfileForUser, staffDashboardHref } from '@/lib/auth/load-profile'
import { getPortalRoute } from '@/lib/getPortalRoute'
import { STAFF_ROSTER_SELECT } from '@/lib/supabase/staff-roster-query'
import { supabase } from '@/lib/supabase'
import type { ProfileRow } from '@/types/profile'

const DEFAULT_ASSESSMENT_SUMMARY = 'Initial assessment completed'

type ProgramRow = {
  name: string | null
}

type PlayerProgramRow = {
  status: string | null
  programs: ProgramRow | ProgramRow[] | null
}

type AssessmentRow = {
  id?: string
  summary: string | null
  completed_at: string | null
}

type PlayerWithDetails = {
  id: string
  first_name: string | null
  last_name: string | null
  age_group: string | null
  created_at: string | null
  player_programs?: PlayerProgramRow[] | null
  assessments?: AssessmentRow[] | null
}

function embedOne<T>(row: T | T[] | null | undefined): T | null {
  if (row == null) return null
  return Array.isArray(row) ? (row[0] ?? null) : row
}

function formatDate(value: string | null | undefined) {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function StaffPortalHubPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [players, setPlayers] = useState<PlayerWithDetails[]>([])
  const [playersError, setPlayersError] = useState<string | null>(null)
  const [summaryDraft, setSummaryDraft] = useState<Record<string, string>>({})
  const [creatingFor, setCreatingFor] = useState<string | null>(null)
  const [createFlash, setCreateFlash] = useState<{ kind: 'ok' | 'error'; message: string } | null>(null)

  const reloadPlayers = useCallback(async () => {
    const { data: roster, error: rosterErr } = await supabase
      .from('players')
      .select(STAFF_ROSTER_SELECT)
      .order('created_at', { ascending: false })

    if (rosterErr) {
      setPlayers([])
      setPlayersError(rosterErr.message)
    } else {
      setPlayers((roster as PlayerWithDetails[]) ?? [])
      setPlayersError(null)
    }
  }, [])

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

      await reloadPlayers()

      if (cancelled) return

      setPhase('ready')
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [router, reloadPlayers])

  async function handleCreateAssessment(playerId: string) {
    setCreateFlash(null)
    setCreatingFor(playerId)
    const raw = summaryDraft[playerId]?.trim()
    const summary = raw && raw.length > 0 ? raw : DEFAULT_ASSESSMENT_SUMMARY

    const { error: insertErr } = await supabase.from('assessments').insert({
      player_id: playerId,
      summary,
      completed_at: new Date().toISOString(),
    })

    setCreatingFor(null)

    if (insertErr) {
      setCreateFlash({ kind: 'error', message: insertErr.message })
      return
    }

    setCreateFlash({
      kind: 'ok',
      message: 'Assessment saved. Parents linked to this player will see it when they refresh.',
    })
    await reloadPlayers()
    window.setTimeout(() => setCreateFlash((f) => (f?.kind === 'ok' ? null : f)), 5000)
  }

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
          Loading staff portal…
        </p>
      </div>
    )
  }

  const dashHref = staffDashboardHref(profile.role)
  const roleLabel =
    profile.role === 'coach'
      ? 'Coach'
      : profile.role === 'admin'
        ? 'Admin'
        : 'Staff'

  return (
    <div className="portal-brand-surface admin-os min-h-dvh text-formula-paper">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-formula-frost/10 px-6 py-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-formula-mist">
            Staff portal
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-formula-paper">
            {roleLabel} roster
          </h1>
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
          <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
            Players
          </h2>

          {createFlash ? (
            <p
              className={
                createFlash.kind === 'error'
                  ? 'mt-4 rounded-sm border border-red-500/35 bg-red-500/10 px-3 py-2 text-sm text-red-200/95'
                  : 'mt-4 rounded-sm border border-formula-volt/30 bg-formula-volt/10 px-3 py-2 text-sm text-formula-paper'
              }
            >
              {createFlash.message}
            </p>
          ) : null}

          {playersError ? (
            <p className="mt-4 text-sm text-amber-200/90">
              Could not load players ({playersError}).
            </p>
          ) : players.length === 0 ? (
            <p className="mt-4 text-sm text-formula-frost/80">
              No players yet. Add rows in the Supabase Table Editor.
            </p>
          ) : (
            <ul className="mt-4">
              {players.map((pl) => {
                const name =
                  [pl.first_name, pl.last_name].filter(Boolean).join(' ') || 'Unnamed'

                const activeProgram = Array.isArray(pl.player_programs)
                  ? pl.player_programs.find((program) => program.status === 'active') ??
                    pl.player_programs[0] ??
                    null
                  : null

                const activeProgramName =
                  embedOne<ProgramRow>(activeProgram?.programs)?.name ?? '—'

                const completedAssessments = Array.isArray(pl.assessments)
                  ? pl.assessments.filter((assessment) => assessment.completed_at)
                  : []

                const latestAssessment =
                  completedAssessments.length > 0
                    ? [...completedAssessments].sort((a, b) => {
                        const aTime = a.completed_at
                          ? new Date(a.completed_at).getTime()
                          : 0
                        const bTime = b.completed_at
                          ? new Date(b.completed_at).getTime()
                          : 0
                        return bTime - aTime
                      })[0]
                    : null

                const latestAssessmentDate = formatDate(
                  latestAssessment?.completed_at
                )

                return (
                  <li
                    key={pl.id}
                    className="flex flex-col gap-3 border-b border-formula-frost/10 py-4 first:pt-0 last:border-b-0"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <p className="font-medium text-formula-paper">{name}</p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist">
                          Age group · {pl.age_group ?? '—'}
                        </p>
                      </div>

                      <div className="text-right text-sm text-formula-frost/75">
                        <p>Program · {activeProgramName}</p>
                        <p className="mt-1">Assessments · {completedAssessments.length}</p>
                        <p className="mt-1">Latest · {latestAssessmentDate ?? '—'}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                      <label className="min-w-0 flex-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-formula-mist">
                        <span className="mb-1.5 block text-formula-mist/90">Assessment summary</span>
                        <input
                          type="text"
                          value={summaryDraft[pl.id] ?? ''}
                          onChange={(e) =>
                            setSummaryDraft((prev) => ({ ...prev, [pl.id]: e.target.value }))
                          }
                          placeholder={DEFAULT_ASSESSMENT_SUMMARY}
                          className="w-full border border-formula-frost/20 bg-formula-paper/[0.04] px-3 py-2.5 font-sans text-[13px] font-normal normal-case tracking-normal text-formula-paper placeholder:text-formula-mist/45 outline-none focus:border-formula-volt/40"
                        />
                      </label>
                      <button
                        type="button"
                        disabled={creatingFor === pl.id}
                        onClick={() => void handleCreateAssessment(pl.id)}
                        className="shrink-0 border border-formula-volt/50 bg-formula-volt px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-base transition-[filter] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {creatingFor === pl.id ? 'Saving…' : 'Create assessment'}
                      </button>
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