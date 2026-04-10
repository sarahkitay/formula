import { ParentPlayerProgressPageClient } from '@/components/parent/parent-player-progress-page-client'

export default async function ParentPlayerProgressPage({
  params,
}: {
  params: Promise<{ playerId: string }>
}) {
  const { playerId } = await params
  return <ParentPlayerProgressPageClient playerId={playerId} />
}
