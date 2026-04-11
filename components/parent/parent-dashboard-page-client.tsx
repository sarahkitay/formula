'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { ModuleBlock } from '@/components/dashboard/module-block'
import { parentNav } from '@/lib/nav/parent'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { CountUp } from '@/components/ui/count-up'
import { SectionHeader } from '@/components/ui/section-header'
import { Button } from '@/components/ui/button'
import { StatusPill } from '@/components/ui/badge'
import { getInitials, getAvatarColor, cn } from '@/lib/utils'
import { ParentDashboardSubtitle } from '@/components/parent/parent-dashboard-subtitle'
import { ParentSoftBanner } from '@/components/parent/parent-panel'
import {
  buildParentRecommendedActions,
  parentAttendanceSnapshot,
  type ParentUpcomingEvent,
} from '@/lib/mock-data/parent-portal'
import { useParentLinkedPlayers } from '@/components/parent/parent-linked-players-context'
import { fetchParentBlockBookings } from '@/lib/parent/parent-block-bookings'
import { supabase } from '@/lib/supabase'

type HomeNote = { playerId: string; firstName: string; date: string; summary: string }

export function ParentDashboardPageClient() {
  const { players: myPlayers, loading, error } = useParentLinkedPlayers()
  const [homeNotes, setHomeNotes] = useState<HomeNote[]>([])

  const [portalUpcoming, setPortalUpcoming] = useState<ParentUpcomingEvent[]>([])
  const [portalUpcomingLoading, setPortalUpcomingLoading] = useState(true)

  const recommendedActions = useMemo(
    () => buildParentRecommendedActions(myPlayers.map((p) => ({ id: p.id, firstName: p.firstName || 'Athlete' }))),
    [myPlayers]
  )

  useEffect(() => {
    if (myPlayers.length === 0) {
      setHomeNotes([])
      return
    }
    let cancelled = false
    const ids = myPlayers.map((p) => p.id)

    async function load() {
      const { data, error: qErr } = await supabase
        .from('assessments')
        .select('player_id, summary, completed_at')
        .in('player_id', ids)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })

      if (cancelled || qErr || !Array.isArray(data)) return

      const firstByPlayer = new Map<string, { summary: string | null; completed_at: string }>()
      for (const row of data) {
        const pid = row.player_id as string
        if (!pid || firstByPlayer.has(pid)) continue
        firstByPlayer.set(pid, { summary: row.summary ?? null, completed_at: row.completed_at as string })
      }

      const list: HomeNote[] = []
      for (const p of myPlayers) {
        const a = firstByPlayer.get(p.id)
        const s = a?.summary?.trim()
        if (!s || !a?.completed_at) continue
        list.push({
          playerId: p.id,
          firstName: p.firstName || 'Athlete',
          date: a.completed_at,
          summary: s,
        })
      }
      setHomeNotes(list)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [myPlayers])

  useEffect(() => {
    let cancelled = false

    async function loadUpcoming() {
      setPortalUpcomingLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        if (!cancelled) {
          setPortalUpcoming([])
          setPortalUpcomingLoading(false)
        }
        return
      }

      const [blocksRes, asstRes] = await Promise.all([
        fetchParentBlockBookings(),
        supabase
          .from('assessment_bookings')
          .select('id, num_kids, assessment_slots ( starts_at, label )')
          .eq('parent_user_id', user.id),
      ])

      if (cancelled) return

      const nowCut = Date.now() - 60 * 60 * 1000
      type Row = { ts: number; ev: ParentUpcomingEvent }
      const rows: Row[] = []

      if (blocksRes.data) {
        for (const row of blocksRes.data) {
          const ts = new Date(row.starts_at).getTime()
          if (ts < nowCut) continue
          const pl = myPlayers.find((p) => p.id === row.player_id)
          rows.push({
            ts,
            ev: {
              id: `block-${row.id}`,
              type: 'clinic',
              title: row.title,
              dateLabel: new Date(row.starts_at).toLocaleString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              }),
              detail: pl ? `Saved hold · ${pl.firstName}` : 'Youth block hold',
              href: '/parent/bookings#upcoming-bookings',
            },
          })
        }
      }

      if (!asstRes.error && Array.isArray(asstRes.data)) {
        for (const rawUnknown of asstRes.data as unknown[]) {
          if (!rawUnknown || typeof rawUnknown !== 'object') continue
          const raw = rawUnknown as {
            id: string
            num_kids: number
            assessment_slots:
              | { starts_at: string; label: string | null }
              | { starts_at: string; label: string | null }[]
              | null
          }
          const slotEmbed = raw.assessment_slots
          const slot = Array.isArray(slotEmbed) ? slotEmbed[0] : slotEmbed
          if (!slot?.starts_at) continue
          const ts = new Date(slot.starts_at).getTime()
          if (ts < nowCut) continue
          rows.push({
            ts,
            ev: {
              id: `assessment-${raw.id}`,
              type: 'reassessment',
              title: slot.label?.trim() || 'Assessment',
              dateLabel: new Date(slot.starts_at).toLocaleString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              }),
              detail: `${raw.num_kids} athlete(s) · paid booking`,
              href: '/parent/book-assessment',
            },
          })
        }
      }

      rows.sort((a, b) => a.ts - b.ts)
      setPortalUpcoming(rows.map((r) => r.ev))
      setPortalUpcomingLoading(false)
    }

    void loadUpcoming()
    return () => {
      cancelled = true
    }
  }, [myPlayers])

  const creditsTotal = 0
  const upcomingBookingsCount = portalUpcoming.length
  const paymentRows: unknown[] = []
  const totalSessionsAttended = 0

  const parentModules = parentNav.map((item, i) => {
    const id = String(i + 1).padStart(3, '0')
    if (item.href === '/parent/dashboard') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          surface="portal"
          title="Home"
          summary={item.description ?? ''}
          href={item.href}
          dataPoints={[
            { label: 'Players', value: myPlayers.length, highlight: 'green' },
            { label: 'Credits', value: creditsTotal, highlight: 'volt' },
            { label: 'Upcoming', value: upcomingBookingsCount },
          ]}
        />
      )
    }
    if (item.href === '/parent/players') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          surface="portal"
          title={item.label}
          summary={item.description ?? ''}
          href={item.href}
          dataPoints={[
            { label: 'Profiles', value: myPlayers.length },
            { label: 'Linked', value: myPlayers.length },
            { label: 'Portal', value: 'LIVE' },
          ]}
        />
      )
    }
    if (item.href === '/parent/bookings') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          surface="portal"
          title={item.label}
          summary={item.description ?? ''}
          href={item.href}
          dataPoints={[
            { label: 'Confirmed', value: upcomingBookingsCount, highlight: 'green' },
            { label: 'Capacity', value: 'SEE DESK' },
            { label: 'Next', value: portalUpcoming[0] ? 'BOOKED' : 'OPEN' },
          ]}
        />
      )
    }
    if (item.href === '/parent/memberships') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          surface="portal"
          title={item.label}
          summary={item.description ?? ''}
          href={item.href}
          dataPoints={[
            { label: 'Athletes', value: myPlayers.length },
            { label: 'Renewal', value: 'N/A' },
            { label: 'Policy', value: 'V1' },
          ]}
        />
      )
    }
    if (item.href === '/parent/payments') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          surface="portal"
          title="Billing"
          summary={item.description ?? ''}
          href={item.href}
          dataPoints={[
            { label: 'Receipts', value: paymentRows.length },
            { label: 'Last', value: paymentRows.length ? 'SEE LIST' : 'NONE' },
            { label: 'Acct', value: 'LINKED' },
          ]}
        />
      )
    }
    if (item.href === '/parent/progress') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          surface="portal"
          title={item.label}
          summary={item.description ?? ''}
          href={item.href}
          dataPoints={[
            { label: 'Athletes', value: myPlayers.length, highlight: 'green' },
            { label: 'Data', value: 'LIVE' },
            { label: 'Notes', value: 'STAFF' },
          ]}
        />
      )
    }
    if (item.href === '/parent/fpi-report') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          surface="portal"
          title="FPI report"
          summary={item.description ?? ''}
          href={item.href}
          dataPoints={[
            { label: 'Reports', value: myPlayers.length },
            { label: 'Private', value: 'YES' },
            { label: 'Source', value: 'DB' },
          ]}
        />
      )
    }
    if (item.href === '/parent/register') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          surface="portal"
          title={item.label}
          summary={item.description ?? ''}
          href={item.href}
          dataPoints={[
            { label: 'Friday', value: 'OPEN' },
            { label: 'Clinics', value: 'WAIT' },
            { label: 'Camps', value: 'OPEN' },
          ]}
        />
      )
    }
    if (item.href === '/parent/messages') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          surface="portal"
          title={item.label}
          summary={item.description ?? ''}
          href={item.href}
          dataPoints={[
            { label: 'Unread', value: '0', highlight: 'green' },
            { label: 'Inbox', value: 'EMPTY' },
            { label: 'Sync', value: 'EMAIL' },
          ]}
        />
      )
    }
    if (item.href === '/parent/learn') {
      return (
        <ModuleBlock
          key={item.href}
          id={id}
          surface="portal"
          title={item.label}
          summary={item.description ?? ''}
          href={item.href}
          dataPoints={[
            { label: 'Topics', value: '5' },
            { label: 'Read time', value: '6m' },
            { label: 'Trust', value: 'HIGH' },
          ]}
        />
      )
    }
    return (
      <ModuleBlock
        key={item.href}
        id={id}
        surface="portal"
        title={item.label}
        summary={item.description ?? ''}
        href={item.href}
        dataPoints={[{ label: 'Portal', value: 'OPEN' }]}
      />
    )
  })

  if (loading) {
    return (
      <PageContainer>
        <div className="py-16 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
          Loading home…
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Home" subtitle={<ParentDashboardSubtitle />} />
        <p className="text-sm text-amber-200/90">{error}</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-7">
        <PageHeader
          title="Home"
          subtitle={<ParentDashboardSubtitle />}
          actions={
            <Link href="/parent/bookings">
              <Button variant="primary">Book a block</Button>
            </Link>
          }
        />

        <ParentSoftBanner>
          Formula is a <strong>capacity-controlled accelerator</strong> - not a drop-in warehouse. Progress is shared
          constructively; we don&apos;t run public leaderboards or ranking walls.
        </ParentSoftBanner>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-sm border border-formula-frost/12 bg-formula-paper/[0.04] p-5 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)] lg:col-span-2">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-formula-mist">Recommended next steps</p>
            <ul className="mt-3 space-y-2">
              {recommendedActions.map((a) => (
                <li key={a.id}>
                  <Link
                    href={a.href}
                    className="flex items-center justify-between gap-2 border border-transparent px-2 py-2 text-sm text-formula-frost/90 transition-colors hover:border-formula-frost/15 hover:bg-formula-paper/[0.04]"
                  >
                    {a.label}
                    <ChevronRight className="h-4 w-4 shrink-0 text-formula-mist" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-sm border border-formula-frost/12 bg-formula-paper/[0.04] p-5 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-formula-mist">Attendance snapshot</p>
            <p className="mt-3 text-lg font-semibold text-formula-paper">{parentAttendanceSnapshot.last30Days}</p>
            {parentAttendanceSnapshot.streakWeeks > 0 ? (
              <p className="mt-1 text-sm text-formula-frost/70">{parentAttendanceSnapshot.streakWeeks} week consistency streak</p>
            ) : (
              <p className="mt-1 text-sm text-formula-frost/60">Streaks will show when check-ins sync to this portal.</p>
            )}
            <Link href="/parent/progress" className="mt-4 inline-block text-sm font-medium text-formula-volt hover:underline">
              View progress
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-formula-mist">Your upcoming bookings</p>
          {portalUpcomingLoading ? (
            <p className="text-sm text-formula-frost/70">Loading bookings…</p>
          ) : portalUpcoming.length === 0 ? (
            <div className="rounded-sm border border-formula-frost/12 bg-formula-paper/[0.04] p-5 text-sm text-formula-frost/75">
              <p>No upcoming sessions on file yet. Paid assessments appear after you finish parent portal signup with your checkout reference.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/parent/bookings"
                  className="inline-flex h-9 items-center border border-formula-volt/40 px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-formula-volt hover:bg-formula-volt/10"
                >
                  Schedule & booking
                </Link>
                <Link
                  href="/parent/book-assessment"
                  className="inline-flex h-9 items-center border border-formula-frost/20 px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-formula-paper hover:border-formula-frost/35"
                >
                  Book assessment
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {portalUpcoming.map((ev) => (
                <Link
                  key={ev.id}
                  href={ev.href}
                  className="rounded-sm border border-formula-frost/12 bg-formula-paper/[0.04] p-5 text-inherit no-underline shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)] transition-colors hover:border-formula-volt/25"
                >
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-formula-volt/90">
                    {ev.type.replace('-', ' ')}
                  </p>
                  <p className="mt-2 font-semibold text-formula-paper">{ev.title}</p>
                  <p className="mt-1 text-xs text-formula-mist">{ev.dateLabel}</p>
                  <p className="mt-2 text-sm leading-snug text-formula-frost/80">{ev.detail}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-sm border border-formula-frost/12 bg-formula-paper/[0.04] p-5 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-formula-mist">Recent progress notes</p>
          <div className="mt-4 space-y-4">
            {homeNotes.length === 0 ? (
              <p className="text-sm text-formula-frost/70">
                No assessment notes on file yet. After staff log an assessment, the latest summary can appear here — check back post-assessment.
              </p>
            ) : (
              homeNotes.map((u) => (
                <div key={`${u.playerId}-${u.date}`} className="border-b border-formula-frost/10 pb-4 last:border-0 last:pb-0">
                  <p className="text-xs font-medium text-formula-mist">
                    {u.firstName} ·{' '}
                    {new Date(u.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="mt-1 text-sm text-formula-frost/80">{u.summary}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{parentModules}</div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="My Players" value={<CountUp end={myPlayers.length} format="integer" />} accent href="/parent/players" />
          <StatCard
            label="Sessions Remaining"
            value={<CountUp end={creditsTotal} format="integer" />}
            sublabel="tracked at desk until billing syncs"
            href="/parent/memberships"
          />
          <StatCard
            label="Upcoming Bookings"
            value={<CountUp end={upcomingBookingsCount} format="integer" />}
            href="/parent/bookings"
          />
          <StatCard
            label="Total Sessions"
            value={<CountUp end={totalSessionsAttended} format="integer" />}
            sublabel="attendance in portal when connected"
            href="/parent/progress"
          />
        </div>

        <div className="space-y-4">
          <SectionHeader
            title="My Players"
            action={
              <Link href="/parent/players">
                <Button variant="ghost" size="sm">
                  View all <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            }
          />
          {myPlayers.length === 0 ? (
            <p className="text-sm text-text-muted">
              No athletes linked to this account yet. If you just registered, linking may still be processing — otherwise contact the front desk.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {myPlayers.map((player) => (
                <Link
                  key={player.id}
                  href={`/parent/progress/${player.id}`}
                  className="block space-y-4 rounded-xl border border-border bg-surface p-5 text-inherit no-underline transition-colors hover:border-border-bright hover:bg-surface-raised/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005700]"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold', getAvatarColor(player.id))}>
                      {getInitials(player.firstName, player.lastName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-text-primary">
                        {player.firstName} {player.lastName}
                      </p>
                      <p className="text-xs text-text-muted">{player.ageGroup}</p>
                    </div>
                    <StatusPill status="active" />
                  </div>

                  <div className="rounded-lg border border-border bg-surface-raised p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Membership & sessions</p>
                    <p className="mt-2 text-sm text-text-secondary">
                      Session balances and plans aren&apos;t shown in the portal yet. Ask at the desk or your assessment visit to confirm credits.
                    </p>
                  </div>

                  <p className="text-center text-xs text-text-muted">Use Book a block in the header or open Bookings to reserve time.</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
          <SectionHeader
            title="Upcoming Bookings"
            action={
              <Link href="/parent/bookings">
                <Button variant="ghost" size="sm">
                  Manage <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            }
          />
          <p className="text-sm text-text-muted text-center py-4">
            No upcoming bookings in the app yet.{' '}
            <Link href="/parent/bookings" className="text-accent-foreground hover:opacity-90">
              Book a session
            </Link>{' '}
            or confirm with the front desk.
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
