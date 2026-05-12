'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { UserCheck } from 'lucide-react'
import { ScannerPanel } from '@/components/check-in/scanner-panel'
import { FacilityLoadPanel } from '@/components/check-in/facility-load-panel'
import { CheckInBookingList } from '@/components/check-in/check-in-booking-list'
import { PlayerCheckInDetail } from '@/components/check-in/player-check-in-detail'
import { searchPlayers } from '@/lib/mock-data/players'
import type { Player } from '@/types'
import { getTodaysSessions, getSessionById } from '@/lib/mock-data/sessions'
import { getBookingsBySession, getPlayerTodayBooking } from '@/lib/mock-data/bookings'
import { getMembershipByPlayer } from '@/lib/mock-data/memberships'
import { decrementSession } from '@/lib/booking-engine'
import { Card } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { staffApiFetch } from '@/lib/auth/staff-api-fetch'
import { FACILITY_TIMEZONE } from '@/lib/facility/facility-day'

export default function CheckInPage() {
  const [query, setQuery] = useState('')
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [activeSession, setActiveSession] = useState<string>('all')
  const [checkedInIds, setCheckedInIds] = useState<Set<string>>(() => new Set())
  const [rosterPlayers, setRosterPlayers] = useState<Player[]>([])
  const [rosterError, setRosterError] = useState<string | null>(null)

  const loadRoster = useCallback(async () => {
    setRosterError(null)
    try {
      const res = await staffApiFetch('/api/facility/players')
      const body = (await res.json()) as { players?: Player[]; error?: string }
      if (!res.ok) throw new Error(body.error ?? 'Failed to load roster')
      setRosterPlayers(body.players ?? [])
    } catch (e) {
      setRosterPlayers([])
      setRosterError(e instanceof Error ? e.message : 'Failed to load roster')
    }
  }, [])

  useEffect(() => {
    void loadRoster()
  }, [loadRoster])

  const todaysSessions = useMemo(() => getTodaysSessions(), [])

  const sessionTabs = useMemo(
    () => [
      {
        id: 'all',
        label: 'All today',
        count: todaysSessions.reduce((n, s) => n + getBookingsBySession(s.id).length, 0),
      },
      ...todaysSessions.map(s => ({
        id: s.id,
        label: s.startTime
          ? new Date(s.startTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
              timeZone: FACILITY_TIMEZONE,
            })
          : s.title,
        count: getBookingsBySession(s.id).length,
      })),
    ],
    [todaysSessions]
  )

  const allTodaysBookings = useMemo(
    () => todaysSessions.flatMap(s => getBookingsBySession(s.id)),
    [todaysSessions]
  )

  const bookingRows = useMemo(() => {
    const sessionIds = activeSession === 'all' ? todaysSessions.map(s => s.id) : [activeSession]
    const allBookings = sessionIds.flatMap(sid => getBookingsBySession(sid))
    if (!query.trim()) return allBookings
    const matched = searchPlayers(query, rosterPlayers).map(p => p.id)
    return allBookings.filter(b => matched.includes(b.playerId))
  }, [activeSession, query, todaysSessions, rosterPlayers])

  const selectedPlayer = selectedPlayerId ? rosterPlayers.find(p => p.id === selectedPlayerId) : undefined
  const playerBooking = selectedPlayer ? getPlayerTodayBooking(selectedPlayer.id) : undefined
  const playerSession = playerBooking ? getSessionById(playerBooking.sessionId) : undefined
  const membership = selectedPlayer ? getMembershipByPlayer(selectedPlayer.id) : undefined
  const isCheckedIn = selectedPlayerId ? checkedInIds.has(selectedPlayerId) : false

  const nextSession = useMemo(() => {
    return (
      todaysSessions.find(s => s.status === 'scheduled') ??
      todaysSessions.find(s => s.status === 'in-progress') ??
      todaysSessions[0]
    )
  }, [todaysSessions])

  const nextBlockBooked = nextSession ? getBookingsBySession(nextSession.id).length : 0
  const nextBlockLabel = nextSession
    ? new Date(nextSession.startTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: FACILITY_TIMEZONE,
      })
    : 'N/A'

  const handleCheckIn = () => {
    if (!selectedPlayerId) return
    if (!decrementSession(selectedPlayerId).ok) return
    setCheckedInIds(prev => new Set([...prev, selectedPlayerId]))
  }

  const handleVerifySearch = () => {
    const q = query.trim()
    if (!q) return
    const first = searchPlayers(q, rosterPlayers)[0]
    if (first) setSelectedPlayerId(first.id)
  }

  const stamp = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: FACILITY_TIMEZONE,
  })

  return (
    <PageContainer fullWidth>
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="flex min-h-[min(70vh,720px)] flex-col gap-8 xl:col-span-8">
          <PageHeader
            title="Check-in"
            subtitle={
              rosterError
                ? `${stamp} · roster from Supabase`
                : `${stamp} · ${rosterPlayers.length} athletes loaded · roster from Supabase`
            }
            breadcrumb={[
              { label: 'Schedule', href: '/admin/schedule' },
              { label: 'Check-in' },
            ]}
          />
          {rosterError ? <p className="font-mono text-xs text-amber-200/90">{rosterError}</p> : null}

          <CheckInBookingList
            sessionTabs={sessionTabs}
            activeSession={activeSession}
            onSessionChange={setActiveSession}
            query={query}
            onQueryChange={setQuery}
            bookingRows={bookingRows}
            roster={rosterPlayers}
            checkedInIds={checkedInIds}
            selectedPlayerId={selectedPlayerId}
            onSelectPlayer={setSelectedPlayerId}
            onVerifySearch={handleVerifySearch}
          />
        </div>

        <div className="flex flex-col gap-6 xl:col-span-4">
          <ScannerPanel />
          <FacilityLoadPanel
            checkedInCount={checkedInIds.size}
            bookingCount={allTodaysBookings.length}
            nextBlockLabel={nextBlockLabel}
            nextBlockBooked={nextBlockBooked}
            nextBlockCapacity={nextSession?.capacity ?? 22}
          />

          {!selectedPlayer ? (
            <Card className="border-formula-frost/12 bg-formula-paper/[0.04] p-6 text-center text-formula-paper shadow-[inset_0_1px_0_0_rgb(255_255_255_/_.04)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center border border-formula-frost/14 bg-formula-deep/50 text-formula-mist">
                <UserCheck className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-sm font-medium text-formula-paper">Select athlete</p>
              <p className="mt-1 font-mono text-xs text-formula-mist">
                List or verify search // detail panel loads here
              </p>
            </Card>
          ) : (
            <PlayerCheckInDetail
              player={selectedPlayer}
              booking={playerBooking}
              session={playerSession}
              membership={membership}
              isCheckedIn={isCheckedIn}
              onCheckIn={handleCheckIn}
            />
          )}
        </div>
      </div>

      <details className="mt-10 rounded-lg border border-formula-frost/14 bg-formula-paper/[0.03] p-4 open:border-formula-frost/22">
        <summary className="cursor-pointer list-none font-mono text-[11px] font-bold uppercase tracking-wide text-formula-paper marker:hidden [&::-webkit-details-marker]:hidden">
          <span className="text-formula-volt">▸</span> View all players &amp; clients
        </summary>
        <div className="mt-4 flex flex-wrap gap-3 border-t border-formula-frost/10 pt-4 font-mono text-[11px]">
          <Link
            href="/admin/players"
            className="inline-flex items-center rounded border border-formula-frost/18 bg-formula-base/40 px-3 py-2 text-formula-volt underline-offset-2 hover:border-formula-volt/40 hover:underline"
          >
            Player registry →
          </Link>
          <Link
            href="/admin/clients/profile"
            className="inline-flex items-center rounded border border-formula-frost/18 bg-formula-base/40 px-3 py-2 text-formula-volt underline-offset-2 hover:border-formula-volt/40 hover:underline"
          >
            Client profiles &amp; ledger →
          </Link>
        </div>
      </details>
    </PageContainer>
  )
}
