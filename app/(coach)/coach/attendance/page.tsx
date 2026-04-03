import React from 'react'
import { ClipboardList, CheckCircle2, XCircle } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { SectionHeader } from '@/components/ui/section-header'
import { Badge, StatusPill } from '@/components/ui/badge'
import { StatCard } from '@/components/ui/stat-card'
import { CountUp } from '@/components/ui/count-up'
import { getTodaysSessions } from '@/lib/mock-data/sessions'
import { getBookingsBySession } from '@/lib/mock-data/bookings'
import { getPlayerById } from '@/lib/mock-data/players'
import { getCheckInsBySession } from '@/lib/mock-data/checkins'
import { formatDate, getInitials, getAvatarColor, cn } from '@/lib/utils'

const COACH_ID = 'coach-1'

export default function CoachAttendancePage() {
  const todaysSessions = getTodaysSessions().filter(s => s.coachId === COACH_ID)
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

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Sessions Today" value={<CountUp end={todaysSessions.length} format="integer" />} accent />
          <StatCard
            label="Checked In"
            value={<CountUp end={totalCheckedIn} format="integer" />}
            sublabel={
              <>
                of <CountUp end={totalBookings} format="integer" /> booked
              </>
            }
          />
          <StatCard
            label="Attendance Rate"
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

        {todaysSessions.map(session => {
          const bookings = getBookingsBySession(session.id)
          const checkIns = getCheckInsBySession(session.id)
          const checkedInPlayerIds = new Set(checkIns.map(c => c.playerId))

          return (
            <div key={session.id} className="rounded-xl border border-border bg-surface overflow-hidden">
              {/* Session header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-raised">
                <div>
                  <p className="font-bold text-text-primary">{session.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {new Date(session.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} –{' '}
                    {new Date(session.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    {' · '}{session.fieldName}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary">{checkedInPlayerIds.size}/{bookings.length}</span>
                  <StatusPill status={session.status} />
                </div>
              </div>

              {/* Attendance list */}
              <div className="divide-y divide-border">
                {bookings.length === 0 ? (
                  <p className="px-5 py-4 text-sm text-text-muted">No bookings for this session</p>
                ) : (
                  bookings.map(booking => {
                    const player = getPlayerById(booking.playerId)
                    if (!player) return null
                    const present = checkedInPlayerIds.has(booking.playerId)
                    return (
                      <div key={booking.id} className={cn('flex items-center gap-4 px-5 py-3', present && 'bg-success/3')}>
                        <div className={cn('h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0', getAvatarColor(player.id))}>
                          {getInitials(player.firstName, player.lastName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary">{player.firstName} {player.lastName}</p>
                          <p className="text-xs text-text-muted">#{player.jerseyNumber} · {player.position}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {present ? (
                            <span className="flex items-center gap-1 text-xs text-success font-medium">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Present
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-text-muted">
                              <XCircle className="h-3.5 w-3.5" />
                              Not yet
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}

        {todaysSessions.length === 0 && (
          <div className="text-center py-16 text-text-muted">
            <ClipboardList className="h-8 w-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No sessions scheduled for today</p>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
