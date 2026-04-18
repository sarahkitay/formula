import React from 'react'
import { ClipboardList } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { SectionHeader } from '@/components/ui/section-header'
import { StatCard } from '@/components/ui/stat-card'
import { CountUp } from '@/components/ui/count-up'
import { getInitials, getAvatarColor, cn } from '@/lib/utils'
import { listFacilityPlayers } from '@/lib/facility/roster-list-server'
import { listParentBlockBookingsForFacilityToday } from '@/lib/coach/parent-block-bookings-today-server'
import { getPlayersByIds } from '@/lib/facility/players-by-ids-server'

export default async function CoachAttendancePage() {
  const roster = await listFacilityPlayers(300)
  const { bookings, facilityYmd, timeZone, error } = await listParentBlockBookingsForFacilityToday()
  const uniquePlayerIds = [...new Set(bookings.map(b => b.player_id))]
  const bookingPlayers = await getPlayersByIds(uniquePlayerIds)
  const nameById = new Map(bookingPlayers.map(p => [p.id, `${p.firstName} ${p.lastName}`]))

  const bookedSlots = bookings.length
  const athletesBooked = uniquePlayerIds.length
  const checkedIn = 0

  return (
    <PageContainer>
      <div className="space-y-7">
        <PageHeader
          title="Attendance"
          subtitle={`Facility calendar day ${facilityYmd} · ${timeZone}`}
        />

        {error ? (
          <p className="rounded-xl border border-border bg-surface p-4 text-sm text-text-muted">{error}</p>
        ) : null}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard
            label="Booked slots"
            value={<CountUp end={bookedSlots} format="integer" />}
            accent
            sublabel="Confirmed parent_block_bookings for this day"
          />
          <StatCard
            label="Athletes booked"
            value={<CountUp end={athletesBooked} format="integer" />}
            sublabel="Distinct players with at least one slot"
          />
          <StatCard
            label="Checked in"
            value={<CountUp end={checkedIn} format="integer" />}
            sublabel="No check-in store yet — rate N/A until check_ins exists"
          />
        </div>

        <SectionHeader
          title="Today’s block bookings"
          description="Pulled from parent portal reservations (parent_block_bookings). Session-level check-ins are not wired."
        />
        {bookings.length === 0 ? (
          <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/20 p-4 text-sm text-text-secondary">
            <ClipboardList className="mt-0.5 h-4 w-4 shrink-0" />
            <p>No confirmed block bookings for this facility day. When parents book published slots, they appear here.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface p-4">
            <ul className="divide-y divide-border">
              {bookings.map(b => (
                <li key={b.id} className="flex flex-wrap items-center gap-3 py-2.5">
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                      getAvatarColor(b.player_id)
                    )}
                  >
                    {(() => {
                      const raw = nameById.get(b.player_id)
                      if (!raw) return '??'
                      const [fn, ...rest] = raw.split(/\s+/)
                      const ln = rest.join(' ') || '?'
                      return getInitials(fn || '?', ln)
                    })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">
                      {nameById.get(b.player_id) ?? `Player ${b.player_id.slice(0, 8)}…`}
                    </p>
                    <p className="text-xs text-text-muted">{b.title}</p>
                  </div>
                  <p className="text-xs tabular-nums text-text-muted">
                    {new Date(b.starts_at).toLocaleString('en-US', {
                      timeZone,
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <SectionHeader
          title="Roster (Supabase)"
          description="Full facility roster slice; cross-check names with bookings above."
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
      </div>
    </PageContainer>
  )
}
