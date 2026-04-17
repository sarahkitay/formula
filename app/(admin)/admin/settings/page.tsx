'use client'

import React, { useState } from 'react'
import { Users } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { TabSwitcher } from '@/components/ui/tab-switcher'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'facility', label: 'Facility' },
  { id: 'users', label: 'Users & Access' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'integrations', label: 'Integrations' },
]

function FieldRow({
  label,
  value,
  type = 'text',
  readOnly,
}: {
  label: string
  value: string
  type?: string
  readOnly?: boolean
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-2 border-b border-formula-frost/10 py-3 last:border-0 sm:grid-cols-3 sm:gap-4">
      <label className="text-sm font-medium text-text-secondary">{label}</label>
      <div className="sm:col-span-2">
        <input
          type={type}
          defaultValue={value}
          readOnly={readOnly}
          className="h-9 w-full border border-formula-frost/16 bg-formula-paper/[0.05] px-3 text-sm text-text-primary focus:border-formula-volt/40 focus:outline-none read-only:cursor-default read-only:bg-formula-paper/[0.03]"
        />
      </div>
    </div>
  )
}

function IntegrationCard({
  icon,
  name,
  description,
  status,
  onPrimaryAction,
  primaryLabel,
}: {
  icon?: React.ReactNode
  name: string
  description: string
  status: 'connected' | 'coming-soon' | 'disconnected'
  onPrimaryAction?: () => void
  primaryLabel?: string
}) {
  return (
    <div className="flex flex-col gap-4 border border-formula-frost/12 bg-formula-paper/[0.04] p-4 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)] sm:flex-row sm:items-start">
      {icon != null && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-formula-frost/14 bg-formula-paper/[0.06] text-text-muted">
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-text-primary">{name}</p>
          {status === 'connected' && (
            <Badge variant="success" size="sm">
              Connected
            </Badge>
          )}
          {status === 'coming-soon' && (
            <Badge variant="accent" size="sm">
              Coming soon
            </Badge>
          )}
          {status === 'disconnected' && (
            <Badge variant="default" size="sm">
              Not connected
            </Badge>
          )}
        </div>
        <p className="mt-0.5 text-xs text-text-secondary">{description}</p>
      </div>
      <div className="flex shrink-0 gap-2 sm:flex-col sm:items-end">
        {status === 'connected' && (
          <Button variant="danger" size="sm" type="button" onClick={onPrimaryAction}>
            {primaryLabel ?? 'Disconnect'}
          </Button>
        )}
        {status === 'disconnected' && (
          <Button variant="secondary" size="sm" type="button" onClick={onPrimaryAction}>
            {primaryLabel ?? 'Connect'}
          </Button>
        )}
        {status === 'coming-soon' && (
          <Button variant="ghost" size="sm" type="button" onClick={onPrimaryAction}>
            {primaryLabel ?? 'Set up'}
          </Button>
        )}
      </div>
    </div>
  )
}

const FACILITY_ADDRESS = '15001 Calvert St, Van Nuys, CA 91411'
const FACILITY_WEBSITE = 'https://www.formulasoccer.com/'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('facility')
  const [facilitySavedAt, setFacilitySavedAt] = useState<string | null>(null)
  const [integrationNote, setIntegrationNote] = useState<string | null>(null)
  const [notifyToggles, setNotifyToggles] = useState([true, true, false, true])
  const [demoAction, setDemoAction] = useState<string | null>(null)

  const flipNotify = (index: number) => {
    setNotifyToggles(prev => prev.map((v, i) => (i === index ? !v : v)))
  }

  return (
    <PageContainer fullWidth>
      <div className="space-y-8">
        <PageHeader title="Settings" subtitle="Facility configuration and system preferences" />

        {demoAction && (
          <p className="rounded border border-formula-volt/25 bg-formula-volt/10 px-3 py-2 font-mono text-xs text-formula-paper">
            {demoAction}
          </p>
        )}

        <div className="border-b border-formula-frost/12">
          <TabSwitcher tabs={TABS} activeTab={activeTab} onChange={setActiveTab} variant="underline" />
        </div>

        {activeTab === 'facility' && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="border border-formula-frost/12 bg-formula-paper/[0.04] p-6 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)] xl:col-span-2">
              <div className="mb-4 border-b border-formula-frost/10 pb-4">
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
                  Facility information
                </p>
              </div>
              <div className="space-y-0">
                <FieldRow label="Facility Name" value="Formula Soccer Performance Center" />
                <FieldRow label="Address" value={FACILITY_ADDRESS} />
                <FieldRow label="Phone" value="(555) 400-8800" />
                <FieldRow label="Email" value="info@formulasoccer.com" />
                <FieldRow label="Website" value={FACILITY_WEBSITE} type="url" readOnly />
              </div>
              {facilitySavedAt && (
                <p className="mt-4 font-mono text-[11px] text-[#005700]">Saved at {facilitySavedAt} (demo: local only).</p>
              )}
              <div className="mt-6 flex justify-end border-t border-formula-frost/10 pt-4">
                <Button
                  variant="primary"
                  size="sm"
                  type="button"
                  onClick={() => setFacilitySavedAt(new Date().toLocaleTimeString())}
                >
                  Save changes
                </Button>
              </div>
            </div>
            <div className="border border-formula-frost/12 bg-formula-deep/35 p-6 font-mono text-[11px] text-formula-mist">
              <p className="mb-2 font-bold uppercase tracking-wider text-formula-paper">Config notes</p>
              <p>Changes sync to facility profile. Role edits require owner approval in production.</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="overflow-hidden border border-formula-frost/12 bg-formula-paper/[0.04] shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
              {[
                { name: 'Front Desk Staff', email: 'desk@formulafc.com', role: 'Admin', status: 'Active' },
                { name: 'Marcus Rivera', email: 'marcus.rivera@formulafc.com', role: 'Coach', status: 'Active' },
                { name: 'Elena Vasquez', email: 'elena.vasquez@formulafc.com', role: 'Coach', status: 'Active' },
                { name: 'Jordan Kim', email: 'jordan.kim@formulafc.com', role: 'Coach', status: 'Active' },
              ].map((user, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 border-b border-formula-frost/10 px-4 py-3 last:border-b-0 sm:flex-row sm:items-center"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-formula-frost/14 bg-formula-paper/[0.06] text-xs font-bold text-text-secondary">
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{user.name}</p>
                    <p className="text-xs text-text-muted">{user.email}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={user.role === 'Admin' ? 'accent' : 'info'}>{user.role}</Badge>
                    <Button variant="ghost" size="sm" type="button" onClick={() => setDemoAction(`Edit user: ${user.email} (demo)`)}>
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              type="button"
              leftIcon={<Users className="h-4 w-4" />}
              onClick={() => setDemoAction('Invite user: opens email modal in production (demo).')}
            >
              Invite user
            </Button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="overflow-hidden border border-formula-frost/12 bg-formula-paper/[0.04] shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
            {[
              {
                label: 'Session check-in reminders',
                description: 'Notify front desk 30 min before each session',
              },
              {
                label: 'Membership expiry alerts',
                description: 'Alert when a player has ≤2 sessions remaining',
              },
              {
                label: 'New booking notifications',
                description: 'Notify admin when a parent books a session',
              },
              { label: 'Payment received', description: 'Alert when a payment is processed' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 border-b border-formula-frost/10 px-4 py-3.5 last:border-b-0 sm:flex-row sm:items-center"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{item.label}</p>
                  <p className="mt-0.5 text-xs text-text-muted">{item.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => flipNotify(i)}
                  className={cn(
                    'h-6 w-11 shrink-0 cursor-pointer border transition-colors',
                    notifyToggles[i] ? 'border-formula-volt/60 bg-formula-volt' : 'border-formula-frost/20 bg-formula-paper/[0.08]'
                  )}
                  role="switch"
                  aria-checked={notifyToggles[i]}
                >
                  <div
                    className={cn(
                      'mt-0.5 h-4 w-4 border shadow-sm transition-transform',
                      notifyToggles[i]
                        ? 'translate-x-5 border-formula-base/40 bg-formula-base'
                        : 'translate-x-0.5 border-formula-frost/20 bg-formula-paper/[0.12]'
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-3">
            {integrationNote && (
              <p className="rounded border border-formula-frost/12 bg-formula-deep/35 px-3 py-2 font-mono text-xs text-formula-frost/90">
                {integrationNote}
              </p>
            )}
            <IntegrationCard
              name="Wristband Scanner"
              description="Hardware check-in via RFID wristbands. Will auto-populate the check-in screen and log attendance."
              status="coming-soon"
              onPrimaryAction={() => setIntegrationNote('Wristband Scanner: join beta waitlist recorded (demo).')}
            />
            <IntegrationCard
              name="Stripe Payments"
              description="Accept credit card payments for memberships, sessions, and field rentals. Webhook handles automatic session credit allocation."
              status="disconnected"
              onPrimaryAction={() => setIntegrationNote('Stripe: OAuth connect flow would open here (demo).')}
            />
            <IntegrationCard
              name="Performance Machines"
              description="Speed gates, force plates, and athletic performance systems. Data feeds directly into the performance dashboard."
              status="coming-soon"
              onPrimaryAction={() => setIntegrationNote('Performance machines: vendor handshake queued (demo).')}
            />
            <div className="border border-formula-frost/12 bg-formula-deep/35 p-4 text-center">
              <p className="text-xs text-text-muted">
                More integrations coming in Phase 2. Contact support to request a specific integration.
              </p>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
