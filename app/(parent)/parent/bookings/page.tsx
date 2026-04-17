'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BookOpen, Clock, Users, CheckCircle2, AlertCircle } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { SectionHeader } from '@/components/ui/section-header'
import { Button } from '@/components/ui/button'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Badge, StatusPill, SessionTypeBadge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { ControlScheduleGrid, DAY_LABELS } from '@/components/schedule/control-schedule-grid'
import type { AgeGroup } from '@/types/player'
import { useParentLinkedPlayers } from '@/components/parent/parent-linked-players-context'
import { getUpcomingSessions } from '@/lib/mock-data/sessions'
import { getSessionById } from '@/lib/mock-data/sessions'
import { getAvatarColor, cn } from '@/lib/utils'
import { parentPortalInsetStrip } from '@/lib/parent/portal-surface'
import { SITE } from '@/lib/site-config'
import { weeklyBlockAllowance } from '@/lib/mock-data/parent-portal'
import { generateWeeklySchedule, startOfScheduleWeek, toISODateLocal } from '@/lib/schedule/generator'
import { ageGroupToScheduleBand } from '@/lib/schedule/age-map'
import { getBookableYouthSlots } from '@/lib/schedule/parent'
import type { BookableYouthSlot } from '@/types/schedule'
import type { DayIndex, ScheduleSlot } from '@/types/schedule'
import {
  createParentBlockBooking,
  fetchParentBlockBookings,
  type ParentBlockBookingRow,
} from '@/lib/parent/parent-block-bookings'

const AGE_GROUPS: AgeGroup[] = ['U8', 'U10', 'U12', 'U14', 'U16', 'U18', 'Adult']

function toBookingAgeGroup(raw: string): AgeGroup {
  const t = raw.trim() as AgeGroup
  return AGE_GROUPS.includes(t) ? t : 'U12'
}

type BookingRosterPlayer = {
  id: string
  firstName: string
  lastName: string
  ageGroup: AgeGroup
  sessionsRemaining: number
}

/** Training-floor rows only: parents never book fields or party room from this view */
const PARENT_SCHEDULE_ASSETS = [
  'performance-center',
  'speed-track',
  'double-speed-court',
  'speed-court',
  'footbot',
  'gym',
]

function bandInstant(weekStart: string, dayIndex: DayIndex, minute: number): Date {
  const sun = new Date(`${weekStart}T12:00:00`)
  const d = new Date(sun)
  d.setDate(sun.getDate() + dayIndex)
  d.setHours(Math.floor(minute / 60), minute % 60, 0, 0)
  return d
}

type PendingGridPayload = {
  slotRef: string
  playerId: string
  weekStart: string
  title: string
  startsAt: string
  endsAt: string | null
}

