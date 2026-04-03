'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const LETTERS = ['F', 'O', 'R', 'M', 'U', 'L', 'A'] as const
const STORAGE_KEY = 'formula_boot_v1'

/**
 * One-shot-per-session system boot: letters resolve fast, then dissolve into the app.
 */
export function FormulaBoot() {
  const [mountBoot, setMountBoot] = React.useState(false)
  const [exiting, setExiting] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return
    } catch {
      /* private mode */
    }
    setMountBoot(true)
    const done = window.setTimeout(() => setExiting(true), 560)
    const remove = window.setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {
        /* ignore */
      }
      setMountBoot(false)
    }, 560 + 280)
    return () => {
      window.clearTimeout(done)
      window.clearTimeout(remove)
    }
  }, [])

  if (!mountBoot) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background transition-opacity',
        exiting && 'formula-boot-out pointer-events-none'
      )}
      aria-hidden
    >
      <div
        className="flex items-baseline justify-center gap-[0.12em] font-mono font-bold tracking-[0.22em] text-[#1a1a1a]"
        style={{ fontSize: 'clamp(1.35rem, 4vw, 1.85rem)' }}
      >
        {LETTERS.map((ch, i) => (
          <span
            key={`${ch}-${i}`}
            className="formula-boot-char"
            style={{ animationDelay: `${i * 52}ms` }}
          >
            {ch}
          </span>
        ))}
      </div>
      <div
        className="mt-5 h-0.5 w-[min(12rem,42vw)] bg-[#f4fe00]"
        aria-hidden
      />
    </div>
  )
}
