import { ParentFpiReportPlayerClient } from '@/components/parent/parent-fpi-report-player-client'

export default async function ParentFpiReportPlayerPage({
  params,
}: {
  params: Promise<{ playerId: string }>
}) {
  const { playerId } = await params
  return <ParentFpiReportPlayerClient playerId={playerId} />
}
