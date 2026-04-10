'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookAssessmentClient } from '@/components/marketing/book-assessment-client'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { loadProfileForUser } from '@/lib/auth/load-profile'
import { supabase } from '@/lib/supabase'
import { SITE } from '@/lib/site-config'

export function ParentBookAssessmentClient() {
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
        router.replace(`/login?role=parent&next=${encodeURIComponent('/parent/book-assessment')}`)
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
    <PageContainer>
      <PageHeader
        title="Book a Skills Check"
        subtitle={`${SITE.facilityName} · signed in. We’ll use your account email for receipts. Same live windows as public booking.`}
      />
      <div className="mt-8 max-w-3xl">
        <BookAssessmentClient variant="portal" guardianFullName={guardianName} guardianEmail={guardianEmail} />
      </div>
    </PageContainer>
  )
}
