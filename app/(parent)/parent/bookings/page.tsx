'use client'

import React, { useEffect, useMemo, useState } from 'react'
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
import { getBookingsByPlayer } from '@/lib/mock-data/bookings'
import { getSessionById } from '@/lib/mock-data/sessions'
import { getAvatarColor, cn } from '@/lib/utils'
import { parentPortalInsetStrip } from '@/lib/parent/portal-surface'
import { SITE } from '@/lib/site-config'
import { weeklyBlockAllowance } from '@/lib/mock-data/parent-portal'
import { generateWeeklySchedule, startOfScheduleWeek } from '@/lib/schedule/generator'
import { ageGroupToScheduleBand } from '@/lib/schedule/age-map'
import { getBookableYouthSlots } from '@/lib/schedule/parent'
import type { DayIndex, ScheduleSlot } from '@/types/schedule'

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
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set())
  const [gridDay, setGridDay] = useState<DayIndex>(() => new Date().getDay() as DayIndex)
  const [pendingGridEnroll, setPendingGridEnroll] = useState<{ id: string; prompt: string } | null>(null)

  useEffect(() => {
    if (roster.length === 0) return
    setSelectedPlayerId((cur) => (roster.some((r) => r.id === cur) ? cur : roster[0]!.id))
  }, [roster])

  const selectedPlayer = roster.find((r) => r.id === selectedPlayerId)
  const sessionsLeft = selectedPlayer?.sessionsRemaining ?? 0

  const scheduleBand = selectedPlayer ? ageGroupToScheduleBand(selectedPlayer.ageGroup) : null

  const generatedWeek = useMemo(() => {
  const sun = startOfScheduleWeek(new Date())
  const wix = Math.floor(sun.getTime() / (7 * 86400000)) % 52
  return generateWeeklySchedule(new Date(), [], wix)
  }, [])

  const bookableSlots = useMemo(
  () => getBookableYouthSlots(generatedWeek, scheduleBand),
  [generatedWeek, scheduleBand]
  )
  const bookableByYouthBlock = useMemo(
  () => new Map(bookableSlots.map(slot => [slot.youthBlockId, slot.id] as const)),
  [bookableSlots]
  )

  // Supplemental mock sessions (legacy list), still filtered by roster age group
  const availableSessions = getUpcomingSessions().filter(s =>
  s.ageGroups.includes(selectedPlayer?.ageGroup ?? '') &&
  s.enrolledCount < s.capacity
  )

  const myBookings = selectedPlayer
  ? getBookingsByPlayer(selectedPlayer.id).filter(b => b.status === 'confirmed' || b.status === 'completed')
  : []

  const handleBook = (id: string) => {
  setBookedIds(prev => new Set([...prev, id]))
  }

  const canBookGridSlot = (slot: ScheduleSlot) =>
  sessionsLeft > 0 &&
  (!!(
  scheduleBand &&
  !!slot.youthBlockId &&
  !!bookableByYouthBlock.get(slot.youthBlockId) &&
  (slot.kind === 'youth_training' || slot.kind === 'preschool') &&
  slot.ageBand === scheduleBand
  ) ||
  slot.kind === 'open_gym')

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

  const handleGridSlotClick = (slot: ScheduleSlot) => {
  if (!canBookGridSlot(slot)) return
  const bookId = resolveGridBookId(slot)
  if (!bookId) return
  setPendingGridEnroll({ id: bookId, prompt: toBookPrompt(slot) })
  }

  const confirmGridEnroll = () => {
  if (!pendingGridEnroll) return
  const bookId = pendingGridEnroll.id
  if (!bookId) return
  handleBook(bookId)
  setPendingGridEnroll(null)
  }

  const formatBandSlotWhen = (dayIndex: DayIndex, startMinute: number) => {
  const sun = new Date(`${generatedWeek.weekStart}T12:00:00`)
  const d = new Date(sun)
  d.setDate(sun.getDate() + dayIndex)
  const h = Math.floor(startMinute / 60)
  const m = startMinute % 60
  d.setHours(h, m, 0, 0)
  return d
  }

  const formatEndMinute = (minute: number) => {
  const h = Math.floor(minute / 60)
  const mm = minute % 60
  const am = h >= 12 ? 'PM' : 'AM'
  const hr = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hr}:${mm.toString().padStart(2, '0')} ${am}`
  }

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
  {roster.map(player => (
  <button
  key={player.id}
  onClick={() => setSelectedPlayerId(player.id)}
  className={cn(
  'flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium border transition-all duration-150',
  selectedPlayerId === player.id
  ? 'border-primary/50 bg-primary/15 text-accent-foreground'
  : 'border-border bg-surface text-text-secondary hover:border-border-bright hover:text-text-primary'
  )}
  >
  <div className={cn('h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold', getAvatarColor(player.id))}>
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
  {([0, 1, 2, 3, 4, 5, 6] as const).map(d => (
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
  isSlotInteractive={canBookGridSlot}
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
  <div className={cn(
  'flex items-center gap-4 rounded-xl border p-4',
  sessionsLeft === 0 ? 'border-error/25 bg-error/5'
  : sessionsLeft <= 2 ? 'border-warning/25 bg-warning/5'
  : 'border-border bg-surface'
  )}>
  <div className="text-center w-14">
  <p className={cn('text-3xl font-black', sessionsLeft === 0 ? 'text-error' : sessionsLeft <= 2 ? 'text-warning' : 'text-success')}>
  {sessionsLeft}
  </p>
  <p className="text-xs text-text-muted">sessions</p>
  </div>
  <div className="flex-1">
  <p className="text-sm font-semibold text-text-primary">
  {sessionsLeft === 0 ? 'No sessions remaining' : `${sessionsLeft} sessions remaining`}
  </p>
  <p className="mt-0.5 text-xs text-text-muted">Session balance in the portal isn&apos;t connected yet — confirm credits at the desk.</p>
  </div>
  {sessionsLeft === 0 && (
  <Button variant="primary" size="sm">Renew Membership</Button>
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
  {bookableSlots.map(slot => {
  const when = formatBandSlotWhen(slot.dayIndex, slot.startMinute)
  const isBooked = bookedIds.has(slot.id)
  const spotsLeft = slot.capacity - slot.enrolled
  const almostFull = spotsLeft <= 4
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
  <p className="text-xs text-text-muted">1 session credit</p>
  <Button
  variant="primary"
  size="sm"
  onClick={() => handleBook(slot.id)}
  disabled={sessionsLeft === 0}
  >
  Enroll
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
  {availableSessions.map(session => {
  const isBooked = bookedIds.has(session.id) || myBookings.some(b => b.sessionId === session.id)
  const spotsLeft = session.capacity - session.enrolledCount
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
  onClick={() => handleBook(session.id)}
  disabled={sessionsLeft === 0}
  >
  Book
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
  {myBookings.length === 0 ? (
  <EmptyState icon={<BookOpen />} title="No bookings yet" compact />
  ) : (
  <div className="space-y-2">
  {myBookings.map(booking => {
  const session = getSessionById(booking.sessionId)
  return (
  <div key={booking.id} className="rounded-lg border border-border bg-surface p-3 space-y-1.5">
  <p className="text-sm font-medium text-text-primary truncate">{session?.title ?? 'Session'}</p>
  {session && (
  <p className="text-xs text-text-muted">
  {new Date(session.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
  {' at '}
  {new Date(session.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
  </p>
  )}
  <StatusPill status={booking.status} />
  </div>
  )
  })}
  </div>
  )}
  </div>
  </div>
  )}
  </div>
  <Modal
  open={pendingGridEnroll != null}
  onClose={() => setPendingGridEnroll(null)}
  title="Confirm enrollment"
  size="sm"
  >
  <ModalBody>
  <p className="text-sm font-medium text-text-primary">{pendingGridEnroll?.prompt}</p>
  <p className="mt-1 text-xs text-text-muted">This uses one session credit for the selected athlete.</p>
  </ModalBody>
  <ModalFooter>
  <Button variant="ghost" size="sm" onClick={() => setPendingGridEnroll(null)}>
  Cancel
  </Button>
  <Button variant="primary" size="sm" onClick={confirmGridEnroll} disabled={sessionsLeft === 0}>
  Enroll now
  </Button>
  </ModalFooter>
  </Modal>
  </PageContainer>
  )
}