export default function ParentBookingsPage() {
  const { players: linkedPlayers, loading: rosterLoading } = useParentLinkedPlayers()

  const roster: BookingRosterPlayer[] = useMemo(
    () =>
      linkedPlayers.map((p) => ({
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        ageGroup: toBookingAgeGroup(p.ageGroup),
        sessionsRemaining: 0,
      })),
    [linkedPlayers]
  )

  const [selectedPlayerId, setSelectedPlayerId] = useState('')
  const [dbBookings, setDbBookings] = useState<ParentBlockBookingRow[]>([])
  const [enrollmentBySlotRef, setEnrollmentBySlotRef] = useState<Map<string, number>>(() => new Map())
  const [bookingsLoadError, setBookingsLoadError] = useState<string | null>(null)
  const [gridDay, setGridDay] = useState<DayIndex>(() => new Date().getDay() as DayIndex)
  const [pendingGridEnroll, setPendingGridEnroll] = useState<{
    prompt: string
    payload: PendingGridPayload
  } | null>(null)
  const [gridConfirmBusy, setGridConfirmBusy] = useState(false)
  const [rowActionId, setRowActionId] = useState<string | null>(null)
  const [bookingFlash, setBookingFlash] = useState<string | null>(null)

  const generatedWeek = useMemo(() => {
    const sun = startOfScheduleWeek(new Date())
    const wix = Math.floor(sun.getTime() / (7 * 86400000)) % 52
    return generateWeeklySchedule(new Date(), [], wix)
  }, [])

  const weekStartStr = generatedWeek.weekStart

  const reloadBookings = useCallback(async () => {
    setBookingsLoadError(null)
    const { data, error } = await fetchParentBlockBookings()
    if (error) {
      setBookingsLoadError(error.message)
      return
    }
    setDbBookings(data ?? [])
  }, [])

  const reloadYouthEnrollment = useCallback(async () => {
    try {
      const res = await fetch(`/api/schedule/youth-enrollment?weekStart=${encodeURIComponent(weekStartStr)}`)
      const body = (await res.json()) as { counts?: Record<string, number>; error?: string }
      if (!res.ok) return
      const m = new Map<string, number>()
      if (body.counts) {
        for (const [k, v] of Object.entries(body.counts)) {
          if (typeof v === 'number' && Number.isFinite(v)) m.set(k, v)
        }
      }
      setEnrollmentBySlotRef(m)
    } catch {
      setEnrollmentBySlotRef(new Map())
    }
  }, [weekStartStr])

  const reloadBookingState = useCallback(async () => {
    await Promise.all([reloadBookings(), reloadYouthEnrollment()])
  }, [reloadBookings, reloadYouthEnrollment])

  useEffect(() => {
    void reloadBookingState()
  }, [reloadBookingState])

  useEffect(() => {
    if (roster.length === 0) return
    setSelectedPlayerId((cur) => (roster.some((r) => r.id === cur) ? cur : roster[0]!.id))
  }, [roster])

  useEffect(() => {
    if (!bookingFlash) return
    const t = setTimeout(() => setBookingFlash(null), 5000)
    return () => clearTimeout(t)
  }, [bookingFlash])

  const selectedPlayer = roster.find((r) => r.id === selectedPlayerId)
  const sessionsLeft = selectedPlayer?.sessionsRemaining ?? 0

  const scheduleBand = selectedPlayer ? ageGroupToScheduleBand(selectedPlayer.ageGroup) : null

  const bookableSlots = useMemo(
    () => getBookableYouthSlots(generatedWeek, scheduleBand, enrollmentBySlotRef),
    [generatedWeek, scheduleBand, enrollmentBySlotRef]
  )
  const bookableByYouthBlock = useMemo(
    () => new Map(bookableSlots.map((slot) => [slot.youthBlockId, slot.id] as const)),
    [bookableSlots]
  )

  const availableSessions = getUpcomingSessions().filter(
    (s) =>
      s.ageGroups.includes(selectedPlayer?.ageGroup ?? '') && s.enrolledCount < s.capacity
  )

  const isYouthSlotBooked = useCallback(
    (slotRef: string) =>
      dbBookings.some(
        (b) =>
          b.player_id === selectedPlayerId &&
          b.slot_ref === slotRef &&
          b.week_start === weekStartStr &&
          b.status === 'confirmed'
      ),
    [dbBookings, selectedPlayerId, weekStartStr]
  )

  const isLegacySessionBooked = useCallback(
    (sessionId: string) =>
      dbBookings.some(
        (b) =>
          b.player_id === selectedPlayerId &&
          b.slot_ref === `legacy-${sessionId}` &&
          b.status === 'confirmed'
      ),
    [dbBookings, selectedPlayerId]
  )

  const persistPayload = useCallback(
    async (p: PendingGridPayload) => {
      const { error } = await createParentBlockBooking({
        player_id: p.playerId,
        slot_ref: p.slotRef,
        week_start: p.weekStart,
        title: p.title,
        starts_at: p.startsAt,
        ends_at: p.endsAt,
      })
      if (!error) {
        await reloadBookingState()
        return { ok: true as const }
      }
      const code = (error as { code?: string }).code
      if (code === '23505') {
        await reloadBookingState()
        return { ok: false as const, duplicate: true }
      }
      return { ok: false as const, message: error.message }
    },
    [reloadBookingState]
  )

  const formatBandSlotWhen = (dayIndex: DayIndex, startMinute: number) => {
    return bandInstant(weekStartStr, dayIndex, startMinute)
  }

  const formatEndMinute = (minute: number) => {
    const h = Math.floor(minute / 60)
    const mm = minute % 60
    const am = h >= 12 ? 'PM' : 'AM'
    const hr = h > 12 ? h - 12 : h === 0 ? 12 : h
    return `${hr}:${mm.toString().padStart(2, '0')} ${am}`
  }

  const canBookGridSlot = (slot: ScheduleSlot) =>
    !!(
      (scheduleBand &&
        !!slot.youthBlockId &&
        !!bookableByYouthBlock.get(slot.youthBlockId) &&
        (slot.kind === 'youth_training' || slot.kind === 'preschool') &&
        slot.ageBand === scheduleBand) ||
      slot.kind === 'open_gym'
    )

  const toBookPrompt = (slot: ScheduleSlot) => {
    const when = formatBandSlotWhen(slot.dayIndex, slot.startMinute)
    const day = when.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
    const at = when.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    return `Book ${day} at ${at}?`
  }

  const resolveGridBookId = (slot: ScheduleSlot): string | null => {
    if (slot.kind === 'open_gym') return `open-gym-${slot.id}`
    if (!slot.youthBlockId) return null
    return bookableByYouthBlock.get(slot.youthBlockId) ?? null
  }

  const buildPayloadFromScheduleSlot = (slot: ScheduleSlot, slotRef: string): PendingGridPayload | null => {
    if (!selectedPlayer) return null
    const start = formatBandSlotWhen(slot.dayIndex, slot.startMinute)
    const end = bandInstant(weekStartStr, slot.dayIndex, slot.endMinute)
    const title =
      slot.kind === 'open_gym'
        ? (slot.label?.trim() || 'Open gym')
        : bookableSlots.find((b) => b.id === slotRef)?.label ?? slot.label.split(' // ')[0] ?? slot.label
    return {
      slotRef,
      playerId: selectedPlayer.id,
      weekStart: weekStartStr,
      title,
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
    }
  }

  const buildPayloadFromBookable = (slot: BookableYouthSlot): PendingGridPayload | null => {
    if (!selectedPlayer) return null
    const start = bandInstant(slot.weekStart, slot.dayIndex, slot.startMinute)
    const end = bandInstant(slot.weekStart, slot.dayIndex, slot.endMinute)
    return {
      slotRef: slot.id,
      playerId: selectedPlayer.id,
      weekStart: slot.weekStart,
      title: slot.label,
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
    }
  }

  const handleGridSlotClick = (slot: ScheduleSlot) => {
    if (!canBookGridSlot(slot) || !selectedPlayer) return
    const slotRef = resolveGridBookId(slot)
    if (!slotRef) return
    const blockRow = bookableSlots.find((b) => b.id === slotRef)
    if (blockRow && blockRow.enrolled >= blockRow.capacity) {
      setBookingFlash('This block is full.')
      return
    }
    if (isYouthSlotBooked(slotRef)) {
      setBookingFlash('That block is already saved for this athlete this week.')
      return
    }
    const payload = buildPayloadFromScheduleSlot(slot, slotRef)
    if (!payload) return
    setPendingGridEnroll({ prompt: toBookPrompt(slot), payload })
  }

  const confirmGridEnroll = async () => {
    if (!pendingGridEnroll) return
    setGridConfirmBusy(true)
    try {
      const r = await persistPayload(pendingGridEnroll.payload)
      if (r.ok) setPendingGridEnroll(null)
      else if ('duplicate' in r && r.duplicate) {
        setPendingGridEnroll(null)
        setBookingFlash('Already enrolled — refreshed your list.')
      } else if ('message' in r && r.message) setBookingFlash(r.message)
    } finally {
      setGridConfirmBusy(false)
    }
  }

  const handleBookBookableRow = async (slot: BookableYouthSlot) => {
    if (!selectedPlayer) return
    if (slot.enrolled >= slot.capacity) {
      setBookingFlash('This block is full.')
      return
    }
    if (isYouthSlotBooked(slot.id)) {
      setBookingFlash('Already enrolled for this week.')
      return
    }
    const payload = buildPayloadFromBookable(slot)
    if (!payload) return
    setRowActionId(slot.id)
    try {
      const r = await persistPayload(payload)
      if (!r.ok && 'duplicate' in r && r.duplicate) setBookingFlash('Already enrolled — list updated.')
      else if (!r.ok && 'message' in r && r.message) setBookingFlash(r.message)
    } finally {
      setRowActionId(null)
    }
  }

  const handleBookLegacySession = async (sessionId: string) => {
    if (!selectedPlayer) return
    const session = getSessionById(sessionId)
    if (!session) return
    if (isLegacySessionBooked(sessionId)) {
      setBookingFlash('This session is already saved.')
      return
    }
    setRowActionId(`legacy-${sessionId}`)
    try {
      const weekStart = toISODateLocal(startOfScheduleWeek(new Date(session.startTime)))
      const r = await persistPayload({
        slotRef: `legacy-${sessionId}`,
        playerId: selectedPlayer.id,
        weekStart,
        title: session.title,
        startsAt: new Date(session.startTime).toISOString(),
        endsAt: new Date(session.endTime).toISOString(),
      })
      if (!r.ok && 'duplicate' in r && r.duplicate) setBookingFlash('Already saved — list updated.')
      else if (!r.ok && 'message' in r && r.message) setBookingFlash(r.message)
    } finally {
      setRowActionId(null)
    }
  }

  const myBlockBookings = useMemo(() => {
    if (!selectedPlayer) return []
    return dbBookings
      .filter((b) => b.player_id === selectedPlayer.id && b.status === 'confirmed')
      .slice()
      .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
  }, [dbBookings, selectedPlayer])

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Schedule & booking"
          subtitle={`${SITE.facilityName} · structured selection from published blocks - not an open calendar`}
        />

        {rosterLoading ? (
          <p className="text-sm text-text-muted">Loading your athletes…</p>
        ) : roster.length === 0 ? (
          <p className="text-sm text-text-muted">
            No athletes linked to this account. Link a player to book youth blocks for their age band.
          </p>
        ) : null}

        {bookingsLoadError ? (
          <p className="rounded-sm border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100/90">
            Could not load saved bookings ({bookingsLoadError}). Confirm the database migration is applied and you are
            signed in.
          </p>
        ) : null}

        {bookingFlash ? (
          <p className="rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2 text-sm text-formula-frost/90">
            {bookingFlash}
          </p>
        ) : null}

        <div className={parentPortalInsetStrip}>
          <p className="font-bold uppercase tracking-wide text-formula-paper">Weekly attendance allowance</p>
          <p className="mt-1">
            <strong className="text-formula-volt">{weeklyBlockAllowance.performance.label}</strong>: up to{' '}
            {weeklyBlockAllowance.performance.blocksPerWeek} youth blocks per week ·{' '}
            <strong className="text-formula-volt">{weeklyBlockAllowance.performanceElite.label}</strong>: up to{' '}
            {weeklyBlockAllowance.performanceElite.blocksPerWeek} blocks per week.
          </p>
          <p className="mt-2 font-bold uppercase tracking-wide text-formula-paper">System schedule</p>
          <p className="mt-1">
            Blocks are pre-built by the facility engine. The schedule map and enroll list only include rows whose age
            matches your child&apos;s training band: roster{' '}
            <strong className="text-formula-volt">{selectedPlayer?.ageGroup ?? 'N/A'}</strong> →{' '}
            <strong className="text-formula-volt">{scheduleBand ?? 'N/A'}</strong> (same ages shown next to stations,
            e.g. Station 1 // 12-14).
          </p>
          <p className="mt-1.5 text-formula-mist">{SITE.cancellationPolicy}</p>
          <p className="mt-1.5 text-formula-mist">{SITE.membershipPolicy}</p>
        </div>

        {/* Player selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Booking for:</span>
          <div className="flex items-center gap-2">
            {roster.map((player) => (
              <button
                key={player.id}
                type="button"
                onClick={() => setSelectedPlayerId(player.id)}
                className={cn(
                  'flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium border transition-all duration-150',
                  selectedPlayerId === player.id
                    ? 'border-primary/50 bg-primary/15 text-accent-foreground'
                    : 'border-border bg-surface text-text-secondary hover:border-border-bright hover:text-text-primary'
                )}
              >
                <div
                  className={cn(
                    'h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold',
                    getAvatarColor(player.id)
                  )}
                >
                  {player.firstName.charAt(0)}
                </div>
                {player.firstName}
              </button>
            ))}
          </div>
        </div>

        {selectedPlayer && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Main: session cards */}
            <div className="lg:col-span-2 space-y-4">
              {scheduleBand && (
                <div className="space-y-2">
                  <SectionHeader
                    title="Training floor: this week"
                    description={`Full floor view. Green = Open Gym + sessions for ${scheduleBand}. Click green blocks to enroll.`}
                  />
                  <div className="flex flex-wrap gap-1 rounded-sm border border-formula-frost/12 bg-formula-paper/[0.03] p-1">
                    {([0, 1, 2, 3, 4, 5, 6] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setGridDay(d as DayIndex)}
                        className={cn(
                          'border px-2 py-1 font-mono text-[9px] font-bold uppercase transition-colors',
                          gridDay === d
                            ? 'border-formula-volt/45 bg-formula-volt text-formula-base'
                            : 'border-formula-frost/12 bg-formula-deep/45 text-formula-mist hover:border-formula-frost/25'
                        )}
                      >
                        {DAY_LABELS[d]}
                      </button>
                    ))}
                  </div>
                  <div className="overflow-x-auto">
                    <ControlScheduleGrid
                      week={generatedWeek}
                      dayIndex={gridDay}
                      assetFilter={PARENT_SCHEDULE_ASSETS}
                      scheduleAgeBand={scheduleBand ?? undefined}
                      parentMode
                      onSlotClick={handleGridSlotClick}
                      isSlotInteractive={(slot) => {
                        if (!canBookGridSlot(slot)) return false
                        const ref = resolveGridBookId(slot)
                        if (!ref) return false
                        if (isYouthSlotBooked(ref)) return false
                        const row = bookableSlots.find((b) => b.id === ref)
                        if (row && row.enrolled >= row.capacity) return false
                        return true
                      }}
                    />
                  </div>
                </div>
              )}

              {!scheduleBand && (
                <div className="flex items-start gap-2 border border-warning/30 bg-warning/10 p-3 text-sm text-text-secondary">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  <p>Online youth booking applies to academy age groups. For adult programs, contact the desk.</p>
                </div>
              )}
              {/* Sessions remaining banner */}
              <div
                className={cn(
                  'flex items-center gap-4 rounded-xl border p-4',
                  sessionsLeft === 0 ? 'border-error/25 bg-error/5'
                    : sessionsLeft <= 2 ? 'border-warning/25 bg-warning/5'
                    : 'border-border bg-surface'
                )}
              >
                <div className="text-center w-14">
                  <p
                    className={cn(
                      'text-3xl font-black',
                      sessionsLeft === 0 ? 'text-error'
                        : sessionsLeft <= 2 ? 'text-warning'
                        : 'text-success'
                    )}
                  >
                    {sessionsLeft}
                  </p>
                  <p className="text-xs text-text-muted">sessions</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary">
                    {sessionsLeft === 0 ? 'No sessions remaining' : `${sessionsLeft} sessions remaining`}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    Session balance in the portal isn&apos;t connected yet — confirm credits at the desk. You can still
                    save blocks here; staff reconcile capacity and membership.
                  </p>
                </div>
                {sessionsLeft === 0 && (
                  <Button variant="primary" size="sm">
                    Renew Membership
                  </Button>
                )}
              </div>

              <SectionHeader
                title={`Your band blocks: ${scheduleBand ?? selectedPlayer.ageGroup}`}
                description={
                  scheduleBand
                    ? `${bookableSlots.length} generated youth blocks this week. Tap green blocks above or use Enroll here.`
                    : 'No generated youth blocks for this profile'
                }
              />

              {scheduleBand && bookableSlots.length === 0 && (
                <EmptyState
                  icon={<BookOpen />}
                  title="No blocks this week"
                  description="Sit-out rotation or holiday may apply; check the next week or call the desk."
                />
              )}

              {scheduleBand && bookableSlots.length > 0 && (
                <div className="space-y-3">
                  {bookableSlots.map((slot) => {
                    const when = formatBandSlotWhen(slot.dayIndex, slot.startMinute)
                    const isBooked = isYouthSlotBooked(slot.id)
                    const spotsLeft = slot.capacity - slot.enrolled
                    const almostFull = spotsLeft > 0 && spotsLeft <= 2
                    const busy = rowActionId === slot.id
                    return (
                      <div
                        key={slot.id}
                        className={cn(
                          'rounded-xl border p-4 transition-all',
                          isBooked
                            ? 'border-formula-volt/35 bg-formula-volt/10'
                            : 'border-formula-frost/12 bg-formula-paper/[0.04] shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)] hover:border-formula-frost/25'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-text-primary">{slot.label}</p>
                              <Badge variant="accent" size="sm">
                                Band {slot.ageBand}
                              </Badge>
                              <span className="font-mono text-[10px] uppercase text-formula-mist">{slot.youthBlockId}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {DAY_LABELS[slot.dayIndex]}{' '}
                                {when.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ·{' '}
                                {when.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                {' · '}
                                {formatEndMinute(slot.endMinute)}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className={almostFull ? 'font-medium text-warning' : 'text-text-muted'}>
                                  {spotsLeft} roster spots open (system cap {slot.capacity})
                                </span>
                                <span className="text-text-muted">
                                  {slot.enrolled}/{slot.capacity}
                                </span>
                              </div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-formula-deep/80">
                                <div
                                  className={cn('h-full', almostFull ? 'bg-warning' : 'bg-[#005700]')}
                                  style={{ width: `${(slot.enrolled / slot.capacity) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-2">
                            {isBooked ? (
                              <div className="flex items-center gap-1.5 text-sm font-medium text-formula-volt">
                                <CheckCircle2 className="h-4 w-4" />
                                Enrolled
                              </div>
                            ) : (
                              <>
                                <p className="text-xs text-text-muted">Saves to your portal</p>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  disabled={busy || slot.enrolled >= slot.capacity}
                                  onClick={() => void handleBookBookableRow(slot)}
                                >
                                  {busy ? 'Saving…' : slot.enrolled >= slot.capacity ? 'Full' : 'Enroll'}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <SectionHeader
                title={`Open roster sessions: ${selectedPlayer.ageGroup}`}
                description={`${availableSessions.length} legacy / coach-led sessions (if listed)`}
              />
              {availableSessions.length === 0 ? (
                <p className="text-xs text-text-muted">No additional coach sessions in mock data.</p>
              ) : (
                <div className="space-y-3">
                  {availableSessions.map((session) => {
                    const isBooked = isLegacySessionBooked(session.id)
                    const spotsLeft = session.capacity - session.enrolledCount
                    const busy = rowActionId === `legacy-${session.id}`
                    return (
                      <div
                        key={session.id}
                        className={cn(
                          'rounded-xl border border-formula-frost/12 bg-formula-paper/[0.04] p-4 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]',
                          isBooked && 'border-formula-volt/35 bg-formula-volt/10'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-text-primary">{session.title}</p>
                            <SessionTypeBadge type={session.sessionType} />
                            <p className="mt-1 text-xs text-text-muted">
                              {spotsLeft} spots · {session.fieldName}
                            </p>
                          </div>
                          {!isBooked ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled={busy}
                              onClick={() => void handleBookLegacySession(session.id)}
                            >
                              {busy ? 'Saving…' : 'Book'}
                            </Button>
                          ) : (
                            <span className="text-xs font-medium text-formula-volt">Booked</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Right: upcoming bookings */}
            <div id="upcoming-bookings" className="scroll-mt-24 space-y-4">
              <SectionHeader title="Upcoming Bookings" />
              {myBlockBookings.length === 0 ? (
                <EmptyState icon={<BookOpen />} title="No saved blocks yet" compact />
              ) : (
                <div className="space-y-2">
                  {myBlockBookings.map((booking) => (
                    <div key={booking.id} className="rounded-lg border border-border bg-surface p-3 space-y-1.5">
                      <p className="text-sm font-medium text-text-primary truncate">{booking.title}</p>
                      <p className="text-xs text-text-muted">
                        {new Date(booking.starts_at).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                        {' at '}
                        {new Date(booking.starts_at).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </p>
                      <StatusPill status={booking.status as 'confirmed' | 'cancelled'} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Modal
        open={pendingGridEnroll != null}
        onClose={() => !gridConfirmBusy && setPendingGridEnroll(null)}
        title="Confirm enrollment"
        size="sm"
      >
        <ModalBody>
          <p className="text-sm font-medium text-text-primary">{pendingGridEnroll?.prompt}</p>
          <p className="mt-1 text-xs text-text-muted">
            We&apos;ll save this hold to your portal. Session credits and desk confirmation are still reconciled
            separately.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" size="sm" disabled={gridConfirmBusy} onClick={() => setPendingGridEnroll(null)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" disabled={gridConfirmBusy} onClick={() => void confirmGridEnroll()}>
            {gridConfirmBusy ? 'Saving…' : 'Save booking'}
          </Button>
        </ModalFooter>
      </Modal>
    </PageContainer>
  )
}
