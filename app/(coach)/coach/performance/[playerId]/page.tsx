import { notFound } from 'next/navigation'
import { mockPlayers } from '@/lib/mock-data/players'
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
  const player = mockPlayers.find(p => p.id === playerId)
  if (!player) notFound()

  const snapshot = getAthleteCoachSnapshot(playerId)

  return (
    <>
      <PageContainer>
        <CoachAthleteSnapshot snapshot={snapshot} playerId={playerId} />
      </PageContainer>
      <PlayerPerformanceDashboard player={player} backHref="/coach/performance" backLabel="Back to athletes" />
    </>
  )
}
