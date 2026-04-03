import { notFound } from 'next/navigation'
import { mockPlayers } from '@/lib/mock-data/players'
import { FpiReportPremium } from '@/components/parent/fpi-report-premium'

export default async function ParentFpiReportPlayerPage({
  params,
}: {
  params: Promise<{ playerId: string }>
}) {
  const { playerId } = await params
  const player = mockPlayers.find(p => p.id === playerId)
  if (!player) notFound()

  return <FpiReportPremium player={player} backHref="/parent/fpi-report" />
}
