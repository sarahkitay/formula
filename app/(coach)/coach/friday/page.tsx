import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { AdminMonoTable } from '@/components/admin/admin-panel'
import { fridayCoachRoster } from '@/lib/mock-data/coach-operating'

export default function CoachFridayPage() {
  const r = fridayCoachRoster
  return (
  <PageContainer fullWidth>
  <div className="space-y-6">
  <PageHeader
  title="Friday Youth Game Circuit"
  subtitle="Pre-built roster · no friend-team overrides · competitive observations · internal use only"
  actions={
  <Link href="/coach/today">
  <Button variant="ghost" size="sm">
  Today
  </Button>
  </Link>
  }
  />

  <div className="border border-white/10 bg-[#0f0f0f] p-4 font-mono text-[11px] text-zinc-400">
  <span className="text-zinc-500">TEAM</span> · {r.teamLabel} · {r.ageBand} · balanced roster{' '}
  {r.balanced ? '✓' : '-'}
  </div>

  <div className="border border-white/10 bg-[#0f0f0f] p-5">
  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Roster</p>
  <AdminMonoTable
  headers={['Athlete', 'Competitive (internal)']}
  rows={r.athletes.map(a => [a.name, a.fpiCompetitive])}
  />
  </div>

  <div className="grid gap-4 md:grid-cols-2">
  <div className="border border-white/10 bg-[#0f0f0f] p-4">
  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Live capture</p>
  <ul className="mt-2 space-y-2 font-mono text-[11px] text-zinc-400">
  <li>· Actions-per-minute sample</li>
  <li>· Decision quality flags</li>
  <li>· Post-session debrief notes</li>
  </ul>
  </div>
  <div className="border border-white/10 bg-[#0f0f0f] p-4">
  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Media</p>
  <p className="mt-2 font-mono text-[11px] text-zinc-400">Winner / social capture workflow - opt-in, non-ranking.</p>
  <Button className="mt-3" variant="secondary" size="sm" disabled>
  Open capture
  </Button>
  </div>
  </div>
  </div>
  </PageContainer>
  )
}
