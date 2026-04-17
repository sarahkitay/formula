import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { ParentPanel } from '@/components/parent/parent-panel'
import { parentFpiReportEmpty, type ParentFpiReportContent } from '@/lib/parent/fpi-report-shell'
import { parentPortalDashedCallout, parentPortalPanel } from '@/lib/parent/portal-surface'
import { cn } from '@/lib/utils'
export type FpiReportAthlete = {
  firstName: string
  lastName: string
  ageGroup: string
}

export function FpiReportPremium({
  player,
  backHref,
  report,
}: {
  player: FpiReportAthlete
  backHref: string
  report?: ParentFpiReportContent
}) {
  const r = report ?? parentFpiReportEmpty

  return (
  <PageContainer fullWidth>
  <div className="space-y-8">
  <Link
  href={backHref}
  className="inline-flex items-center gap-1 text-sm font-medium text-formula-frost/75 transition-colors hover:text-formula-volt"
  >
  <ChevronLeft className="h-4 w-4" />
  Back
  </Link>

  <header className={cn('p-8', parentPortalPanel)}>
  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-formula-volt/90">Formula Performance Index</p>
  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-formula-paper md:text-3xl">
  {player.firstName} {player.lastName}
  </h1>
  <p className="mt-1 text-sm text-formula-mist">{player.ageGroup} · confidential development report</p>
  </header>

  <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
  <div className="flex flex-col justify-between rounded-xl border border-formula-volt/25 bg-gradient-to-br from-formula-deep/80 to-formula-base/50 p-8 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
  <div>
  <p className="text-xs font-medium uppercase tracking-wider text-formula-mist">{r.compositeLabel}</p>
  <p className="mt-3 text-5xl font-semibold tabular-nums text-formula-volt">{r.compositeValue}</p>
  <p className="mt-4 text-sm leading-relaxed text-formula-frost/82">{r.compositeNarrative}</p>
  </div>
  <div className="mt-6 border-t border-formula-frost/12 pt-4">
  <p className="text-xs font-medium text-formula-mist">Age-band context</p>
  <p className="mt-1 text-sm text-formula-paper">{r.percentileBand}</p>
  <p className="mt-2 text-xs text-formula-mist">{r.trendLabel}</p>
  </div>
  </div>

  <ParentPanel title="Domain breakdown" eyebrow="SCIENTIFIC">
  <p className="mb-4 text-sm text-formula-frost/80">
  Domains describe development areas - not league rankings. Your coach uses these to prioritize training.
  </p>
  <div className="space-y-4">
  {r.domains.map(d => (
  <div key={d.name}>
  <div className="flex items-center justify-between text-sm">
  <span className="font-medium text-formula-paper">{d.name}</span>
  <span className="tabular-nums text-formula-frost/75">{d.value}</span>
  </div>
  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-formula-deep/80">
  <div
  className="h-full rounded-full bg-formula-volt/85"
  style={{ width: `${Math.min(100, d.value)}%` }}
  />
  </div>
  <p className="mt-1 text-xs text-formula-mist">{d.note}</p>
  </div>
  ))}
  </div>
  </ParentPanel>
  </div>

  <div className="grid gap-6 md:grid-cols-2">
  <ParentPanel title="Development priorities" eyebrow="FORWARD-LOOKING">
  <ol className="list-decimal space-y-2 pl-5 text-sm text-formula-frost/82">
  {r.priorities.map((p, i) => (
  <li key={i}>{p}</li>
  ))}
  </ol>
  </ParentPanel>
  <ParentPanel title="12-week focus" eyebrow="STRUCTURED">
  <p className="text-sm leading-relaxed text-formula-frost/82">{r.focus12Week}</p>
  </ParentPanel>
  </div>

  <ParentPanel title="Optional clinic suggestions" eyebrow="RECOMMENDED">
  <p className="text-sm text-formula-frost/80">
  When seats are available, these align with {player.firstName}&apos;s development profile - never required for
  “keeping up.”
  </p>
  <ul className="mt-3 space-y-2">
  {r.clinicSuggestions.map((c, i) => (
  <li key={i} className="flex items-start gap-2 text-sm text-formula-frost/90">
  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-formula-volt" />
  {c}
  </li>
  ))}
  </ul>
  </ParentPanel>

  <div className={cn(parentPortalDashedCallout, 'px-6 py-5 text-sm leading-relaxed text-formula-frost/82')}>
  {r.supportiveFooter}
  </div>
  </div>
  </PageContainer>
  )
}
