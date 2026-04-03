'use client'

import React, { useState, useMemo } from 'react'
import { UserCheck } from 'lucide-react'
import { ScannerPanel } from '@/components/check-in/scanner-panel'
import { FacilityLoadPanel } from '@/components/check-in/facility-load-panel'
import { CheckInBookingList } from '@/components/check-in/check-in-booking-list'
import { PlayerCheckInDetail } from '@/components/check-in/player-check-in-detail'
import { searchPlayers, getPlayerById } from '@/lib/mock-data/players'
import { getTodaysSessions, getSessionById } from '@/lib/mock-data/sessions'
import { getBookingsBySession, getPlayerTodayBooking } from '@/lib/mock-data/bookings'
import { getTodaysCheckIns } from '@/lib/mock-data/checkins'
import { getMembershipByPlayer } from '@/lib/mock-data/memberships'
import { decrementSession } from '@/lib/booking-engine'
import { Card } from '@/components/ui/card'

export default function CheckInPage() {
  const [query, setQuery] = useState('')
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [activeSession, setActiveSession] = useState<string>('all')
  const [checkedInIds, setCheckedInIds] = useState<Set<string>>(
    () => new Set(getTodaysCheckIns().map(c => c.playerId))
  )

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
    const matched = searchPlayers(query).map(p => p.id)
    return allBookings.filter(b => matched.includes(b.playerId))
  }, [activeSession, query, todaysSessions])

  const selectedPlayer = selectedPlayerId ? getPlayerById(selectedPlayerId) : undefined
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
    const first = searchPlayers(q)[0]
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
          <p className="mt-1 font-mono text-sm uppercase tracking-[0.18em] text-zinc-500">
            {stamp.toUpperCase()} // SYSTEM STANDBY
          </p>
        </header>

        <CheckInBookingList
          sessionTabs={sessionTabs}
          activeSession={activeSession}
          onSessionChange={setActiveSession}
          query={query}
          onQueryChange={setQuery}
          bookingRows={bookingRows}
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
          <Card className="border border-black/10 bg-white p-6 text-center shadow-lab">
            <div className="mx-auto flex h-14 w-14 items-center justify-center border border-black/10 bg-[#f9f9f9] text-zinc-400">
              <UserCheck className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <p className="mt-4 text-sm font-medium text-[#1a1a1a]">Select athlete</p>
            <p className="mt-1 font-mono text-xs text-zinc-500">
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
