import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { registrationSurfaces } from '@/lib/mock-data/parent-portal'
import { parentPortalCard, parentPortalOutlineBtn } from '@/lib/parent/portal-surface'
import { cn } from '@/lib/utils'

const statusStyle: Record<(typeof registrationSurfaces)[0]['status'], string> = {
  open: 'bg-formula-volt/15 text-formula-volt',
  waitlist: 'bg-amber-500/15 text-amber-300',
  closed: 'bg-formula-paper/[0.06] text-formula-mist',
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
  className={cn('flex flex-col p-6', parentPortalCard)}
  >
  <div className="flex items-start justify-between gap-2">
  <h2 className="text-base font-semibold text-formula-paper">{r.title}</h2>
  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusStyle[r.status]}`}>
  {r.status}
  </span>
  </div>
  <p className="mt-3 flex-1 text-sm leading-relaxed text-formula-frost/82">{r.description}</p>
  <Link href={r.href} className={cn('mt-4', parentPortalOutlineBtn)}>
  {r.href.includes('bookings') ? 'Open schedule' : 'View details'}
  </Link>
  </div>
  ))}
  </div>
  </div>
  </PageContainer>
  )
}
