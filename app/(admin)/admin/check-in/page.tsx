'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
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
      const res = await fetch('/api/facility/players')
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
  })

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <div className="flex min-h-[min(70vh,720px)] flex-col gap-6 xl:col-span-8">
        <header className="shrink-0">
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Active check-in</h1>
          <p className="mt-1 font-mono text-sm uppercase tracking-[0.18em] text-formula-mist">
            {stamp.toUpperCase()} // ROSTER FROM SUPABASE PLAYERS TABLE
          </p>
          {rosterError ? (
            <p className="mt-2 font-mono text-xs text-amber-200/90">{rosterError}</p>
          ) : (
            <p className="mt-2 font-mono text-xs text-formula-mist">{rosterPlayers.length} athletes loaded</p>
          )}
        </header>

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
          <Card className="p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center border border-formula-frost/14 bg-formula-paper/[0.06] text-formula-mist">
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
  )
}
