import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { ModuleBlock } from '@/components/dashboard/module-block'
import { parentNav } from '@/lib/nav/parent'
import { getPaymentsByPlayer } from '@/lib/mock-data/payments'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { CountUp } from '@/components/ui/count-up'
import { SectionHeader } from '@/components/ui/section-header'
import { Button } from '@/components/ui/button'
import { StatusPill } from '@/components/ui/badge'
import { mockPlayers } from '@/lib/mock-data/players'
import { getMembershipByPlayer } from '@/lib/mock-data/memberships'
import { getBookingsByPlayer } from '@/lib/mock-data/bookings'
import { getSessionById } from '@/lib/mock-data/sessions'
import { formatDate, getInitials, getAvatarColor, cn } from '@/lib/utils'
import { ParentDashboardSubtitle } from '@/components/parent/parent-dashboard-subtitle'
import { ParentSoftBanner } from '@/components/parent/parent-panel'
import {
  buildParentRecommendedActions,
  parentAttendanceSnapshot,
  parentUpcomingEvents,
  parentProgressUpdates,
} from '@/lib/mock-data/parent-portal'

// Demo: parent-6 has Liam & Zoe
const PARENT_PLAYER_IDS = ['player-6', 'player-7']
const myPlayers = mockPlayers.filter(p => PARENT_PLAYER_IDS.includes(p.id))

const PARENT_ID = 'parent-6'

