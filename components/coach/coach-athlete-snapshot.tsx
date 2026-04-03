import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { AthleteCoachSnapshot } from '@/lib/mock-data/coach-operating'
import { Button } from '@/components/ui/button'

export function CoachAthleteSnapshot({
  snapshot,
  playerId,
}: {
  snapshot: AthleteCoachSnapshot
  playerId: string
}) {
  return (
    <div className="space-y-4 border border-white/10 bg-[#0f0f0f] p-5">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Coach snapshot · internal</p>
      <div className="grid gap-4 gap-x-8 md:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] text-zinc-500">Attendance trend</p>
          <p className="mt-1 text-[13px] text-zinc-200">{snapshot.attendanceTrend}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] text-zinc-500">Membership</p>
          <p className="mt-1 text-[13px] text-zinc-200">{snapshot.membershipTier}</p>
        </div>
        <div className="md:col-span-2">
          <p className="font-mono text-[10px] text-zinc-500">FPI summary (staff)</p>
          <p className="mt-1 text-[13px] text-zinc-200">{snapshot.fpiSummary}</p>
        </div>
        <div className="md:col-span-2">
          <p className="font-mono text-[10px] text-zinc-500">Top development priorities</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-[13px] text-zinc-300">
            {snapshot.priorities.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
        </div>
        <div>
          <p className="font-mono text-[10px] text-zinc-500">Recent coach notes</p>
          <ul className="mt-2 space-y-1">
            {snapshot.recentNotes.map((n, i) => (
              <li key={i} className="text-[12px] text-zinc-400">
                {n}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] text-zinc-500">Clinics / Friday</p>
          <p className="mt-1 text-[12px] text-zinc-400">{snapshot.clinicsRecent}</p>
          <p className="mt-1 text-[12px] text-zinc-400">{snapshot.fridayRecent}</p>
        </div>
        <div className="md:col-span-2">
          <p className="font-mono text-[10px] text-zinc-500">Suggested emphasis (next block)</p>
          <p className="mt-1 text-[13px] text-zinc-100">{snapshot.suggestedEmphasis}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <Link href={`/coach/observations?playerId=${playerId}`}>
          <Button variant="primary" size="sm">
            Log FPI observation
          </Button>
        </Link>
        <Link href="/coach/notes">
          <Button variant="secondary" size="sm" rightIcon={<ChevronRight className="h-3 w-3" strokeWidth={2} />}>
            Notes
          </Button>
        </Link>
      </div>
    </div>
  )
}
