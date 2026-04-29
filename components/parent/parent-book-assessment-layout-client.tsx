'use client'

import Link from 'next/link'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { loadProfileForUser } from '@/lib/auth/load-profile'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { supabase } from '@/lib/supabase'
import { SITE } from '@/lib/site-config'

export type ParentBookingProfile = {
  guardianName: string
  guardianEmail: string
}

const ParentBookingProfileContext = createContext<ParentBookingProfile | null>(null)

export function useParentBookingProfile(): ParentBookingProfile {
  const ctx = useContext(ParentBookingProfileContext)
  if (!ctx) {
    throw new Error('useParentBookingProfile must be used within parent /book-assessment layout')
  }
  return ctx
}

export function ParentBookAssessmentLayoutClient({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [guardianName, setGuardianName] = useState('')
  const [guardianEmail, setGuardianEmail] = useState('')

  useEffect(() => {
    let cancelled = false

    async function run() {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser()

      if (cancelled) return

      if (userErr || !user) {
        router.replace(`/login?role=parent&next=${encodeURIComponent(MARKETING_HREF.parentBookAssessmentDirectory)}`)
        return
      }

      const { profile, error: profileErr } = await loadProfileForUser(user.id)

      if (cancelled) return

      if (profileErr || !profile) {
        setPhase('error')
        setError(profileErr?.message ?? 'No profile found for this account.')
        return
      }

      if (profile.role?.toLowerCase() !== 'parent') {
        setPhase('error')
        setError('This page is only for parent accounts.')
        return
      }

      const email = (profile.email ?? user.email ?? '').trim()
      const fullName = (profile.full_name ?? '').trim() || (email ? email.split('@')[0] : '') || 'Parent'

      if (!email.includes('@')) {
        setPhase('error')
        setError('Your account needs an email on file to complete checkout. Contact the front desk.')
        return
      }

      setGuardianName(fullName)
      setGuardianEmail(email)
      setPhase('ready')
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [router])

  if (phase === 'loading') {
    return (
      <PageContainer>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-formula-mist">Skills Check</p>
        <p className="mt-4 text-sm text-formula-frost/80">Loading your booking…</p>
      </PageContainer>
    )
  }

  if (phase === 'error') {
    return (
      <PageContainer>
        <p className="text-formula-frost/90">{error}</p>
        <Link
          href="/parent/dashboard"
          className="mt-6 inline-block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-volt hover:opacity-90"
        >
          ← Back to home
        </Link>
      </PageContainer>
    )
  }

  return (
    <ParentBookingProfileContext.Provider value={{ guardianName, guardianEmail }}>
      <PageContainer>
        <PageHeader
          title="Reserve your spot"
          subtitle={`${SITE.facilityName} · signed in. Each booking type opens on its own page — use the hub to pick a flow.`}
        />
        <p className="mt-6 max-w-3xl rounded-lg border border-formula-frost/14 bg-formula-paper/[0.04] px-4 py-3 text-sm leading-relaxed text-formula-frost/90 md:px-5">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-mist">Attire · </span>
          {SITE.turfShoesAttendeeRule}
        </p>
        <div className="mt-8 max-w-3xl">{children}</div>
      </PageContainer>
    </ParentBookingProfileContext.Provider>
  )
}
