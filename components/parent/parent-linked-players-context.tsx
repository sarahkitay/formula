'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PARENT_LINKED_PLAYER_EMBED } from '@/lib/supabase/parent-linked-players-query'
import { supabase } from '@/lib/supabase'

export type ParentLinkedPlayer = {
  id: string
  firstName: string
  lastName: string
  ageGroup: string
}

type Ctx = {
  players: ParentLinkedPlayer[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}

const ParentLinkedPlayersContext = createContext<Ctx | null>(null)

function embedOne<T>(row: T | T[] | null | undefined): T | null {
  if (row == null) return null
  return Array.isArray(row) ? (row[0] ?? null) : row
}

function mapRows(data: unknown): ParentLinkedPlayer[] {
  if (!Array.isArray(data)) return []
  const out: ParentLinkedPlayer[] = []
  for (const row of data) {
    const r = row as { players?: unknown }
    const p = embedOne(r.players as Record<string, unknown> | Record<string, unknown>[] | null)
    if (!p || typeof p.id !== 'string') continue
    out.push({
      id: p.id,
      firstName: String(p.first_name ?? '').trim(),
      lastName: String(p.last_name ?? '').trim(),
      ageGroup: String(p.age_group ?? '').trim() || 'Athlete',
    })
  }
  out.sort((a, b) => {
    const an = `${a.firstName} ${a.lastName}`.trim() || a.id
    const bn = `${b.firstName} ${b.lastName}`.trim() || b.id
    return an.localeCompare(bn)
  })
  return out
}

export function ParentLinkedPlayersProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<ParentLinkedPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setError(null)
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser()
    if (userErr || !user) {
      setPlayers([])
      setLoading(false)
      if (userErr) setError(userErr.message)
      return
    }

    const { data, error: qErr } = await supabase
      .from('parent_players')
      .select(`players ( ${PARENT_LINKED_PLAYER_EMBED} )`)
      .eq('parent_user_id', user.id)

    if (qErr) {
      setPlayers([])
      setError(qErr.message)
    } else {
      setPlayers(mapRows(data))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const value = useMemo<Ctx>(() => ({ players, loading, error, reload }), [players, loading, error, reload])

  return <ParentLinkedPlayersContext.Provider value={value}>{children}</ParentLinkedPlayersContext.Provider>
}

export function useParentLinkedPlayers(): Ctx {
  const ctx = useContext(ParentLinkedPlayersContext)
  if (!ctx) {
    throw new Error('useParentLinkedPlayers must be used within ParentLinkedPlayersProvider')
  }
  return ctx
}

/** For optional use outside strict provider (returns empty while loading). */
export function useParentLinkedPlayersOptional(): Ctx | null {
  return useContext(ParentLinkedPlayersContext)
}
