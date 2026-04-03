import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { AdminMonoTable } from '@/components/admin/admin-panel'
import { sessionDetailById, coachSessionsToday } from '@/lib/mock-data/coach-operating'
import { mockPlayers } from '@/lib/mock-data/players'
import { ChevronLeft } from 'lucide-react'

export default async function CoachSessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await params
  const summary = coachSessionsToday.find(s => s.sessionId === sessionId)
  const detail = sessionDetailById[sessionId]
  if (!summary) notFound()

  const roster = mockPlayers.filter(p => detail?.groups.flatMap(g => g.athleteIds).includes(p.id) ?? false)

  return (
    <PageContainer fullWidth>
      <div className="space-y-6">
        <Link
          href="/coach/today"
          className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-400 hover:text-zinc-200"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Today
        </Link>

        <PageHeader
          title={summary.title}
          subtitle={`${summary.ageLabel} · ${summary.programType} · ${summary.fieldName}`}
          actions={
            <div className="flex flex-wrap gap-2">
              <Link href="/coach/block">
                <Button variant="primary" size="sm">
                  Youth block timer
                </Button>
              </Link>
              <Link href="/coach/check-in">
                <Button variant="secondary" size="sm">
                  Check-in
                </Button>
              </Link>
            </div>
          }
        />

        <div className="grid grid-cols-1 gap-4 border border-white/10 bg-[#0f0f0f] p-4 font-mono text-[11px] text-zinc-300 md:grid-cols-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Schedule</p>
            <p className="mt-1">
              {summary.startTime} – {summary.endTime}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Capacity</p>
            <p className="mt-1">
              {summary.checkedIn}/{summary.enrolled} checked · cap {summary.capacity}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Assets</p>
            <p className="mt-1">{summary.fieldName}</p>
          </div>
        </div>

        {detail && (
          <>
            <div className="border border-white/10 bg-[#0f0f0f] p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Station plan</p>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-[12px] text-zinc-100">{detail.stationPlan.station1.label}</p>
                  <p className="mt-1 text-[11px] text-zinc-400">{detail.stationPlan.station1.focus}</p>
                </div>
                <div>
                  <p className="text-[12px] text-zinc-100">{detail.stationPlan.station2.label}</p>
                  <p className="mt-1 text-[11px] text-zinc-400">{detail.stationPlan.station2.focus}</p>
                </div>
              </div>
              <p className="mt-3 font-mono text-[10px] text-zinc-500">
                Transition {detail.stationPlan.transitionMin}m · buffer protected after block
              </p>
            </div>

            <div className="border border-white/10 bg-[#0f0f0f] p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Session notes</p>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-300">{detail.notes}</p>
              {detail.substitutions.length > 0 && (
                <ul className="mt-3 list-disc pl-5 text-[12px] text-zinc-400">
                  {detail.substitutions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border border-white/10 bg-[#0f0f0f] p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Group split</p>
              <AdminMonoTable
                headers={['Group', 'Athletes', 'St 1', 'St 2']}
                rows={detail.groups.map(g => [
                  g.label,
                  g.athleteIds.length,
                  g.station1,
                  g.station2,
                ])}
              />
            </div>
          </>
        )}

        <div className="border border-white/10 bg-[#0f0f0f] p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Athlete roster</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {roster.map(p => (
              <Link
                key={p.id}
                href={`/coach/performance/${p.id}`}
                className="border border-white/[0.06] px-3 py-2 text-[13px] text-zinc-200 no-underline hover:border-white/15"
              >
                {p.firstName} {p.lastName}
                <span className="ml-2 font-mono text-[10px] text-zinc-500">{p.ageGroup}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
