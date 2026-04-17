'use client'

import * as React from 'react'
import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { CoachGuardrailsStrip } from '@/components/coach/coach-guardrails'
import { coachGuardrails, coachSessionsToday } from '@/lib/mock-data/coach-operating'
import { cn } from '@/lib/utils'
import type { Player } from '@/types'

type Mark = 'present' | 'late' | 'absent'

export default function CoachCheckInPage() {
  const session =
    coachSessionsToday.find(s => s.status === 'in-progress') ?? coachSessionsToday[0] ?? undefined
  const cap = session?.capacity ?? 0
  const sessionTitle = session?.title ?? 'No live block linked'

  const [roster, setRoster] = React.useState<Player[]>([])
  React.useEffect(() => {
    let cancelled = false
    void fetch('/api/facility/players')
      .then(r => r.json() as Promise<{ players?: Player[] }>)
      .then(body => {
        if (!cancelled) setRoster(body.players ?? [])
      })
      .catch(() => {
        if (!cancelled) setRoster([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const [marks, setMarks] = React.useState<Record<string, Mark>>({})
  React.useEffect(() => {
    setMarks(prev => {
      const next = { ...prev }
      for (const p of roster) {
        if (next[p.id] == null) next[p.id] = 'present'
      }
      return next
    })
  }, [roster])

  const setMark = (id: string, m: Mark) => {
    setMarks(prev => ({ ...prev, [id]: m }))
  }

  const present = roster.filter(p => marks[p.id] === 'present').length

  return (
    <PageContainer fullWidth>
      <div className="space-y-5">
        <PageHeader
          title="Check-in"
          subtitle={`${sessionTitle} · fast roster · ${cap > 0 ? `${present}/${cap} toward capacity` : 'capacity when block is linked'}`}
          actions={
            <Link href="/coach/today">
              <Button variant="ghost" size="sm">
                Today
              </Button>
            </Link>
          }
        />

        <CoachGuardrailsStrip items={coachGuardrails.slice(0, 3)} />

        <div className="border border-white/10 bg-[#0f0f0f] p-4 font-mono text-[11px] text-zinc-400">
          Roster loads from Supabase <code className="text-zinc-300">players</code>. Waitlist / no-shows surface here when bookings are wired.
        </div>

        <div className="overflow-x-auto border border-white/10">
          <table className="w-full min-w-[640px] border-collapse text-left font-mono text-[12px]">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-zinc-500">
                <th className="px-3 py-2">Athlete</th>
                <th className="px-3 py-2">Present</th>
                <th className="px-3 py-2">Late</th>
                <th className="px-3 py-2">Absent</th>
                <th className="px-3 py-2">Flag</th>
              </tr>
            </thead>
            <tbody>
              {roster.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-zinc-500">
                    No athletes in roster yet, or Supabase is not configured.
                  </td>
                </tr>
              )}
              {roster.map(p => {
                const m = marks[p.id] ?? 'present'
                return (
                  <tr key={p.id} className="border-b border-white/[0.06] text-zinc-200">
                    <td className="px-3 py-2">
                      {p.firstName} {p.lastName}
                      <span className="ml-2 text-zinc-500">{p.ageGroup}</span>
                    </td>
                    {(['present', 'late', 'absent'] as const).map(k => (
                      <td key={k} className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => setMark(p.id, k)}
                          className={cn(
                            'h-7 min-w-[72px] border px-2 text-[11px] uppercase',
                            m === k ? 'border-[#f4fe00] bg-[#f4fe00]/10 text-zinc-100' : 'border-white/10 text-zinc-500'
                          )}
                        >
                          {k}
                        </button>
                      </td>
                    ))}
                    <td className="px-3 py-2">
                      <button type="button" className="text-[10px] text-zinc-500 underline decoration-white/20">
                        Contact
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  )
}
