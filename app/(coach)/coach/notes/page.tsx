'use client'

import React, { useState } from 'react'
import { FileText, Send, Clock } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { getGroupsByCoach } from '@/lib/mock-data/groups'
import { getPlayersByGroup, getPlayerById } from '@/lib/mock-data/players'
import { getInitials, getAvatarColor, cn } from '@/lib/utils'

const COACH_ID = 'coach-1'

const MOCK_NOTES = [
  { id: 'n-1', playerId: 'player-1', content: 'Excellent first touch in tight spaces today. Work on weak-foot crossing; showed hesitation on left side during 2v2 drill.', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'n-2', playerId: 'player-2', content: 'Great pace and direct running. Decision-making in the final third has improved significantly. Keep pushing her on positioning.', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'n-3', playerId: 'player-1', content: 'Better distribution today. Long switch of play was accurate. Needs to hold shape better when team is out of possession.', date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
]

export default function CoachNotesPage() {
  const groups = getGroupsByCoach(COACH_ID)
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id ?? '')
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [savedNotes, setSavedNotes] = useState(MOCK_NOTES)

  const players = getPlayersByGroup(selectedGroupId)
  const selectedPlayer = selectedPlayerId ? getPlayerById(selectedPlayerId) : null
  const playerNotes = selectedPlayerId ? savedNotes.filter(n => n.playerId === selectedPlayerId) : []

  const handleSaveNote = () => {
    if (!selectedPlayerId || !noteText.trim()) return
    setSavedNotes(prev => [{
      id: `n-${Date.now()}`,
      playerId: selectedPlayerId,
      content: noteText.trim(),
      date: new Date().toISOString(),
    }, ...prev])
    setNoteText('')
  }

  return (
    <PageContainer fullWidth className="h-[calc(100vh-3.5rem)] flex flex-col">
      <PageHeader title="Player Notes" subtitle="Add session notes and observations" className="mb-5" />

      <div className="flex-1 flex gap-5 min-h-0 overflow-hidden">
        {/* Left: groups + players */}
        <aside className="w-72 shrink-0 flex flex-col gap-3 overflow-y-auto">
          {/* Group selector */}
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            {groups.map(group => (
              <button
                key={group.id}
                onClick={() => { setSelectedGroupId(group.id); setSelectedPlayerId(null) }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-4 py-3 text-left text-sm transition-colors border-b border-border last:border-0',
                  selectedGroupId === group.id ? 'bg-primary/15 text-accent-foreground' : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
                )}
              >
                <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: group.color }} />
                <span className="font-medium truncate">{group.name}</span>
                <Badge variant="outline" size="sm" className="ml-auto shrink-0">{group.playerIds.length}</Badge>
              </button>
            ))}
          </div>

          {/* Player list */}
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            {players.length === 0 ? (
              <p className="text-xs text-text-muted p-4 text-center">No players in this group</p>
            ) : (
              players.map(player => {
                const noteCount = savedNotes.filter(n => n.playerId === player.id).length
                return (
                  <button
                    key={player.id}
                    onClick={() => setSelectedPlayerId(player.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-border last:border-0',
                      selectedPlayerId === player.id ? 'bg-accent/8' : 'hover:bg-surface-raised'
                    )}
                  >
                    <div className={cn('h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0', getAvatarColor(player.id))}>
                      {getInitials(player.firstName, player.lastName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-medium truncate', selectedPlayerId === player.id ? 'text-accent-foreground' : 'text-text-primary')}>
                        {player.firstName} {player.lastName}
                      </p>
                      <p className="text-xs text-text-muted">#{player.jerseyNumber} · {player.position}</p>
                    </div>
                    {noteCount > 0 && (
                      <span className="text-xs bg-surface-raised border border-border text-text-muted rounded-full px-1.5 py-0.5 shrink-0">
                        {noteCount}
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </aside>

        {/* Right: note editor + timeline */}
        <main className="flex-1 flex flex-col gap-4 min-w-0 overflow-y-auto">
          {!selectedPlayer ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={<FileText />}
                title="Select a player"
                description="Choose a player from the left panel to view and add notes"
              />
            </div>
          ) : (
            <>
              {/* Player header */}
              <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                <div className={cn('h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0', getAvatarColor(selectedPlayer.id))}>
                  {getInitials(selectedPlayer.firstName, selectedPlayer.lastName)}
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{selectedPlayer.firstName} {selectedPlayer.lastName}</p>
                  <p className="text-xs text-text-muted">#{selectedPlayer.jerseyNumber} · {selectedPlayer.position} · {selectedPlayer.ageGroup}</p>
                </div>
                <Badge variant="outline" className="ml-auto">{playerNotes.length} notes</Badge>
              </div>

              {/* Note input */}
              <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Add Session Note</p>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder={`Session observations for ${selectedPlayer.firstName}…\n\nInclude: technique observations, areas of improvement, standout moments, next session focus.`}
                  rows={5}
                  className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-border-bright focus:ring-1 focus:ring-accent/20 transition-colors"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-muted">{noteText.length} characters</p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveNote}
                    disabled={!noteText.trim()}
                    leftIcon={<Send className="h-3.5 w-3.5" />}
                  >
                    Save Note
                  </Button>
                </div>
              </div>

              {/* Notes timeline */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Note History</p>
                {playerNotes.length === 0 ? (
                  <div className="rounded-xl border border-border bg-surface p-6 text-center">
                    <p className="text-sm text-text-muted">No notes yet for this player.</p>
                  </div>
                ) : (
                  playerNotes.map(note => (
                    <div key={note.id} className="rounded-xl border border-border bg-surface p-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(note.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                        <span>· Marcus Rivera</span>
                      </div>
                      <p className="text-sm text-text-primary leading-relaxed">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </PageContainer>
  )
}
