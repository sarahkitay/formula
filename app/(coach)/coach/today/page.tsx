import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { CountUp } from '@/components/ui/count-up'
import { Button } from '@/components/ui/button'
import { StatusPill } from '@/components/ui/badge'
import { CoachGuardrailsStrip } from '@/components/coach/coach-guardrails'
import {
  COACH_DEMO_NAME,
  coachAlerts,
  coachGuardrails,
  coachSessionsToday,
  assignedFloorSection,
} from '@/lib/mock-data/coach-operating'
import { SITE } from '@/lib/site-config'
import { ChevronRight, AlertTriangle } from 'lucide-react'

export default function CoachTodayPage() {
  const current = coachSessionsToday.find(s => s.status === 'in-progress')
  const upcoming = coachSessionsToday.filter(s => s.status === 'scheduled')
  const checkInTotal = coachSessionsToday.reduce((a, s) => a + s.checkedIn, 0)
  const enrolledTotal = coachSessionsToday.reduce((a, s) => a + s.enrolled, 0)

  return (
  <PageContainer fullWidth>
  <div className="space-y-6">
  <PageHeader
  title="Today"
  subtitle={`${SITE.facilityName} · ${COACH_DEMO_NAME} · execution view`}
  actions={
  <Link href="/coach/check-in">
  <Button variant="primary" size="sm" leftIcon={<ChevronRight className="h-3 w-3 rotate-[-90deg]" strokeWidth={2} />}>
  Check-in
  </Button>
  </Link>
  }
  />

  <CoachGuardrailsStrip items={coachGuardrails} />

  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
  <StatCard
  label="Live block"
  value={current ? current.title.split('·')[0] : '-'}
  sublabel={current ? `${current.startTime}–${current.endTime}` : 'No sessions in progress'}
  accent
  href="/coach/block"
  />
  <StatCard
  label="Your floor"
  value={`Field ${assignedFloorSection}`}
  sublabel="Assignment"
  href="/coach/floor"
  />
  <StatCard
  label="Check-ins (today)"
  value={<CountUp end={checkInTotal} format="integer" />}
  sublabel={`of ${enrolledTotal} enrolled (demo)`}
  href="/coach/check-in"
  />
  <StatCard
  label="Alerts"
  value={<CountUp end={coachAlerts.length} format="integer" />}
  dataModule="alerts"
  href="/coach/observations"
  />
  </div>

  <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
  <div className="border border-amber-500/20 bg-amber-500/5 p-4 lg:col-span-1">
  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-500/80">Quick alerts</p>
  <ul className="mt-3 space-y-2">
  {coachAlerts.map(a => (
  <li key={a.id} className="flex gap-2 font-mono text-[11px] text-zinc-300">
  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500/90" />
  {a.message}
  </li>
  ))}
  </ul>
  </div>

  <div className="border border-white/10 bg-[#0f0f0f] p-4 lg:col-span-3">
  <div className="flex flex-wrap items-center justify-between gap-2">
  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Sessions · today</p>
  <Link href="/coach/groups" className="font-mono text-[10px] text-zinc-500 underline decoration-white/20">
  Rosters
  </Link>
  </div>
  <div className="mt-3 space-y-2">
  {coachSessionsToday.map(s => (
  <Link
  key={s.sessionId}
  href={`/coach/sessions/${s.sessionId}`}
  className="flex flex-wrap items-center justify-between gap-3 border border-white/[0.06] bg-black/20 px-3 py-2.5 text-inherit no-underline transition-colors hover:border-white/15"
  >
  <div className="min-w-0">
  <p className="truncate text-[13px] font-medium text-zinc-100">{s.title}</p>
  <p className="truncate font-mono text-[11px] text-zinc-500">
  {s.startTime}–{s.endTime} · {s.ageLabel} · {s.fieldName}
  </p>
  </div>
  <div className="flex shrink-0 items-center gap-3">
  <span className="font-mono text-[11px] tabular-nums text-zinc-400">
  {s.checkedIn}/{s.enrolled}
  </span>
  <StatusPill status={s.status === 'in-progress' ? 'in-progress' : s.status} />
  </div>
  </Link>
  ))}
  </div>
  </div>
  </div>

  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
  <Link
  href="/coach/floor"
  className="border border-white/10 bg-[#0f0f0f] p-4 text-inherit no-underline hover:border-white/20"
  >
  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Floor map</p>
  <p className="mt-2 text-[13px] text-zinc-200">Open live map →</p>
  </Link>
  <Link
  href="/coach/block"
  className="border border-white/10 bg-[#0f0f0f] p-4 text-inherit no-underline hover:border-white/20"
  >
  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Youth block</p>
  <p className="mt-2 text-[13px] text-zinc-200">Station timer + rotation →</p>
  </Link>
  <Link
  href="/coach/friday"
  className="border border-white/10 bg-[#0f0f0f] p-4 text-inherit no-underline hover:border-white/20"
  >
  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Friday circuit</p>
  <p className="mt-2 text-[13px] text-zinc-200">Game-night tools →</p>
  </Link>
  </div>
  </div>
  </PageContainer>
  )
}
