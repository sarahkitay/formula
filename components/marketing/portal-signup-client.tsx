'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

type Summary = {
  email: string
  parentFullName: string
  numKids: number
}

export function PortalSignupClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')?.trim() ?? ''

  const [summary, setSummary] = useState<Summary | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [kids, setKids] = useState<{ firstName: string; lastName: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setLoadError('Missing session. Open this page from the link after checkout, or use the session reference from your receipt.')
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/checkout/assessment-summary?session_id=${encodeURIComponent(sessionId)}`)
        const data = (await res.json()) as Summary & { error?: string }
        if (!res.ok) throw new Error(data.error ?? 'Could not verify payment')
        if (!cancelled) {
          setSummary({
            email: data.email,
            parentFullName: data.parentFullName,
            numKids: data.numKids,
          })
          setKids(Array.from({ length: data.numKids }, () => ({ firstName: '', lastName: '' })))
        }
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Could not load booking')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  const updateKid = useCallback((index: number, field: 'firstName' | 'lastName', value: string) => {
    setKids(prev => {
      const next = [...prev]
      const row = next[index]
      if (row) next[index] = { ...row, [field]: value }
      return next
    })
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setFormError(null)
      if (!sessionId || !summary) return
      if (password.length < 8) {
        setFormError('Use at least 8 characters for your password.')
        return
      }
      for (let i = 0; i < kids.length; i++) {
        const k = kids[i]
        if (!k?.firstName.trim() || !k?.lastName.trim()) {
          setFormError(`Add first and last name for athlete ${i + 1}.`)
          return
        }
      }

      setSubmitting(true)
      try {
        const res = await fetch('/api/parent/portal-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            password,
            kids: kids.map(k => ({ firstName: k.firstName.trim(), lastName: k.lastName.trim() })),
          }),
        })
        const data = (await res.json()) as { error?: string }
        if (!res.ok) throw new Error(data.error ?? 'Signup failed')

        const { error: signErr } = await supabase.auth.signInWithPassword({
          email: summary.email,
          password,
        })
        if (signErr) {
          router.push(`/login?role=parent`)
          return
        }
        router.push('/parent/dashboard')
        router.refresh()
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setSubmitting(false)
      }
    },
    [kids, password, router, sessionId, summary]
  )

  if (!sessionId) {
    return (
      <p className="text-[14px] text-formula-frost/80">
        Go to{' '}
        <Link href="/book-assessment" className="text-formula-volt underline-offset-2 hover:underline">
          book an assessment
        </Link>{' '}
        first, then return here from the post-checkout link.
      </p>
    )
  }

  if (loadError) {
    return <p className="text-[14px] text-amber-300/95">{loadError}</p>
  }

  if (!summary) {
    return <p className="font-mono text-[11px] text-formula-frost/50">Verifying your booking…</p>
  }

  return (
    <form onSubmit={e => void handleSubmit(e)} className="not-prose max-w-xl space-y-6">
      <p className="text-[14px] leading-relaxed text-formula-frost/85">
        Create your parent portal with the same email used at checkout:{' '}
        <span className="font-medium text-formula-paper">{summary.email}</span>. Add each athlete&apos;s name so they appear under your account.
      </p>

      <div className="space-y-1.5">
        <label htmlFor="ps-password" className="font-mono text-[10px] uppercase tracking-[0.14em] text-formula-frost/60">
          Password
        </label>
        <input
          id="ps-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-formula-frost/18 bg-formula-deep/80 px-3 py-2.5 text-sm text-formula-paper outline-none focus:border-formula-volt/40"
        />
      </div>

      <div className="space-y-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-formula-mist">Athletes ({summary.numKids})</p>
        {kids.map((k, i) => (
          <div key={i} className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-formula-frost/55">First name · athlete {i + 1}</label>
              <input
                value={k.firstName}
                onChange={e => updateKid(i, 'firstName', e.target.value)}
                autoComplete="given-name"
                className="mt-1 w-full border border-formula-frost/18 bg-formula-deep/80 px-3 py-2 text-sm text-formula-paper outline-none focus:border-formula-volt/40"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-formula-frost/55">Last name</label>
              <input
                value={k.lastName}
                onChange={e => updateKid(i, 'lastName', e.target.value)}
                autoComplete="family-name"
                className="mt-1 w-full border border-formula-frost/18 bg-formula-deep/80 px-3 py-2 text-sm text-formula-paper outline-none focus:border-formula-volt/40"
              />
            </div>
          </div>
        ))}
      </div>

      {formError ? <p className="text-sm text-amber-300/95">{formError}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create portal & sign in'}
        </Button>
        <Link
          href="/login?role=parent"
          className={cn(
            'inline-flex h-10 items-center border border-formula-frost/20 px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-frost/80',
            'hover:border-formula-frost/35'
          )}
        >
          I already have an account
        </Link>
      </div>
    </form>
  )
}
