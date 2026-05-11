'use client'

import * as React from 'react'
import { MapPin, Search } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export type PortalHubNavLink = { label: string; href: string }

type Props = {
  navLinks: PortalHubNavLink[]
  /** Shown in directions panel */
  facilityAddress: string
  mapsUrl: string
  /** e.g. Admin OS vs Coach station */
  variant?: 'admin' | 'coach'
}

export function PortalHubToolbar({ navLinks, facilityAddress, mapsUrl, variant = 'admin' }: Props) {
  const [q, setQ] = React.useState('')
  const [dirOpen, setDirOpen] = React.useState(false)

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return navLinks.filter(n => n.label.toLowerCase().includes(s) || n.href.toLowerCase().includes(s)).slice(0, 8)
  }, [navLinks, q])

  const dark = variant === 'admin'

  return (
    <div
      className={cn(
        '-mx-6 mb-6 border-b px-6 pb-4',
        dark ? 'border-formula-frost/10 bg-formula-deep/40' : 'border-black/10 bg-black/[0.03]'
      )}
    >
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 max-w-xl">
          <Search
            className={cn('pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2', dark ? 'text-formula-mist' : 'text-zinc-500')}
            aria-hidden
          />
          <input
            type="search"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search pages…"
            className={cn(
              'h-10 w-full rounded-md border py-2 pl-9 pr-3 font-mono text-[12px] outline-none ring-formula-volt/30 focus:ring-2',
              dark
                ? 'border-formula-frost/18 bg-formula-base/60 text-formula-paper placeholder:text-formula-mist/50'
                : 'border-black/10 bg-white text-[#1a1a1a]'
            )}
            aria-label="Search portal pages"
            autoComplete="off"
          />
          {q.trim() && filtered.length > 0 ? (
            <ul
              className={cn(
                'absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border py-1 shadow-lg',
                dark ? 'border-formula-frost/20 bg-formula-deep text-formula-paper' : 'border-black/10 bg-white text-[#1a1a1a]'
              )}
            >
              {filtered.map(n => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className={cn(
                      'block px-3 py-2 font-mono text-[11px] hover:bg-white/5',
                      dark && 'hover:bg-formula-paper/[0.06]'
                    )}
                    onClick={() => setQ('')}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setDirOpen(v => !v)}
            className={cn(
              'inline-flex h-10 items-center gap-2 rounded-md border px-3 font-mono text-[10px] font-bold uppercase tracking-wider',
              dark
                ? 'border-formula-frost/20 bg-formula-paper/[0.05] text-formula-frost/90 hover:border-formula-volt/35 hover:text-formula-paper'
                : 'border-black/10 bg-white text-[#1a1a1a] hover:border-[#005700]/40'
            )}
          >
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Directions
          </button>
        </div>
      </div>
      {dirOpen ? (
        <div
          className={cn(
            'mx-auto mt-3 max-w-[1600px] rounded-md border p-4 font-mono text-[11px] leading-relaxed',
            dark ? 'border-formula-frost/16 bg-formula-base/50 text-formula-frost/90' : 'border-black/10 bg-white text-zinc-700'
          )}
        >
          <p className="font-bold uppercase tracking-[0.12em] text-formula-volt">Facility</p>
          <p className="mt-2">{facilityAddress}</p>
          <p className="mt-2 text-formula-mist">
            Main entrance faces Calvert Street. For first visit, allow a few extra minutes for parking and check-in at the front
            desk.
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-formula-volt underline-offset-2 hover:underline"
          >
            Open in Apple Maps
          </a>
        </div>
      ) : null}
    </div>
  )
}
