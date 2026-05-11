'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { MapPin, Search } from 'lucide-react'
import { filterParentPortalSearch } from '@/lib/parent/parent-portal-search-items'
import { cn } from '@/lib/utils'
import { FACILITY_APPLE_MAPS_URL, SITE } from '@/lib/site-config'

export function ParentPortalQuickSearch() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [dirOpen, setDirOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => filterParentPortalSearch(q), [q])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const onPick = useCallback(() => {
    setOpen(false)
    setQ('')
  }, [])

  return (
    <div className="mx-auto mb-6 w-full max-w-[1400px] space-y-2 px-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div ref={wrapRef} className="relative min-w-0 flex-1">
          <label className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
            <span className="sr-only">Search portal</span>
            <div className="relative mt-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-formula-mist/70"
            aria-hidden
          />
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={e => {
              setQ(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search portal - e.g. book assessment, progress, schedule…"
            className={cn(
              'w-full rounded-sm border border-formula-frost/15 bg-formula-paper/[0.04] py-2.5 pl-10 pr-3',
              'font-sans text-[13px] font-normal normal-case tracking-normal text-formula-paper',
              'placeholder:text-formula-mist/50 outline-none focus:border-formula-volt/35'
            )}
            autoComplete="off"
          />
            </div>
          </label>
          {open && results.length > 0 ? (
        <ul
          className="absolute z-50 mt-1 max-h-[min(70vh,22rem)] w-full overflow-auto rounded-sm border border-formula-frost/15 bg-formula-deep/95 py-1 shadow-lg backdrop-blur-md"
          role="listbox"
        >
          {results.map(item => (
            <li key={item.id} role="option">
              <Link
                href={item.href}
                onClick={onPick}
                className="block px-3 py-2.5 text-left transition-colors hover:bg-formula-paper/[0.06]"
              >
                <span className="block text-sm font-medium text-formula-paper">{item.label}</span>
                <span className="mt-0.5 block text-xs text-formula-mist">{item.description}</span>
              </Link>
            </li>
          ))}
        </ul>
          ) : null}
          {open && q.trim() && results.length === 0 ? (
            <p className="absolute z-50 mt-1 w-full rounded-sm border border-formula-frost/15 bg-formula-deep/95 px-3 py-2 text-sm text-formula-mist">
              No matches - try “schedule”, “progress”, or “billing”.
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setDirOpen(v => !v)}
          className="inline-flex h-10 shrink-0 items-center gap-2 self-stretch rounded-sm border border-formula-frost/18 bg-formula-paper/[0.05] px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/90 hover:border-formula-volt/35 hover:text-formula-paper sm:self-auto"
        >
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          Directions
        </button>
      </div>
      {dirOpen ? (
        <div className="rounded-sm border border-formula-frost/15 bg-formula-deep/60 p-4 font-mono text-[11px] leading-relaxed text-formula-frost/90">
          <p className="font-bold uppercase tracking-[0.12em] text-formula-volt">Facility</p>
          <p className="mt-2">{SITE.facilityAddressLine}</p>
          <a
            href={FACILITY_APPLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-formula-volt underline-offset-2 hover:underline"
          >
            Open in Apple Maps
          </a>
        </div>
      ) : null}
    </div>
  )
}
