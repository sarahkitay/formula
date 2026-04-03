'use client'

import * as React from 'react'
import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { YOUTH_BLOCK_MODEL } from '@/lib/mock-data/coach-operating'

type Phase = 's1' | 'transition' | 's2' | 'done'

function nextPhase(p: Phase): Phase {
  if (p === 's1') return 'transition'
  if (p === 'transition') return 's2'
  if (p === 's2') return 'done'
  return 'done'
}

function secondsForPhase(p: Phase): number {
  if (p === 's1') return YOUTH_BLOCK_MODEL.station1Min * 60
  if (p === 'transition') return YOUTH_BLOCK_MODEL.transitionMin * 60
  if (p === 's2') return YOUTH_BLOCK_MODEL.station2Min * 60
  return 0
}

type TimerState = { phase: Phase; seconds: number }

function timerReducer(state: TimerState, action: { type: 'tick' }): TimerState {
  if (action.type !== 'tick') return state
  if (state.phase === 'done') return state
  if (state.seconds > 1) return { ...state, seconds: state.seconds - 1 }
  const next = nextPhase(state.phase)
  if (next === 'done') return { phase: 'done', seconds: 0 }
  return { phase: next, seconds: secondsForPhase(next) }
}

export default function CoachYouthBlockPage() {
  const [state, dispatch] = React.useReducer(timerReducer, {
  phase: 's1',
  seconds: secondsForPhase('s1'),
  })

  React.useEffect(() => {
  const id = window.setInterval(() => dispatch({ type: 'tick' }), 1000)
  return () => window.clearInterval(id)
  }, [])

  const mm = Math.floor(state.seconds / 60)
  const ss = state.seconds % 60

  const phaseLabel =
  state.phase === 's1'
  ? 'Station 1'
  : state.phase === 'transition'
  ? 'Transition'
  : state.phase === 's2'
  ? 'Station 2'
  : 'Block complete'

  return (
  <PageContainer fullWidth>
  <div className="space-y-6">
  <PageHeader
  title="Youth block execution"
  subtitle={`${YOUTH_BLOCK_MODEL.blockMinutes}m block · ${YOUTH_BLOCK_MODEL.station1Min}+${YOUTH_BLOCK_MODEL.transitionMin}+${YOUTH_BLOCK_MODEL.station2Min} · ${YOUTH_BLOCK_MODEL.athletesPerBlock} athletes · ${YOUTH_BLOCK_MODEL.stationsActive} stations active`}
  actions={
  <Link href="/coach/today">
  <Button variant="ghost" size="sm">
  Today
  </Button>
  </Link>
  }
  />

  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
  <div className="border border-[#f4fe00]/30 bg-black/40 p-6 lg:col-span-2">
  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">{phaseLabel}</p>
  <p className="mt-4 font-mono text-5xl tabular-nums text-zinc-100 sm:text-6xl">
  {state.phase === 'done' ? '00:00' : `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`}
  </p>
  <p className="mt-4 font-mono text-[11px] text-zinc-500">
  Phase timer (demo) · sync with floor rotation
  </p>
  {state.phase === 'done' && (
  <p className="mt-4 font-mono text-[12px] text-emerald-500/90">Protected reset buffer - hand off on schedule.</p>
  )}
  </div>
  <div className="space-y-3 border border-white/10 bg-[#0f0f0f] p-4 font-mono text-[11px] text-zinc-400">
  <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Model</p>
  <p>
  Groups {YOUTH_BLOCK_MODEL.groupSizeMin}–{YOUTH_BLOCK_MODEL.groupSizeMax} · no overcrowding
  </p>
  <p className="pt-2 text-[9px] uppercase tracking-[0.2em] text-zinc-500">Sequence</p>
  <ol className="list-decimal pl-4">
  <li>Station 1 · {YOUTH_BLOCK_MODEL.station1Min}m</li>
  <li>Transition · {YOUTH_BLOCK_MODEL.transitionMin}m</li>
  <li>Station 2 · {YOUTH_BLOCK_MODEL.station2Min}m</li>
  </ol>
  </div>
  </div>

  <div className="border border-white/10 bg-[#0f0f0f] p-4">
  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Completion</p>
  <ul className="mt-2 grid gap-1 font-mono text-[11px] text-zinc-400 sm:grid-cols-2">
  <li>· Station objectives noted</li>
  <li>· Rotation verified</li>
  <li>· Equipment clear for buffer</li>
  </ul>
  </div>
  </div>
  </PageContainer>
  )
}
