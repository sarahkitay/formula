import { notFound } from 'next/navigation'
import { mockPlayers } from '@/lib/mock-data/players'
import { PlayerPerformanceDashboard } from '@/components/performance/player-performance-dashboard'

export default async function AdminPlayerPerformancePage({
  params,
}: {
  params: Promise<{ playerId: string }>
}) {
  const { playerId } = await params
  const player = mockPlayers.find(p => p.id === playerId)
  if (!player) notFound()

  return (
    <PlayerPerformanceDashboard player={player} backHref="/admin/performance" backLabel="Back to performance" />
  )
}
