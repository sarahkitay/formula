'use client'

import * as React from 'react'
import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { AdminFacilityMap, AdminFacilityMapLegend } from '@/components/admin/admin-facility-map'
import { AdminPanel, AdminMonoTable } from '@/components/admin/admin-panel'
import { facilityAssets, sampleAuditLog } from '@/lib/mock-data/admin-operating-system'
import { SITE } from '@/lib/site-config'
import { ChevronRight } from 'lucide-react'

export default function AdminFacilityMapPage() {
  const [selectedId, setSelectedId] = React.useState<string | null>('field-2')
  const selected = facilityAssets.find(a => a.id === selectedId)

  return (
    <PageContainer fullWidth>
      <div className="space-y-6">
        <PageHeader
          title="Operations map"
          subtitle={`${SITE.facilityName} · live asset grid · inventory-protected scheduling (demo)`}
          breadcrumb={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Ops map' },
          ]}
          actions={
            <Link href="/admin/schedule">
              <Button variant="secondary" size="sm" rightIcon={<ChevronRight className="h-3 w-3" strokeWidth={2} />}>
                Schedule ops
              </Button>
            </Link>
          }
        />

        <AdminFacilityMapLegend />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
          <AdminFacilityMap
            assets={facilityAssets}
            selectedId={selectedId}
            onSelect={id => setSelectedId(id)}
          />
          <div className="space-y-4">
            <AdminPanel title="Asset detail" eyebrow="SELECTED">
              {selected ? (
                <dl className="space-y-3 font-mono text-[11px] text-zinc-300">
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                    <dt className="text-zinc-500">Asset</dt>
                    <dd className="text-right text-zinc-100">{selected.label}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500">Status</dt>
                    <dd className="text-right uppercase">{selected.status.replace('-', ' ')}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500">Current</dt>
                    <dd className="max-w-[220px] text-right">{selected.currentProgram}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500">Next</dt>
                    <dd className="max-w-[220px] text-right">{selected.nextProgram}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500">Utilization</dt>
                    <dd className="tabular-nums text-warning">{selected.utilizationPct}%</dd>
                  </div>
                </dl>
              ) : (
                <p className="font-mono text-[11px] text-zinc-500">Select a zone on the grid.</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="primary" size="sm" disabled>
                  Hold / release
                </Button>
                <Button variant="secondary" size="sm" disabled>
                  Override (audit)
                </Button>
                <Button variant="ghost" size="sm" disabled>
                  Open in schedule
                </Button>
              </div>
              <p className="mt-3 font-mono text-[9px] text-zinc-600">
                RBAC: actions require scheduler + director roles. All overrides logged.
              </p>
            </AdminPanel>

            <AdminPanel title="Recent audit" eyebrow="FACILITY_MAP">
              <AdminMonoTable
                headers={['Time', 'Actor', 'Action']}
                rows={sampleAuditLog.map(a => [a.at, a.actor, a.action])}
              />
            </AdminPanel>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
