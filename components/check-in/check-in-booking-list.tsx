'use client'

import { Search, CheckCircle2, ChevronRight } from 'lucide-react'
import { TabSwitcher } from '@/components/ui/tab-switcher'
import { EmptyState } from '@/components/ui/empty-state'
import { getSessionById } from '@/lib/mock-data/sessions'
import { cn, getInitials, getAvatarColor } from '@/lib/utils'
import type { Booking, Player, Session } from '@/types'
import type { Tab } from '@/components/ui/tab-switcher'

function BookingRow({
  booking,
  session,
  roster,
  isCheckedIn,
  isSelected,
  onClick,
}: {
  booking: Booking
  session: Session | undefined
  roster: Player[]
  isCheckedIn: boolean
  isSelected: boolean
  onClick: () => void
}) {
  const player = roster.find(p => p.id === booking.playerId)
  if (!player) return null

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 border border-formula-frost/12 bg-formula-paper/[0.03] px-3 py-2.5 text-left shadow-[inset_0_1px_0_0_rgb(255_255_255_/_.03)] transition-all duration-200',
        'hover:border-formula-volt/30 hover:bg-formula-paper/[0.06]',
        isSelected && 'border-formula-volt/40 ring-1 ring-formula-volt/25'
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center text-xs font-bold',
          getAvatarColor(player.id)
        )}
      >
        {getInitials(player.firstName, player.lastName)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-sm font-medium text-formula-paper">
            {player.firstName} {player.lastName}
          </span>
          <span className="shrink-0 font-mono text-xs text-formula-mist">{player.ageGroup}</span>
        </div>
        {session && (
          <p className="truncate font-mono text-[11px] text-formula-frost/75">
            {new Date(session.startTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}{' '}
            // {session.title}
          </p>
        )}
      </div>
      {isCheckedIn ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
      ) : (
        <ChevronRight className="h-4 w-4 shrink-0 text-formula-mist" />
      )}
    </button>
  )
}

export function CheckInBookingList({
  sessionTabs,
  activeSession,
  onSessionChange,
  query,
  onQueryChange,
  bookingRows,
  roster,
  checkedInIds,
  selectedPlayerId,
  onSelectPlayer,
  onVerifySearch,
}: {
  sessionTabs: Tab[]
  activeSession: string
  onSessionChange: (id: string) => void
  query: string
  onQueryChange: (q: string) => void
  bookingRows: Booking[]
  roster: Player[]
  checkedInIds: Set<string>
  selectedPlayerId: string | null
  onSelectPlayer: (id: string) => void
  onVerifySearch: () => void
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col border border-formula-frost/12 bg-formula-paper/[0.04] shadow-[inset_0_1px_0_0_rgb(255_255_255_/_.04)]">
      <div className="border-b border-formula-frost/12 p-4">
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder="SEARCH BY PLAYER NAME OR ID…"
            className="min-w-[200px] flex-1 border border-formula-frost/16 bg-formula-deep/40 px-3 py-2.5 font-mono text-sm text-formula-paper placeholder:text-formula-mist/60 outline-none transition-colors focus:border-formula-volt/50"
          />
          <button
            type="button"
            onClick={onVerifySearch}
            className="border border-formula-volt/50 bg-formula-volt px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-formula-base transition-[filter,background-color] hover:brightness-105"
          >
            Verify
          </button>
        </div>
        <TabSwitcher
          tabs={sessionTabs}
          activeTab={activeSession}
          onChange={onSessionChange}
          variant="pill"
          className="w-full text-xs"
        />
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3 lab-scrollbar">
        {bookingRows.length === 0 ? (
          <EmptyState
            icon={<Search />}
            title={query ? 'No matches' : 'No bookings'}
            description={query ? 'Try another query' : 'Bookings appear when athletes register'}
            compact
          />
        ) : (
          bookingRows.map(booking => (
            <BookingRow
              key={booking.id}
              booking={booking}
              roster={roster}
              session={getSessionById(booking.sessionId)}
              isCheckedIn={checkedInIds.has(booking.playerId)}
              isSelected={selectedPlayerId === booking.playerId}
              onClick={() => onSelectPlayer(booking.playerId)}
            />
          ))
        )}
      </div>
    </div>
  )
}

