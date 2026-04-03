import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { registrationSurfaces } from '@/lib/mock-data/parent-portal'
import { cn } from '@/lib/utils'

const statusStyle: Record<(typeof registrationSurfaces)[0]['status'], string> = {
  open: 'bg-[#22c55e]/15 text-[#22c55e]',
  waitlist: 'bg-amber-500/15 text-amber-400',
  closed: 'bg-zinc-800/90 text-zinc-400',
  invite: 'bg-violet-500/15 text-violet-300',
}

export default function ParentRegisterPage() {
  return (
  <PageContainer fullWidth>
  <div className="space-y-8">
  <PageHeader
  title="Registration"
  subtitle="Structured programs - not an open calendar. Availability is published per age band and capacity."
  />

  <div className="grid gap-4 md:grid-cols-2">
  {registrationSurfaces.map(r => (
  <div
  key={r.id}
  id={r.id}
  className="flex flex-col border border-white/10 bg-[#111111] p-6"
  >
  <div className="flex items-start justify-between gap-2">
  <h2 className="text-base font-semibold text-zinc-100">{r.title}</h2>
  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusStyle[r.status]}`}>
  {r.status}
  </span>
  </div>
  <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{r.description}</p>
  <Link
  href={r.href}
  className={cn(
  'mt-4 inline-flex h-7 w-fit items-center gap-1.5 rounded-control border border-border bg-muted px-2.5 text-xs font-medium text-text-primary transition-colors hover:border-border-bright hover:bg-elevated'
  )}
  >
  {r.href.includes('bookings') ? 'Open schedule' : 'View details'}
  </Link>
  </div>
  ))}
  </div>
  </div>
  </PageContainer>
  )
}
