'use client'

import { Search, CheckCircle2, ChevronRight } from 'lucide-react'
import { TabSwitcher } from '@/components/ui/tab-switcher'
import { EmptyState } from '@/components/ui/empty-state'
import { getPlayerById } from '@/lib/mock-data/players'
import { getSessionById } from '@/lib/mock-data/sessions'
import { cn, getInitials, getAvatarColor } from '@/lib/utils'
import type { Booking, Session } from '@/types'
import type { Tab } from '@/components/ui/tab-switcher'

function BookingRow({
  booking,
  session,
  isCheckedIn,
  isSelected,
  onClick,
}: {
  booking: Booking
  session: Session | undefined
  isCheckedIn: boolean
  isSelected: boolean
  onClick: () => void
}) {
  const player = getPlayerById(booking.playerId)
  if (!player) return null

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 border border-black/10 bg-white px-3 py-2.5 text-left shadow-lab transition-all duration-200',
        'hover:border-black/20 hover:shadow-lab-hover',
        isSelected && 'border-[#005700]/40 ring-1 ring-[#005700]/25'
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
          <span className="truncate text-sm font-medium text-[#1a1a1a]">
            {player.firstName} {player.lastName}
          </span>
          <span className="shrink-0 font-mono text-xs text-zinc-500">{player.ageGroup}</span>
        </div>
        {session && (
          <p className="truncate font-mono text-[11px] text-zinc-500">
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
        <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
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
  checkedInIds: Set<string>
  selectedPlayerId: string | null
  onSelectPlayer: (id: string) => void
  onVerifySearch: () => void
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col border border-black/10 bg-white">
      <div className="border-b border-black/10 p-4">
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder="SEARCH BY PLAYER NAME OR ID…"
            className="min-w-[200px] flex-1 border border-black/15 bg-[#f9f9f9] px-3 py-2.5 font-mono text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#005700]"
          />
          <button
            type="button"
            onClick={onVerifySearch}
            className="border border-black bg-[#f4fe00] px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-black shadow-lab transition-colors hover:bg-white"
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

