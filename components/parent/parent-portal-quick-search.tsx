'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { filterParentPortalSearch } from '@/lib/parent/parent-portal-search-items'
import { cn } from '@/lib/utils'

export function ParentPortalQuickSearch() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
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
    <div ref={wrapRef} className="relative mx-auto mb-6 w-full max-w-[1400px] px-0">
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
            placeholder="Search portal — e.g. book assessment, progress, schedule…"
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
          No matches — try “schedule”, “progress”, or “billing”.
        </p>
      ) : null}
    </div>
  )
}