export default function ParentDashboardPage() {
  const recommendedActions = buildParentRecommendedActions(
    myPlayers.map(p => ({ id: p.id, firstName: p.firstName }))
  )
  const upcomingBookings = myPlayers.flatMap(p => {
  const bookings = getBookingsByPlayer(p.id).filter(b => b.status === 'confirmed')
  return bookings.map(b => ({ ...b, player: p }))
  }).slice(0, 4)

  const creditsTotal = myPlayers.reduce((s, p) => s + p.sessionsRemaining, 0)
  const totalSessionsAttended = myPlayers.reduce((s, p) => s + p.totalSessionsAttended, 0)
  const paymentRows = myPlayers.flatMap(p => getPaymentsByPlayer(p.id))

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
  { label: 'Upcoming', value: upcomingBookings.length },
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
  { label: 'Low credits', value: myPlayers.filter(p => p.sessionsRemaining <= 2).length },
  { label: 'Docs', value: 'OK' },
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
  { label: 'Confirmed', value: upcomingBookings.length, highlight: 'green' },
  { label: 'Capacity', value: 'CLEAR' },
  { label: 'Next', value: upcomingBookings[0] ? 'BOOKED' : 'N/A' },
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
  { label: 'Active plans', value: myPlayers.length },
  { label: 'Renewal', value: 'AUTO' },
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
  { label: 'Last', value: paymentRows[0] ? 'PAID' : 'N/A' },
  { label: 'Acct', value: PARENT_ID.split('-')[1]?.toUpperCase() ?? 'N/A' },
  ]}
  />
  )
  }
  if (item.href === '/parent/progress') {
  const withPerf = myPlayers.filter(p => p.performance)
  const avgTech =
  withPerf.length > 0
  ? Math.round(
  withPerf.reduce((s, p) => s + (p.performance?.technicalScore ?? 0), 0) / withPerf.length
  )
  : 0
  return (
  <ModuleBlock
  key={item.href}
  id={id}
  surface="portal"
  title={item.label}
  summary={item.description ?? ''}
  href={item.href}
  dataPoints={[
  { label: 'Avg technical', value: `${avgTech}%`, highlight: 'green' },
  { label: 'Notes', value: 'VISIBLE' },
  { label: 'Lab', value: 'TBD' },
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
  { label: 'Next', value: 'Apr' },
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
  { label: 'This week', value: '4' },
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
  {recommendedActions.map(a => (
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
  <p className="mt-1 text-sm text-formula-frost/70">{parentAttendanceSnapshot.streakWeeks} week consistency streak</p>
  <Link href="/parent/progress" className="mt-4 inline-block text-sm font-medium text-formula-volt hover:underline">
  View progress
  </Link>
  </div>
  </div>

  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {parentUpcomingEvents.map(ev => (
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

  <div className="rounded-sm border border-formula-frost/12 bg-formula-paper/[0.04] p-5 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-formula-mist">Recent progress notes</p>
  <div className="mt-4 space-y-4">
  {parentProgressUpdates.map((u, i) => {
  const pl = myPlayers.find(p => p.id === u.playerId)
  return (
  <div key={i} className="border-b border-formula-frost/10 pb-4 last:border-0 last:pb-0">
  <p className="text-xs font-medium text-formula-mist">
  {pl?.firstName ?? 'Athlete'} · {new Date(u.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
  </p>
  <p className="mt-1 text-sm text-formula-frost/80">{u.summary}</p>
  </div>
  )
  })}
  </div>
  </div>

  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{parentModules}</div>

  {/* Stats */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard label="My Players" value={<CountUp end={myPlayers.length} format="integer" />} accent href="/parent/players" />
  <StatCard
  label="Sessions Remaining"
  value={<CountUp end={creditsTotal} format="integer" />}
  sublabel="across all memberships"
  href="/parent/memberships"
  />
  <StatCard
  label="Upcoming Bookings"
  value={<CountUp end={upcomingBookings.length} format="integer" />}
  href="/parent/bookings"
  />
  <StatCard
  label="Total Sessions"
  value={<CountUp end={totalSessionsAttended} format="integer" />}
  sublabel="attended"
  href="/parent/progress"
  />
  </div>

  {/* Player cards */}
  <div className="space-y-4">
  <SectionHeader
  title="My Players"
  action={<Link href="/parent/players"><Button variant="ghost" size="sm">View all <ChevronRight className="h-3 w-3" /></Button></Link>}
  />
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {myPlayers.map(player => {
  const mem = getMembershipByPlayer(player.id)
  return (
  <Link
  key={player.id}
  href={`/parent/progress/${player.id}`}
  className="block rounded-xl border border-border bg-surface p-5 space-y-4 text-inherit no-underline transition-colors hover:border-border-bright hover:bg-surface-raised/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005700]"
  >
  <div className="flex items-center gap-3">
  <div className={cn('h-11 w-11 rounded-full flex items-center justify-center text-sm font-bold', getAvatarColor(player.id))}>
  {getInitials(player.firstName, player.lastName)}
  </div>
  <div className="flex-1 min-w-0">
  <p className="font-bold text-text-primary">{player.firstName} {player.lastName}</p>
  <p className="text-xs text-text-muted">{player.ageGroup} · #{player.jerseyNumber} · {player.position}</p>
  </div>
  <StatusPill status={player.status} />
  </div>

  {mem && (
  <div className="space-y-2">
  <div className="flex items-center justify-between text-sm">
  <span className="text-text-secondary">{mem.planName}</span>
  <span className={cn('font-bold', player.sessionsRemaining === 0 ? 'text-error' : player.sessionsRemaining <= 2 ? 'text-warning' : 'text-success')}>
  {player.sessionsRemaining} left
  </span>
  </div>
  <div className="h-1.5 bg-surface-raised rounded-full overflow-hidden">
  <div
  className={cn('h-full rounded-full', player.sessionsRemaining === 0 ? 'bg-error' : player.sessionsRemaining <= 2 ? 'bg-warning' : 'bg-primary')}
  style={{ width: typeof mem.sessionsTotal === 'number' ? `${(player.sessionsRemaining / mem.sessionsTotal) * 100}%` : '100%' }}
  />
  </div>
  <p className="text-xs text-text-muted">Expires {formatDate(mem.expiryDate)}</p>
  </div>
  )}

  <p className="text-center text-xs text-text-muted">
  Use Book a Session in the header or open the Bookings tab to reserve time.
  </p>
  </Link>
  )
  })}
  </div>
  </div>

  {/* Upcoming bookings */}
  <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
  <SectionHeader
  title="Upcoming Bookings"
  action={<Link href="/parent/bookings"><Button variant="ghost" size="sm">Manage <ChevronRight className="h-3 w-3" /></Button></Link>}
  />
  {upcomingBookings.length === 0 ? (
  <p className="text-sm text-text-muted text-center py-4">No upcoming bookings. <Link href="/parent/bookings" className="text-accent-foreground hover:opacity-90">Book a session</Link></p>
  ) : (
  <div className="space-y-2">
  {upcomingBookings.map(booking => {
  const session = getSessionById(booking.sessionId)
  return (
  <Link
  key={booking.id}
  href="/parent/bookings"
  className="flex items-center gap-3 rounded-lg border border-border bg-surface-raised px-3 py-2.5 text-inherit no-underline transition-colors hover:border-border-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005700]"
  >
  <div className={cn('h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0', getAvatarColor(booking.player.id))}>
  {getInitials(booking.player.firstName, booking.player.lastName)}
  </div>
  <div className="flex-1 min-w-0">
  <p className="text-sm font-medium text-text-primary truncate">
  {booking.player.firstName} · {session?.title ?? 'Session'}
  </p>
  <p className="text-xs text-text-muted">{session ? new Date(session.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' · ' + new Date(session.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : ''}</p>
  </div>
  <StatusPill status={booking.status} />
  </Link>
  )
  })}
  </div>
  )}
  </div>
  </div>
  </PageContainer>
  )
}
