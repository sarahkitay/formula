'use client'

import * as React from 'react'
import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { CoachGuardrailsStrip } from '@/components/coach/coach-guardrails'
import { coachGuardrails, coachSessionsToday } from '@/lib/mock-data/coach-operating'
import { mockPlayers } from '@/lib/mock-data/players'
import { cn } from '@/lib/utils'

type Mark = 'present' | 'late' | 'absent'

export default function CoachCheckInPage() {
  const session = coachSessionsToday.find(s => s.status === 'in-progress') ?? coachSessionsToday[1]
  const roster = mockPlayers.filter(p => p.groupIds?.includes('group-2')).slice(0, 12)
  const [marks, setMarks] = React.useState<Record<string, Mark>>(() =>
    Object.fromEntries(roster.map((p, i) => [p.id, i < 10 ? 'present' : 'late'] as const))
  )

  const setMark = (id: string, m: Mark) => {
    setMarks(prev => ({ ...prev, [id]: m }))
  }

  const present = Object.values(marks).filter(m => m === 'present').length
  const cap = session.capacity

  return (
    <PageContainer fullWidth>
      <div className="space-y-5">
        <PageHeader
          title="Check-in"
          subtitle={`${session.title} · fast roster · ${present}/${cap} toward capacity`}
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
          Waitlist / no-shows surface here when connected to admin roster. Parent contact flag: tap athlete row (demo).
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
