'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CornerDownLeft, Search } from 'lucide-react'
import {
  defaultSiteSearchResults,
  searchSitePages,
  type SiteSearchItem,
} from '@/lib/marketing/site-search-index'
import { cn } from '@/lib/utils'

function isEditableTarget(el: EventTarget | null): boolean {
  if (!el || !(el instanceof HTMLElement)) return false
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (el.isContentEditable) return true
  return Boolean(el.closest('input, textarea, select, [contenteditable="true"]'))
}

export function SiteSearchModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const t = q.trim()
    return t ? searchSitePages(t) : defaultSiteSearchResults()
  }, [q])

  const resultsRef = useRef(results)
  resultsRef.current = results
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    setActive(0)
  }, [q, open])

  useEffect(() => {
    if (active >= results.length) setActive(Math.max(0, results.length - 1))
  }, [active, results.length])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 0)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = prev
    }
  }, [open])

  const close = useCallback(() => {
    setOpen(false)
    setQ('')
    setActive(0)
  }, [])

  const go = useCallback(
    (item: SiteSearchItem) => {
      close()
      router.push(item.href)
    },
    [close, router]
  )

  useEffect(() => {
    function onPalette(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        if (isEditableTarget(e.target) && !panelRef.current?.contains(e.target as Node)) return
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    window.addEventListener('keydown', onPalette)
    return () => window.removeEventListener('keydown', onPalette)
  }, [])

  useEffect(() => {
    if (!open) return
    function onNav(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      const list = resultsRef.current
      const idx = activeRef.current
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive(Math.min(list.length - 1, idx + 1))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive(Math.max(0, idx - 1))
        return
      }
      if (e.key === 'Enter' && list[idx]) {
        e.preventDefault()
        go(list[idx])
      }
    }
    window.addEventListener('keydown', onNav)
    return () => window.removeEventListener('keydown', onNav)
  }, [open, close, go])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex items-center gap-2 rounded-sm border border-formula-frost/18 bg-formula-paper/[0.04] px-2.5 py-1.5',
          'font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-formula-mist transition-colors',
          'hover:border-formula-volt/35 hover:text-formula-paper md:px-3 md:py-2 md:text-[10px]'
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Open site search"
      >
        <Search className="h-3.5 w-3.5 shrink-0 text-formula-volt/90 md:h-4 md:w-4" aria-hidden />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-formula-frost/25 bg-formula-deep/80 px-1.5 py-0.5 font-mono text-[8px] font-normal text-formula-mist/90 lg:inline">
          ⌘K
        </kbd>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100]" data-site-search>
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close search"
            onClick={close}
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-search-title"
            className={cn(
              'absolute left-1/2 top-[max(4rem,12vh)] w-[min(100%-1.5rem,32rem)] -translate-x-1/2',
              'rounded-xl border border-formula-frost/20 bg-formula-deep/95 shadow-2xl ring-1 ring-black/40'
            )}
          >
            <div className="border-b border-formula-frost/12 p-3 md:p-4">
              <h2 id="site-search-title" className="sr-only">
                Search Formula Soccer Center
              </h2>
              <label className="relative block">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-formula-mist/70"
                  aria-hidden
                />
                <input
                  ref={inputRef}
                  type="search"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Programs, bookings, rentals…"
                  autoComplete="off"
                  className={cn(
                    'w-full rounded-lg border border-formula-frost/15 bg-formula-paper/[0.06] py-2.5 pl-10 pr-3',
                    'font-sans text-sm text-formula-paper placeholder:text-formula-mist/45',
                    'outline-none focus:border-formula-volt/40'
                  )}
                />
              </label>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9px] text-formula-mist/75">
                <span>↑↓ to move</span>
                <span className="inline-flex items-center gap-1">
                  <CornerDownLeft className="h-3 w-3" aria-hidden />
                  to open
                </span>
                <span>esc to close</span>
              </p>
            </div>

            <ul className="max-h-[min(55vh,22rem)] overflow-y-auto py-1" role="listbox" aria-label="Results">
              {results.map((item, i) => (
                <li key={item.id} role="option" aria-selected={i === active}>
                  <Link
                    href={item.href}
                    onMouseEnter={() => setActive(i)}
                    onClick={e => {
                      e.preventDefault()
                      go(item)
                    }}
                    className={cn(
                      'block px-4 py-2.5 transition-colors',
                      i === active ? 'bg-formula-volt/12 text-formula-paper' : 'text-formula-frost/90 hover:bg-formula-paper/[0.05]'
                    )}
                  >
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span className="mt-0.5 block text-xs text-formula-mist">{item.description}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {q.trim() && results.length === 0 ? (
              <p className="border-t border-formula-frost/10 px-4 py-3 text-sm text-formula-mist">
                No matches — try “minis”, “rentals”, “assessment”, or “parties”.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}
