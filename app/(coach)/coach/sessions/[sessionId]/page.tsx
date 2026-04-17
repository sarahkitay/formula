import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { AdminMonoTable } from '@/components/admin/admin-panel'
import { sessionDetailById, coachSessionsToday } from '@/lib/mock-data/coach-operating'
import { getPlayersByIds } from '@/lib/facility/players-by-ids-server'
import { ChevronLeft } from 'lucide-react'

export default async function CoachSessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await params
  const summary = coachSessionsToday.find(s => s.sessionId === sessionId)
  const detail = sessionDetailById[sessionId]

  if (!summary) {
    return (
      <PageContainer fullWidth>
        <div className="space-y-4">
          <Link
            href="/coach/today"
            className="inline-flex items-center gap-1 font-mono text-[11px] text-formula-mist hover:text-formula-paper"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Today
          </Link>
          <PageHeader
            title="Session"
            subtitle="No live session is linked to this ID yet. Coach sessions will appear when schedule data is connected."
          />
          <Link href="/coach/today">
            <Button variant="secondary" size="sm">
              Back to today
            </Button>
          </Link>
        </div>
      </PageContainer>
    )
  }

  const athleteIds = detail?.groups.flatMap(g => g.athleteIds) ?? []
  const roster = athleteIds.length > 0 ? await getPlayersByIds(athleteIds) : []

  return (
    <PageContainer fullWidth>
      <div className="space-y-6">
        <Link
          href="/coach/today"
          className="inline-flex items-center gap-1 font-mono text-[11px] text-formula-mist hover:text-formula-paper"
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

        <div className="grid grid-cols-1 gap-4 border border-formula-frost/12 bg-formula-paper/[0.04] p-4 font-mono text-[11px] text-formula-frost/90 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)] md:grid-cols-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-formula-mist">Schedule</p>
            <p className="mt-1 text-formula-paper">
              {summary.startTime} – {summary.endTime}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-formula-mist">Capacity</p>
            <p className="mt-1 text-formula-paper">
              {summary.checkedIn}/{summary.enrolled} checked · cap {summary.capacity}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-formula-mist">Assets</p>
            <p className="mt-1 text-formula-paper">{summary.fieldName}</p>
          </div>
        </div>

        {detail && (
          <>
            <div className="border border-formula-frost/12 bg-formula-paper/[0.04] p-5 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-formula-mist">Station plan</p>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-[12px] text-formula-paper">{detail.stationPlan.station1.label}</p>
                  <p className="mt-1 text-[11px] text-formula-mist">{detail.stationPlan.station1.focus}</p>
                </div>
                <div>
                  <p className="text-[12px] text-formula-paper">{detail.stationPlan.station2.label}</p>
                  <p className="mt-1 text-[11px] text-formula-mist">{detail.stationPlan.station2.focus}</p>
                </div>
              </div>
              <p className="mt-3 font-mono text-[10px] text-formula-mist">
                Transition {detail.stationPlan.transitionMin}m · buffer protected after block
              </p>
            </div>

            <div className="border border-formula-frost/12 bg-formula-paper/[0.04] p-5 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-formula-mist">Session notes</p>
              <p className="mt-2 text-[13px] leading-relaxed text-formula-frost/90">{detail.notes}</p>
              {detail.substitutions.length > 0 && (
                <ul className="mt-3 list-disc pl-5 text-[12px] text-formula-mist">
                  {detail.substitutions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border border-formula-frost/12 bg-formula-paper/[0.04] p-5 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-formula-mist">Group split</p>
              <AdminMonoTable
                headers={['Group', 'Athletes', 'St 1', 'St 2']}
                rows={detail.groups.map(g => [g.label, g.athleteIds.length, g.station1, g.station2])}
              />
            </div>
          </>
        )}

        <div className="border border-formula-frost/12 bg-formula-paper/[0.04] p-5 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-formula-mist">Athlete roster</p>
          {roster.length === 0 ? (
            <p className="mt-3 text-sm text-formula-mist">No roster rows for this session.</p>
          ) : (
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {roster.map(p => (
                <Link
                  key={p.id}
                  href={`/coach/performance/${p.id}`}
                  className="border border-formula-frost/12 px-3 py-2 text-[13px] text-formula-paper no-underline hover:border-formula-volt/35"
                >
                  {p.firstName} {p.lastName}
                  <span className="ml-2 font-mono text-[10px] text-formula-mist">{p.ageGroup}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
