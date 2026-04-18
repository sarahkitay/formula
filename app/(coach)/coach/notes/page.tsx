'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { FileText, Send, Clock, Loader2 } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { getInitials, getAvatarColor, cn } from '@/lib/utils'
import type { Player } from '@/types'
import {
  fetchCoachNotesForPlayer,
  fetchCoachNotesForPlayers,
  insertCoachNote,
} from '@/lib/coach/coach-notes-client'
import type { CoachNoteRow } from '@/types/coach-note'

function countByPlayer(rows: Pick<CoachNoteRow, 'player_id'>[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const r of rows) {
    m.set(r.player_id, (m.get(r.player_id) ?? 0) + 1)
  }
  return m
}

export default function CoachNotesPage() {
  const [roster, setRoster] = useState<Player[]>([])
  const [rosterLoading, setRosterLoading] = useState(true)
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [notesByPlayer, setNotesByPlayer] = useState<Map<string, CoachNoteRow[]>>(new Map())
  const [noteCounts, setNoteCounts] = useState<Map<string, number>>(new Map())
  const [notesLoading, setNotesLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setRosterLoading(true)
    void fetch('/api/facility/players')
      .then(r => r.json() as Promise<{ players?: Player[] }>)
      .then(body => {
        if (!cancelled) setRoster(body.players ?? [])
      })
      .catch(() => {
        if (!cancelled) setRoster([])
      })
      .finally(() => {
        if (!cancelled) setRosterLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (roster.length === 0) {
      setNoteCounts(new Map())
      return
    }
    let cancelled = false
    const ids = roster.map(p => p.id)
    void fetchCoachNotesForPlayers(ids).then(({ data, error: e }) => {
      if (cancelled) return
      if (e || !data) {
        setNoteCounts(new Map())
        return
      }
      setNoteCounts(countByPlayer(data))
    })
    return () => {
      cancelled = true
    }
  }, [roster])

  useEffect(() => {
    if (!selectedPlayerId) return
    let cancelled = false
    setNotesLoading(true)
    setError(null)
    void fetchCoachNotesForPlayer(selectedPlayerId).then(({ data, error: e }) => {
      if (cancelled) return
      setNotesLoading(false)
      if (e) {
        setError(e.message)
        return
      }
      setNotesByPlayer(prev => {
        const next = new Map(prev)
        next.set(selectedPlayerId, data ?? [])
        return next
      })
    })
    return () => {
      cancelled = true
    }
  }, [selectedPlayerId])

  const selectedPlayer = selectedPlayerId ? roster.find(p => p.id === selectedPlayerId) : null
  const playerNotes = selectedPlayerId ? (notesByPlayer.get(selectedPlayerId) ?? []) : []

  const handleSaveNote = async () => {
    if (!selectedPlayerId || !noteText.trim()) return
    setSaving(true)
    setError(null)
    const { data, error: e } = await insertCoachNote(selectedPlayerId, noteText)
    setSaving(false)
    if (e || !data) {
      setError(e?.message ?? 'Could not save note')
      return
    }
    setNoteText('')
    setNotesByPlayer(prev => {
      const next = new Map(prev)
      const cur = next.get(selectedPlayerId) ?? []
      next.set(selectedPlayerId, [data, ...cur])
      return next
    })
    setNoteCounts(prev => {
      const next = new Map(prev)
      next.set(selectedPlayerId, (next.get(selectedPlayerId) ?? 0) + 1)
      return next
    })
  }

  const subtitle = useMemo(
    () => 'Saved to Supabase (coach_notes) · staff role required',
    []
  )

  return (
    <PageContainer fullWidth className="flex h-[calc(100vh-3.5rem)] flex-col">
      <PageHeader title="Player notes" subtitle={subtitle} className="mb-5" />

      {error ? (
        <p className="mb-3 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-muted">{error}</p>
      ) : null}

      <div className="flex min-h-0 flex-1 gap-5 overflow-hidden">
        <aside className="flex w-72 shrink-0 flex-col gap-3 overflow-y-auto">
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            {rosterLoading ? (
              <p className="flex items-center justify-center gap-2 p-4 text-center text-xs text-text-muted">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading roster…
              </p>
            ) : roster.length === 0 ? (
              <p className="p-4 text-center text-xs text-text-muted">No players from Supabase.</p>
            ) : (
              roster.map(player => {
                const noteCount = noteCounts.get(player.id) ?? 0
                return (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlayerId(player.id)
                      setError(null)
                    }}
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
                description="Choose an athlete from the roster to view and add notes"
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
                  {notesLoading ? '…' : playerNotes.length} saved
                </Badge>
              </div>

              <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Add note</p>
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
                    onClick={() => void handleSaveNote()}
                    disabled={!noteText.trim() || saving}
                    leftIcon={saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  >
                    {saving ? 'Saving…' : 'Save note'}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">History</p>
                {notesLoading ? (
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface p-6 text-sm text-text-muted">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading notes…
                  </div>
                ) : playerNotes.length === 0 ? (
                  <div className="rounded-xl border border-border bg-surface p-6 text-center">
                    <p className="text-sm text-text-muted">No notes yet for this player.</p>
                  </div>
                ) : (
                  playerNotes.map(note => (
                    <div key={note.id} className="space-y-2 rounded-xl border border-border bg-surface p-4">
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(note.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}{' '}
                          at{' '}
                          {new Date(note.created_at).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-text-primary">{note.body}</p>
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
