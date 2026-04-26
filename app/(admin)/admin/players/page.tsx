'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Plus } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { SearchInput } from '@/components/ui/search-input'
import { Button } from '@/components/ui/button'
import { Badge, StatusPill } from '@/components/ui/badge'
import { DataTable, Column } from '@/components/ui/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { TabSwitcher } from '@/components/ui/tab-switcher'
import { searchPlayers } from '@/lib/mock-data/players'
import { getMembershipByPlayer } from '@/lib/mock-data/memberships'
import { formatDate, getInitials, getAvatarColor, cn } from '@/lib/utils'
import { Player, AgeGroup } from '@/types'

const AGE_GROUPS: Array<AgeGroup | 'All'> = ['All', 'U6', 'U8', 'U10', 'U12', 'U14', 'U16', 'U18', 'Adult']

export default function PlayersPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [addHint, setAddHint] = useState(false)
  const [ageFilter, setAgeFilter] = useState<AgeGroup | 'All'>('All')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [roster, setRoster] = useState<Player[]>([])
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [rosterError, setRosterError] = useState<string | null>(null)

  const loadRoster = useCallback(async () => {
    setRosterError(null)
    try {
      const res = await fetch('/api/facility/players')
      const body = (await res.json()) as {
        players?: Player[]
        configured?: boolean
        error?: string
      }
      setConfigured(body.configured ?? true)
      if (body.error) setRosterError(body.error)
      setRoster(body.players ?? [])
    } catch {
      setConfigured(false)
      setRoster([])
      setRosterError('Failed to load roster')
    }
  }, [])

  useEffect(() => {
    void loadRoster()
  }, [loadRoster])

  const filtered = useMemo(() => {
    let players = query ? searchPlayers(query, roster) : roster
    if (ageFilter !== 'All') players = players.filter(p => p.ageGroup === ageFilter)
    if (statusFilter !== 'all') players = players.filter(p => p.status === statusFilter)
    return players
  }, [query, ageFilter, statusFilter, roster])

  const columns: Column<Player>[] = [
    {
      key: 'name',
      header: 'Player',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className={cn('h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0', getAvatarColor(p.id))}>
            {getInitials(p.firstName, p.lastName)}
          </div>
          <div>
            <p className="font-medium text-text-primary">{p.firstName} {p.lastName}</p>
            <p className="text-xs text-text-muted">#{p.jerseyNumber ?? 'n/a'} · {p.position}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'ageGroup',
      header: 'Age Group',
      render: (p) => <Badge variant="outline">{p.ageGroup}</Badge>,
    },
    {
      key: 'membership',
      header: 'Membership',
      render: (p) => {
        const mem = getMembershipByPlayer(p.id)
        return mem ? (
          <span className="text-text-primary text-sm">{mem.planName}</span>
        ) : (
          <span className="text-text-muted text-sm">No membership</span>
        )
      },
    },
    {
      key: 'sessionsRemaining',
      header: 'Sessions Left',
      render: (p) => (
        <span className={cn(
          'text-sm font-semibold',
          p.sessionsRemaining === 0 ? 'text-error' : p.sessionsRemaining <= 2 ? 'text-warning' : 'text-success'
        )}>
          {p.sessionsRemaining}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => <StatusPill status={p.status} />,
    },
    {
      key: 'joinedAt',
      header: 'Joined',
      render: (p) => <span className="text-text-secondary text-sm">{formatDate(p.joinedAt)}</span>,
    },
  ]

  const activeCount = roster.filter(p => p.status === 'active').length
  const subtitle =
    configured === false
      ? 'Roster could not be loaded. Try again later or contact support.'
      : rosterError
        ? rosterError
        : `${activeCount} active in roster`

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Players"
          subtitle={subtitle}
          actions={
            <Button
              variant="primary"
              type="button"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setAddHint(true)}
            >
              Add Player
            </Button>
          }
        />

        {addHint && (
          <p className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text-secondary">
            Add-player intake from this screen is not available yet. Use your usual intake process until it is enabled here.
          </p>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            placeholder="Search by name or ID…"
            value={query}
            onChange={setQuery}
            className="flex-1 max-w-sm"
          />
          <div className="flex items-center gap-2">
            <select
              value={ageFilter}
              onChange={e => setAgeFilter(e.target.value as AgeGroup | 'All')}
              className="h-9 rounded-lg border border-border bg-surface-raised px-3 text-sm text-text-primary focus:outline-none focus:border-border-bright"
            >
              {AGE_GROUPS.map(g => <option key={g} value={g}>{g === 'All' ? 'All Ages' : g}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
              className="h-9 rounded-lg border border-border bg-surface-raised px-3 text-sm text-text-primary focus:outline-none focus:border-border-bright"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline">{roster.filter(p => p.status === 'active').length} active</Badge>
          <Badge variant="error">{roster.filter(p => p.sessionsRemaining === 0).length} no sessions remaining</Badge>
          <Badge variant="warning">{roster.filter(p => p.sessionsRemaining > 0 && p.sessionsRemaining <= 2).length} low sessions</Badge>
          <Badge variant="default">{roster.filter(p => !p.membershipId).length} no membership</Badge>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          keyField="id"
          emptyTitle="No players found"
          emptyDescription="Try adjusting your search or filters"
          emptyIcon={<Users />}
          onRowClick={p => router.push(`/admin/performance/${p.id}`)}
        />
      </div>
    </PageContainer>
  )
}
