'use client'

import React, { useEffect, useState } from 'react'
import { FileText, Send, Clock } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { getInitials, getAvatarColor, cn } from '@/lib/utils'
import type { Player } from '@/types'

type SavedNote = { id: string; playerId: string; content: string; date: string }

export default function CoachNotesPage() {
  const [roster, setRoster] = useState<Player[]>([])
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([])

  useEffect(() => {
    let cancelled = false
    void fetch('/api/facility/players')
      .then(r => r.json() as Promise<{ players?: Player[] }>)
      .then(body => {
        if (!cancelled) setRoster(body.players ?? [])
      })
      .catch(() => {
        if (!cancelled) setRoster([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const selectedPlayer = selectedPlayerId ? roster.find(p => p.id === selectedPlayerId) : null
  const playerNotes = selectedPlayerId ? savedNotes.filter(n => n.playerId === selectedPlayerId) : []

  const handleSaveNote = () => {
    if (!selectedPlayerId || !noteText.trim()) return
    setSavedNotes(prev => [
      {
        id: `n-${Date.now()}`,
        playerId: selectedPlayerId,
        content: noteText.trim(),
        date: new Date().toISOString(),
      },
      ...prev,
    ])
    setNoteText('')
  }

  return (
    <PageContainer fullWidth className="flex h-[calc(100vh-3.5rem)] flex-col">
      <PageHeader title="Player notes" subtitle="Local-only draft notes · persistence not wired" className="mb-5" />

      <div className="flex min-h-0 flex-1 gap-5 overflow-hidden">
        <aside className="flex w-72 shrink-0 flex-col gap-3 overflow-y-auto">
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            {roster.length === 0 ? (
              <p className="p-4 text-center text-xs text-text-muted">Load roster from Supabase (players table).</p>
            ) : (
              roster.map(player => {
                const noteCount = savedNotes.filter(n => n.playerId === player.id).length
                return (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => setSelectedPlayerId(player.id)}
                    className={cn(
                      'flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-0',
                      selectedPlayerId === player.id ? 'bg-accent/8' : 'hover:bg-surface-raised'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                        getAvatarColor(player.id)
                      )}
                    >
                      {getInitials(player.firstName, player.lastName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'truncate text-sm font-medium',
                          selectedPlayerId === player.id ? 'text-accent-foreground' : 'text-text-primary'
                        )}
                      >
                        {player.firstName} {player.lastName}
                      </p>
                      <p className="text-xs text-text-muted">
                        #{player.jerseyNumber ?? 'n/a'} · {player.position}
                      </p>
                    </div>
                    {noteCount > 0 && (
                      <span className="shrink-0 rounded-full border border-border bg-surface-raised px-1.5 py-0.5 text-xs text-text-muted">
                        {noteCount}
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto">
          {!selectedPlayer ? (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState
                icon={<FileText />}
                title="Select a player"
                description="Choose an athlete from the roster to draft notes"
              />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                    getAvatarColor(selectedPlayer.id)
                  )}
                >
                  {getInitials(selectedPlayer.firstName, selectedPlayer.lastName)}
                </div>
                <div>
                  <p className="font-semibold text-text-primary">
                    {selectedPlayer.firstName} {selectedPlayer.lastName}
                  </p>
                  <p className="text-xs text-text-muted">
                    #{selectedPlayer.jerseyNumber ?? 'n/a'} · {selectedPlayer.position} · {selectedPlayer.ageGroup}
                  </p>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {playerNotes.length} this session
                </Badge>
              </div>

              <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Add session note</p>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder={`Observations for ${selectedPlayer.firstName}…`}
                  rows={5}
                  className="w-full resize-none rounded-lg border border-border bg-surface-raised px-3 py-2.5 text-sm text-text-primary transition-colors placeholder:text-text-muted focus:border-border-bright focus:outline-none focus:ring-1 focus:ring-accent/20"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-muted">{noteText.length} characters</p>
                  <Button
                    variant="primary"
                    size="sm"
                    type="button"
                    onClick={handleSaveNote}
                    disabled={!noteText.trim()}
                    leftIcon={<Send className="h-3.5 w-3.5" />}
                  >
                    Save draft
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Draft timeline</p>
                {playerNotes.length === 0 ? (
                  <div className="rounded-xl border border-border bg-surface p-6 text-center">
                    <p className="text-sm text-text-muted">No notes yet for this player.</p>
                  </div>
                ) : (
                  playerNotes.map(note => (
                    <div key={note.id} className="space-y-2 rounded-xl border border-border bg-surface p-4">
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(note.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}{' '}
                          at{' '}
                          {new Date(note.date).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-text-primary">{note.content}</p>
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
