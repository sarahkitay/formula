'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { DAY_PASS_ONE_DAY } from '@/lib/marketing/public-pricing'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'formula_home_intent_gate_v1'
const OPEN_DELAY_MS = 3000

const panelClass =
  'rounded-2xl border border-formula-frost/18 bg-formula-deep/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-8'

const primaryChoiceClass =
  'flex w-full flex-col items-start gap-1 rounded-xl border-2 border-formula-frost/22 bg-formula-paper/[0.06] px-5 py-4 text-left font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper transition-[border-color,transform,background-color] hover:-translate-y-0.5 hover:border-formula-volt/50 hover:bg-formula-paper/[0.09] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-formula-volt/75 sm:py-5'

const secondaryHintClass = 'text-[12px] font-normal normal-case tracking-normal text-formula-frost/75'

type Step = 1 | 2

export function HomeIntentDialog() {
  const router = useRouter()
  const titleId = useId()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>(1)

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
    setOpen(false)
    setStep(1)
  }, [])

  const goRentals = useCallback(() => {
    dismiss()
    router.push(MARKETING_HREF.rentals)
  }, [dismiss, router])

  useEffect(() => {
    setMounted(true)
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, dismiss])

  if (!mounted || !open) return null

  const bookingTiles = [
    {
      label: 'Friday Night Friendlies',
      hint: 'Pre-register players (ages 6-14).',
      href: MARKETING_HREF.fridayNightFriendlies,
    },
    {
      label: 'Formula Minis',
      hint: 'Ages 2-5 · weekday or Sunday programs.',
      href: MARKETING_HREF.minis,
    },
    {
      label: 'One-day pass',
      hint: `$${DAY_PASS_ONE_DAY.priceUsd} · age bands at check-in.`,
      href: BOOKING_HUB_PUBLIC.dayPass,
    },
    {
      label: 'Purchase a package',
      hint: 'Session packs and program pricing.',
      href: `${MARKETING_HREF.youthMembership}#programs-catalog`,
    },
    {
      label: 'Book an event',
      hint: 'Tournaments, camps, and hosted listings.',
      href: MARKETING_HREF.events,
    },
    {
      label: 'Host a birthday party',
      hint: 'Policies, then party deposit checkout.',
      href: MARKETING_HREF.parties,
    },
    {
      label: 'Book an assessment',
      hint: 'Skills Check calendar and pay.',
      href: BOOKING_HUB_PUBLIC.skillsCheck,
    },
    {
      label: 'Parent portal',
      hint: 'Set up access after checkout.',
      href: '/portal-signup',
    },
    {
      label: 'Memberships',
      hint: 'Tiers, Minis, and waitlist.',
      href: MARKETING_HREF.youthMembership,
    },
  ] as const

  return (
    <div className="marketing-site fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center sm:p-6" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/72 backdrop-blur-[2px]"
        aria-label="Close welcome choices"
        onClick={dismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn('relative z-[1] w-full max-w-lg', panelClass)}
      >
        <div className="flex items-start justify-between gap-4">
          <p id={titleId} className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-formula-mist">
            {step === 1 ? 'Welcome' : 'Book or join'}
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 rounded-md border border-formula-frost/20 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-frost/90 hover:border-formula-volt/40 hover:text-formula-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-formula-volt/70"
          >
            Close
          </button>
        </div>

        {step === 1 ? (
          <>
            <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-formula-paper sm:text-[1.65rem]">I am here for</h2>
            <p className="mt-2 text-sm leading-relaxed text-formula-frost/80">Pick one path. You can always use the header to navigate later.</p>
            <div className="mt-8 flex flex-col gap-3">
              <button type="button" className={primaryChoiceClass} onClick={goRentals}>
                Field rental booking
                <span className={secondaryHintClass}>Reserve field time, packages, and deposit checkout.</span>
              </button>
              <button type="button" className={primaryChoiceClass} onClick={() => setStep(2)}>
                Programs, passes, and parties
                <span className={secondaryHintClass}>Friendlies, Minis, day pass, packages, events, parties, assessment, portal, memberships.</span>
              </button>
              <button type="button" className={primaryChoiceClass} onClick={dismiss}>
                Just exploring
                <span className={secondaryHintClass}>Close this window and scroll the site.</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-volt hover:opacity-90"
            >
              ← Back
            </button>
            <h2 className="mt-2 text-balance text-xl font-semibold tracking-tight text-formula-paper sm:text-2xl">Choose your next step</h2>
            <p className="mt-2 text-sm text-formula-frost/78">Each tile opens the right booking or info page.</p>
            <ul className="mt-6 max-h-[min(52vh,28rem)] space-y-2 overflow-y-auto pr-1 sm:max-h-[min(60vh,32rem)]">
              {bookingTiles.map((tile) => (
                <li key={tile.href}>
                  <Link
                    href={tile.href}
                    onClick={dismiss}
                    className={cn(primaryChoiceClass, 'no-underline')}
                  >
                    {tile.label}
                    <span className={secondaryHintClass}>{tile.hint}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
