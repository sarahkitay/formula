import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { ParentPanel } from '@/components/parent/parent-panel'
import { fpiReportDemo } from '@/lib/mock-data/parent-portal'
import type { Player } from '@/types'

export function FpiReportPremium({ player, backHref }: { player: Player; backHref: string }) {
  const r = fpiReportDemo

  return (
  <PageContainer fullWidth>
  <div className="space-y-8">
  <Link
  href={backHref}
  className="inline-flex items-center gap-1 text-sm font-medium text-zinc-400 transition-colors hover:text-[#22c55e]"
  >
  <ChevronLeft className="h-4 w-4" />
  Back
  </Link>

  <header className="border border-white/10 bg-[#111111] p-8">
  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#22c55e]/90">Formula Performance Index</p>
  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 md:text-3xl">
  {player.firstName} {player.lastName}
  </h1>
  <p className="mt-1 text-sm text-zinc-500">{player.ageGroup} · confidential development report</p>
  </header>

  <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
  <div className="flex flex-col justify-between border border-[#22c55e]/25 bg-gradient-to-br from-[#141414] to-[#0a1410] p-8">
  <div>
  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{r.compositeLabel}</p>
  <p className="mt-3 text-5xl font-semibold tabular-nums text-[#22c55e]">{r.compositeValue}</p>
  <p className="mt-4 text-sm leading-relaxed text-zinc-400">{r.compositeNarrative}</p>
  </div>
  <div className="mt-6 border-t border-white/10 pt-4">
  <p className="text-xs font-medium text-zinc-500">Age-band context</p>
  <p className="mt-1 text-sm text-zinc-100">{r.percentileBand}</p>
  <p className="mt-2 text-xs text-zinc-500">{r.trendLabel}</p>
  </div>
  </div>

  <ParentPanel title="Domain breakdown" eyebrow="SCIENTIFIC">
  <p className="mb-4 text-sm text-zinc-400">
  Domains describe development areas - not league rankings. Your coach uses these to prioritize training.
  </p>
  <div className="space-y-4">
  {r.domains.map(d => (
  <div key={d.name}>
  <div className="flex items-center justify-between text-sm">
  <span className="font-medium text-zinc-100">{d.name}</span>
  <span className="tabular-nums text-zinc-400">{d.value}</span>
  </div>
  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-800">
  <div
  className="h-full rounded-full bg-[#22c55e]/85"
  style={{ width: `${Math.min(100, d.value)}%` }}
  />
  </div>
  <p className="mt-1 text-xs text-zinc-500">{d.note}</p>
  </div>
  ))}
  </div>
  </ParentPanel>
  </div>

  <div className="grid gap-6 md:grid-cols-2">
  <ParentPanel title="Development priorities" eyebrow="FORWARD-LOOKING">
  <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-400">
  {r.priorities.map((p, i) => (
  <li key={i}>{p}</li>
  ))}
  </ol>
  </ParentPanel>
  <ParentPanel title="12-week focus" eyebrow="STRUCTURED">
  <p className="text-sm leading-relaxed text-zinc-400">{r.focus12Week}</p>
  </ParentPanel>
  </div>

  <ParentPanel title="Optional clinic suggestions" eyebrow="RECOMMENDED">
  <p className="text-sm text-zinc-400">
  When seats are available, these align with {player.firstName}&apos;s development profile - never required for
  “keeping up.”
  </p>
  <ul className="mt-3 space-y-2">
  {r.clinicSuggestions.map((c, i) => (
  <li key={i} className="flex items-start gap-2 text-sm text-zinc-200">
  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22c55e]" />
  {c}
  </li>
  ))}
  </ul>
  </ParentPanel>

  <div className="border border-dashed border-white/15 bg-[#141414] px-6 py-5 text-center text-sm leading-relaxed text-zinc-400">
  {r.supportiveFooter}
  </div>
  </div>
  </PageContainer>
  )
}
