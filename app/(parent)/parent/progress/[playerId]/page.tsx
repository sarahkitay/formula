import Link from 'next/link'
import { notFound } from 'next/navigation'
import { mockPlayers } from '@/lib/mock-data/players'
import { PlayerPerformanceDashboard } from '@/components/performance/player-performance-dashboard'

export default async function ParentPlayerProgressPage({
  params,
}: {
  params: Promise<{ playerId: string }>
}) {
  const { playerId } = await params
  const player = mockPlayers.find(p => p.id === playerId)
  if (!player) notFound()

  return (
  <div className="space-y-6">
  <div className="mx-auto w-full max-w-[1400px]">
  <Link
  href={`/parent/fpi-report/${playerId}`}
  className="inline-flex border border-[#22c55e]/35 bg-[#111111] px-5 py-4 text-sm font-medium text-[#22c55e] transition-colors hover:border-[#22c55e]/50 hover:bg-white/[0.04]"
  >
  View full FPI report - supportive, scientific summary
  </Link>
  </div>
  <PlayerPerformanceDashboard player={player} backHref="/parent/progress" backLabel="Back to progress" />
  </div>
  )
}
