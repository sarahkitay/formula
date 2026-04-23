'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import type { BookAssessmentVariant } from '@/components/marketing/book-assessment-types'
import { BOOKING_HUB_PARENT, BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'

/** Shared with skills-check page for public users (same tab / session). */
export const GUARDIAN_SESSION_STORAGE_KEY = 'formula-book-assessment-guardian-v1' as const

export function readGuardianFromSession(): { name: string; email: string } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(GUARDIAN_SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { name?: string; email?: string }
    const name = typeof parsed.name === 'string' ? parsed.name : ''
    const email = typeof parsed.email === 'string' ? parsed.email : ''
    if (name.length < 2 || !email.includes('@')) return null
    return { name, email }
  } catch {
    return null
  }
}

export function BookAssessmentGuardianContactClient({
  variant,
  guardianFullName = '',
  guardianEmail = '',
}: {
  variant: BookAssessmentVariant
  guardianFullName?: string
  guardianEmail?: string
}) {
  const router = useRouter()
  const hub = variant === 'portal' ? BOOKING_HUB_PARENT.hub : BOOKING_HUB_PUBLIC.hub
  const skillsHref = variant === 'portal' ? BOOKING_HUB_PARENT.skillsCheck : BOOKING_HUB_PUBLIC.skillsCheck

  const [parentFullName, setParentFullName] = useState('')
  const [parentEmail, setParentEmail] = useState('')

  const saveAndContinue = useCallback(() => {
    const name = parentFullName.trim()
    const email = parentEmail.trim()
    if (name.length < 2 || !email.includes('@')) return
    try {
      sessionStorage.setItem(GUARDIAN_SESSION_STORAGE_KEY, JSON.stringify({ name, email }))
    } catch {
      /* private mode */
    }
    router.push(skillsHref)
  }, [parentEmail, parentFullName, router, skillsHref])

  if (variant === 'portal') {
    return (
      <section
        id="booking-account"
        aria-labelledby="ba-account-heading"
        className="not-prose scroll-mt-28 rounded-sm border border-formula-frost/14 bg-formula-paper/[0.04] p-5 md:p-6"
      >
        <h2 id="ba-account-heading" className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
          Your account
        </h2>
        <p className="mt-2 text-sm font-medium text-formula-paper">{guardianFullName.trim() || '—'}</p>
        <p className="mt-1 text-[13px] text-formula-frost/75">{guardianEmail.trim() || '—'}</p>
        <p className="mt-4 text-[12px] leading-relaxed text-formula-frost/65">
          Receipts and Skills Check confirmations use this email. Update it in the portal if it needs to change.
        </p>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-formula-frost/55">
          <a href={hub} className="text-formula-volt underline-offset-2 hover:underline">
            ← Booking hub
          </a>
        </p>
      </section>
    )
  }

  return (
    <section id="booking-contact" aria-labelledby="ba-contact-heading" className="not-prose scroll-mt-28 space-y-4">
      <h2 id="ba-contact-heading" className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
        Guardian contact
      </h2>
      <p className="max-w-2xl text-[13px] leading-relaxed text-formula-frost/70">
        Save your details, then continue to June Skills Check booking. We keep this in your browser for this session only (not on our servers until you pay).
      </p>
      <div className="grid max-w-xl min-w-0 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="ba-parent-name" className="block font-mono text-[10px] uppercase tracking-[0.14em] text-formula-frost/60">
            Full name
          </label>
          <input
            id="ba-parent-name"
            value={parentFullName}
            onChange={(e) => setParentFullName(e.target.value)}
            autoComplete="name"
            className="mt-1.5 w-full min-w-0 border border-formula-frost/18 bg-formula-deep/80 px-3 py-2.5 text-sm text-formula-paper outline-none focus:border-formula-volt/40"
            placeholder="Parent or guardian"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ba-parent-email" className="block font-mono text-[10px] uppercase tracking-[0.14em] text-formula-frost/60">
            Email (for receipt & portal)
          </label>
          <input
            id="ba-parent-email"
            type="email"
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value.trim())}
            autoComplete="email"
            className="mt-1.5 w-full min-w-0 border border-formula-frost/18 bg-formula-deep/80 px-3 py-2.5 text-sm text-formula-paper outline-none focus:border-formula-volt/40"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={saveAndContinue}
          className="inline-flex h-11 items-center border border-formula-volt/40 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-black disabled:opacity-40"
          disabled={parentFullName.trim().length < 2 || !parentEmail.trim().includes('@')}
        >
          Continue to June pre-book
        </button>
        <a
          href={hub}
          className="inline-flex h-11 items-center border border-formula-frost/18 px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-mist"
        >
          Back
        </a>
      </div>
    </section>
  )
}
