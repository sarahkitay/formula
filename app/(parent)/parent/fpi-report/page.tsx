import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { ParentPanel } from '@/components/parent/parent-panel'
import { mockPlayers } from '@/lib/mock-data/players'

const PARENT_PLAYER_IDS = ['player-6', 'player-7']
const myPlayers = mockPlayers.filter(p => PARENT_PLAYER_IDS.includes(p.id))

export default function ParentFpiReportIndexPage() {
  return (
  <PageContainer>
  <div className="space-y-8">
  <PageHeader
  title="FPI reports"
  subtitle="Choose an athlete to view their Formula Performance Index report - private to your family and coaching staff."
  />

  <ParentPanel title="Your athletes" eyebrow="REPORTS">
  <ul className="divide-y divide-white/10">
  {myPlayers.map(p => (
  <li key={p.id}>
  <Link
  href={`/parent/fpi-report/${p.id}`}
  className="flex items-center justify-between py-4 text-inherit no-underline transition-colors hover:text-[#22c55e]"
  >
  <span className="font-medium text-zinc-100">
  {p.firstName} {p.lastName}
  </span>
  <span className="text-sm text-zinc-500">{p.ageGroup}</span>
  </Link>
  </li>
  ))}
  </ul>
  </ParentPanel>
  </div>
  </PageContainer>
  )
}
