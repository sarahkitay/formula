'use client'

import {
  UserCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusPill, SessionTypeBadge } from '@/components/ui/badge'
import { getMembershipByPlayer } from '@/lib/mock-data/memberships'
import { formatDate, cn, getInitials, getAvatarColor } from '@/lib/utils'
import type { Player, Session, Booking } from '@/types'

export function PlayerCheckInDetail({
  player,
  booking,
  session,
  membership,
  isCheckedIn,
  onCheckIn,
}: {
  player: Player
  booking: Booking | undefined
  session: Session | undefined
  membership: ReturnType<typeof getMembershipByPlayer>
  isCheckedIn: boolean
  onCheckIn: () => void
}) {
  const sessionsLeft = player.sessionsRemaining
  const hasNoBooking = !booking
  const hasNoSessions = sessionsLeft === 0

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {hasNoBooking && (
        <div className="border border-warning/30 bg-warning/[0.07] p-4 shadow-lab">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <div>
              <p className="text-sm font-semibold text-warning">No booking</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                No booking for today // confirm with athlete before override.
              </p>
            </div>
          </div>
        </div>
      )}
      {hasNoSessions && (
        <div className="border border-error/40 bg-error/[0.08] p-4 shadow-lab">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" />
            <div>
              <p className="text-sm font-semibold text-error">No credits</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                0 sessions remaining // collect payment or renew before check-in.
              </p>
            </div>
          </div>
        </div>
      )}

      <Card className="border border-black/10 bg-white p-5">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'flex h-14 w-14 shrink-0 items-center justify-center text-lg font-bold',
              getAvatarColor(player.id)
            )}
          >
            {getInitials(player.firstName, player.lastName)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-[#1a1a1a]">
                {player.firstName} {player.lastName}
              </h3>
              <StatusPill status={player.status} />
            </div>
            <p className="mt-1 font-mono text-sm text-zinc-500">
              #{player.jerseyNumber} | {player.ageGroup} | {player.position}
            </p>
            <p className="mt-0.5 font-mono text-xs text-zinc-500">ID {player.id}</p>
          </div>
        </div>
      </Card>

      <div
        className={cn(
          'flex items-center gap-4 border border-black/10 bg-white p-4 shadow-lab',
          sessionsLeft === 0 && 'ring-1 ring-error/30',
          sessionsLeft > 0 && sessionsLeft <= 2 && 'ring-1 ring-warning/25'
        )}
      >
        <div className="text-center">
          <p
            className={cn(
              'font-mono text-4xl font-black leading-none',
              sessionsLeft === 0 ? 'text-error' : sessionsLeft <= 2 ? 'text-warning' : 'text-success'
            )}
          >
            {sessionsLeft}
          </p>
          <p className="mt-1 font-mono text-xs text-zinc-500">credits</p>
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-sm font-medium text-[#1a1a1a]">
            {membership ? membership.planName : 'No active membership'}
          </p>
          {membership && (
            <>
              <div className="h-1.5 overflow-hidden bg-zinc-200">
                <div
                  className={cn(
                    'h-full',
                    sessionsLeft === 0 ? 'bg-error' : sessionsLeft <= 2 ? 'bg-warning' : 'bg-primary'
                  )}
                  style={{
                    width:
                      typeof membership.sessionsTotal === 'number'
                        ? `${Math.max(4, (sessionsLeft / membership.sessionsTotal) * 100)}%`
                        : '100%',
                  }}
                />
              </div>
              <p className="font-mono text-xs text-zinc-500">
                {sessionsLeft} of {membership.sessionsTotal === 'unlimited' ? '∞' : membership.sessionsTotal}{' '}
                // expires {formatDate(membership.expiryDate)}
              </p>
            </>
          )}
        </div>
      </div>

      {session && (
        <Card className="space-y-3 border border-black/10 bg-white p-4" size="md">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Session // today
          </p>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#1a1a1a]">{session.title}</p>
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(session.startTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}{' '}
                  //
                  {new Date(session.endTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
                <span>{session.fieldName}</span>
              </div>
              <p className="font-mono text-xs text-zinc-500">Coach {session.coachName}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <SessionTypeBadge type={session.sessionType} />
              <StatusPill status={session.status} />
            </div>
          </div>
        </Card>
      )}

      <Card className="border border-black/10 bg-white p-4" size="md">
        {isCheckedIn ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#005700] bg-[#005700]/10 text-[#005700] shadow-lab">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-success">Checked in</p>
              <p className="font-mono text-xs text-zinc-500">
                {new Date().toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}{' '}
                // manual
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
              <Zap className="h-3.5 w-3.5 text-[#f4fe00]" />
              <span>Manual check-in // wristband sync pending</span>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={onCheckIn}
              disabled={hasNoSessions && !hasNoBooking}
              className="w-full"
              leftIcon={<UserCheck className="h-4 w-4" />}
            >
              Check in {player.firstName} {player.lastName}
            </Button>
            {hasNoSessions && (
              <Button variant="danger" size="sm" className="w-full">
                Override // collect payment
              </Button>
            )}
          </div>
        )}
      </Card>

      <Card className="space-y-2 border border-black/10 bg-white p-4" size="md">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Attendance
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Sessions attended</span>
          <span className="font-mono font-semibold text-[#1a1a1a]">{player.totalSessionsAttended}</span>
        </div>
        {membership && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Used this plan</span>
            <span className="font-mono font-semibold text-[#1a1a1a]">{membership.sessionsUsed}</span>
          </div>
        )}
      </Card>
    </div>
  )
}
