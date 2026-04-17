import { notFound } from 'next/navigation'
import { getPlayersByIds } from '@/lib/facility/players-by-ids-server'
import { listAssessmentsForPlayerAdmin } from '@/lib/facility/assessments-for-player-server'
import { getAthleteCoachSnapshot } from '@/lib/mock-data/coach-operating'
import { PlayerPerformanceDashboard } from '@/components/performance/player-performance-dashboard'
import { CoachAthleteSnapshot } from '@/components/coach/coach-athlete-snapshot'
import { PageContainer } from '@/components/layout/app-shell'

export default async function CoachPlayerPerformancePage({
  params,
}: {
  params: Promise<{ playerId: string }>
}) {
  const { playerId } = await params
  const rows = await getPlayersByIds([playerId])
  const player = rows[0]
  if (!player) notFound()

  const snapshot = getAthleteCoachSnapshot(playerId)
  const assessmentHistory = await listAssessmentsForPlayerAdmin(playerId)

  return (
    <>
      <PageContainer>
        <CoachAthleteSnapshot snapshot={snapshot} playerId={playerId} />
      </PageContainer>
      <PlayerPerformanceDashboard
        player={player}
        backHref="/coach/performance"
        backLabel="Back to athletes"
        assessmentHistory={assessmentHistory}
      />
    </>
  )
}
