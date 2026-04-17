'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { CoachGuardrailsStrip } from '@/components/coach/coach-guardrails'
import { coachGuardrails, fpiDomains } from '@/lib/mock-data/coach-operating'
import type { Player } from '@/types'

function CoachObservationsInner() {
  const sp = useSearchParams()
  const pre = sp.get('playerId')
  const [roster, setRoster] = React.useState<Player[]>([])
  const [playerId, setPlayerId] = React.useState(pre ?? '')
  const [scores, setScores] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(fpiDomains.map(d => [d, '']))
  )
  const [notes, setNotes] = React.useState('')

  React.useEffect(() => {
    let cancelled = false
    void fetch('/api/facility/players')
      .then(r => r.json() as Promise<{ players?: Player[] }>)
      .then(body => {
        if (cancelled) return
        const list = body.players ?? []
        setRoster(list)
        if (pre && list.some(p => p.id === pre)) {
          setPlayerId(pre)
        } else if (list[0]) {
          setPlayerId(cur => (cur && list.some(p => p.id === cur) ? cur : list[0]!.id))
        }
      })
      .catch(() => {
        if (!cancelled) setRoster([])
      })
    return () => {
      cancelled = true
    }
  }, [pre])

  React.useEffect(() => {
    if (pre) setPlayerId(pre)
  }, [pre])

  return (
    <PageContainer fullWidth>
      <div className="space-y-6">
        <PageHeader
          title="FPI observations"
          subtitle="Internal coaching intelligence · qualitative + rubric · not a public ranking"
          actions={
            <Link href="/coach/today">
              <Button variant="ghost" size="sm">
                Today
              </Button>
            </Link>
          }
        />

        <CoachGuardrailsStrip items={coachGuardrails.slice(2, 4)} />

        <div className="grid gap-4 border border-white/10 bg-[#0f0f0f] p-4 md:grid-cols-2">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">Athlete</label>
            <select
              value={playerId}
              onChange={e => setPlayerId(e.target.value)}
              className="mt-1 w-full border border-white/10 bg-black/40 px-3 py-2 font-mono text-[13px] text-zinc-200"
            >
              {roster.length === 0 ? (
                <option value="">No roster loaded</option>
              ) : (
                roster.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} · {p.ageGroup}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">Context</label>
            <p className="mt-2 font-mono text-[11px] text-zinc-400">
              Youth block · station rotation · clinic (save to athlete record not wired)
            </p>
          </div>
        </div>

        <div className="border border-white/10 bg-[#0f0f0f] p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Domain rubric (1–5 internal)</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fpiDomains.map(d => (
              <div key={d}>
                <label className="font-mono text-[10px] text-zinc-500">{d}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="-"
                  value={scores[d]}
                  onChange={e => setScores(s => ({ ...s, [d]: e.target.value }))}
                  className="mt-1 w-full border border-white/10 bg-black/30 px-2 py-1.5 font-mono text-[13px] text-zinc-200"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border border-white/10 bg-[#0f0f0f] p-5">
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Qualitative notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-2 font-mono text-[13px] text-zinc-200"
            placeholder="Development priorities · clinic recommendation · Friday competitive notes…"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm" type="button" disabled>
            Save (sync TBD)
          </Button>
          <Button variant="secondary" size="sm" type="button" disabled>
            Attach to athlete record
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}

export default function CoachObservationsPage() {
  return (
    <Suspense
      fallback={
        <PageContainer fullWidth>
          <p className="font-mono text-[12px] text-zinc-500">Loading observations…</p>
        </PageContainer>
      }
    >
      <CoachObservationsInner />
    </Suspense>
  )
}
