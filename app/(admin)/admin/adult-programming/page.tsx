import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { AdminPanel, AdminMonoTable } from '@/components/admin/admin-panel'
import { adultLeagueSeasons, todaysAdultBlocks } from '@/lib/mock-data/admin-operating-system'
import { SITE } from '@/lib/site-config'

export default function AdultProgrammingPage() {
  return (
  <PageContainer fullWidth>
  <div className="space-y-6">
  <PageHeader
  title="Adult programming"
  subtitle={`Additive · inventory-capped · ${SITE.sessionLengthMinutes}m youth engine protected first`}
  breadcrumb={[
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Adult' },
  ]}
  />

  <AdminPanel title="Adult pickup (Tue/Thu)" eyebrow="POST_YOUTH">
  <AdminMonoTable
  headers={['Window', 'Program', 'Division', 'Reg', 'Cap']}
  rows={todaysAdultBlocks.map(b => [
  b.window,
  b.program,
  b.division,
  b.registrations,
  b.cap,
  ])}
  />
  </AdminPanel>

  <AdminPanel title="League seasons" eyebrow="12_WEEK">
  <AdminMonoTable
  headers={['Season', 'Division', 'Teams', 'Week', 'Length']}
  rows={adultLeagueSeasons.map(s => [
  s.name,
  s.division,
  s.teams,
  `${s.week} / ${s.totalWeeks}`,
  `${s.totalWeeks} wk`,
  ])}
  />
  <p className="mt-3 font-mono text-[10px] text-zinc-500">
  Promotion / relegation: bracket-ready - connect standings feed (future).
  </p>
  </AdminPanel>
  </div>
  </PageContainer>
  )
}
