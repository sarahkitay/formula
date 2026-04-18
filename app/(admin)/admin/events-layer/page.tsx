import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { AdminPanel } from '@/components/admin/admin-panel'
import { eventsLayerSummary } from '@/lib/mock-data/admin-operating-system'

export default function EventsLayerPage() {
  const e = eventsLayerSummary
  return (
    <PageContainer fullWidth>
      <div className="space-y-6">
        <PageHeader
          title="Camps · tournaments · parties · Footbot"
          subtitle="Controlled additive layers · monetization without diluting youth identity"
          breadcrumb={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Events' },
          ]}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AdminPanel title="Camps" eyebrow="SUMMER_BASELINE">
            <dl className="space-y-2 font-mono text-[11px] text-formula-frost/90">
              <div className="flex justify-between">
                <dt className="text-formula-mist">Summer baseline</dt>
                <dd>{e.camps.summerWeeks} weeks</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-formula-mist">Enrolled</dt>
                <dd>{e.camps.enrolled}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-formula-mist">Membership conversion</dt>
                <dd>{e.camps.conversionToMembership}</dd>
              </div>
            </dl>
          </AdminPanel>
          <AdminPanel title="Tournaments" eyebrow="CYCLE">
            <dl className="space-y-2 font-mono text-[11px] text-formula-frost/90">
              <div className="flex justify-between">
                <dt className="text-formula-mist">Per 12-week cycle</dt>
                <dd>{e.tournaments.perCycle}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-formula-mist">Next</dt>
                <dd>{e.tournaments.nextDate}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-formula-mist">Fields</dt>
                <dd>{e.tournaments.fieldsBooked} booked</dd>
              </div>
            </dl>
            <p className="mt-2 font-mono text-[10px] text-formula-mist">Parking flow + bracket timing: ops checklist (TBD).</p>
          </AdminPanel>
          <AdminPanel title="Parties" eyebrow="FIXED_WINDOWS">
            <dl className="space-y-2 font-mono text-[11px] text-formula-frost/90">
              <div className="flex justify-between">
                <dt className="text-formula-mist">Fixed windows</dt>
                <dd>{e.parties.fixedWindows}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-formula-mist">This month</dt>
                <dd>{e.parties.thisMonth}</dd>
              </div>
            </dl>
          </AdminPanel>
          <AdminPanel title="Footbot" eyebrow="SUNDAY">
            <dl className="space-y-2 font-mono text-[11px] text-formula-frost/90">
              <div className="flex justify-between">
                <dt className="text-formula-mist">Standalone</dt>
                <dd>{e.footbot.sundayStandalone ? 'Yes' : 'No'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-formula-mist">Next slot</dt>
                <dd>{e.footbot.nextSlot}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-formula-mist">Mode</dt>
                <dd className="max-w-[200px] text-right">{e.footbot.mode}</dd>
              </div>
            </dl>
          </AdminPanel>
        </div>
      </div>
    </PageContainer>
  )
}
