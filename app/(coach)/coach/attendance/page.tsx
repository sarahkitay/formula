import React from 'react'
import { ClipboardList } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { SectionHeader } from '@/components/ui/section-header'
import { StatCard } from '@/components/ui/stat-card'
import { CountUp } from '@/components/ui/count-up'
import { getTodaysSessions } from '@/lib/mock-data/sessions'
import { getBookingsBySession } from '@/lib/mock-data/bookings'
import { getCheckInsBySession } from '@/lib/mock-data/checkins'
import { getInitials, getAvatarColor, cn } from '@/lib/utils'
import { listFacilityPlayers } from '@/lib/facility/roster-list-server'

export default async function CoachAttendancePage() {
  const roster = await listFacilityPlayers(300)
  const todaysSessions = getTodaysSessions()
  const totalBookings = todaysSessions.reduce((n, s) => n + getBookingsBySession(s.id).length, 0)
  const totalCheckedIn = todaysSessions.reduce((n, s) => n + getCheckInsBySession(s.id).length, 0)
  const attendanceRatePct = totalBookings ? Math.round((totalCheckedIn / totalBookings) * 100) : 0
  const absentCount = Math.max(0, totalBookings - totalCheckedIn)

  return (
    <PageContainer>
      <div className="space-y-7">
        <PageHeader
          title="Attendance"
          subtitle={`Today · ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard label="Sessions today" value={<CountUp end={todaysSessions.length} format="integer" />} accent />
          <StatCard
            label="Checked in"
            value={<CountUp end={totalCheckedIn} format="integer" />}
            sublabel={
              <>
                of <CountUp end={totalBookings} format="integer" /> booked
              </>
            }
          />
          <StatCard
            label="Attendance rate"
            value={
              totalBookings ? (
                <>
                  <CountUp end={attendanceRatePct} format="integer" />%
                </>
              ) : (
                'N/A'
              )
            }
            delta={{
              value:
                !totalBookings ? (
                  'No bookings'
                ) : absentCount > 0 ? (
                  <>
                    <CountUp end={absentCount} format="integer" /> absent
                  </>
                ) : (
                  'Full attendance'
                ),
              direction: !totalBookings ? 'neutral' : absentCount > 0 ? 'down' : 'up',
            }}
          />
        </div>

        <SectionHeader
          title="Roster (Supabase)"
          description="Session-level attendance will tie to bookings when that pipeline is connected."
        />
        {roster.length === 0 ? (
          <p className="text-sm text-text-muted">No athletes loaded. Configure Supabase service role on the server.</p>
        ) : (
          <div className="rounded-xl border border-border bg-surface p-4">
            <ul className="divide-y divide-border">
              {roster.slice(0, 40).map(p => (
                <li key={p.id} className="flex items-center gap-3 py-2">
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                      getAvatarColor(p.id)
                    )}
                  >
                    {getInitials(p.firstName, p.lastName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className="text-xs text-text-muted">{p.ageGroup}</p>
                  </div>
                </li>
              ))}
            </ul>
            {roster.length > 40 && (
              <p className="mt-2 text-xs text-text-muted">Showing 40 of {roster.length}. Use Admin → Players for full list.</p>
            )}
          </div>
        )}

        {todaysSessions.length === 0 && (
          <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/20 p-4 text-sm text-text-secondary">
            <ClipboardList className="mt-0.5 h-4 w-4 shrink-0" />
            <p>No coach sessions on file for today. When schedule + bookings sync, attendance rolls up here.</p>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
