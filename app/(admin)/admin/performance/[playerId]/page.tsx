import { notFound } from 'next/navigation'
import { getPlayersByIds } from '@/lib/facility/players-by-ids-server'
import { listAssessmentsForPlayerAdmin } from '@/lib/facility/assessments-for-player-server'
import { PlayerPerformanceDashboard } from '@/components/performance/player-performance-dashboard'

export default async function AdminPlayerPerformancePage({
  params,
}: {
  params: Promise<{ playerId: string }>
}) {
  const { playerId } = await params
  const rows = await getPlayersByIds([playerId])
  const player = rows[0]
  if (!player) notFound()

  const assessmentHistory = await listAssessmentsForPlayerAdmin(playerId)

  return (
    <PlayerPerformanceDashboard
      player={player}
      backHref="/admin/performance"
      backLabel="Back to performance"
      assessmentHistory={assessmentHistory}
    />
  )
}
