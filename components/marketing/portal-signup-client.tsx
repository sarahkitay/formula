'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { PORTAL_SIGNUP_AGE_GROUPS } from '@/lib/parent/portal-signup-age-groups'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const PARENT_LOGIN_WITH_RETURN = `/login?role=parent&next=${encodeURIComponent('/parent/dashboard')}`

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
  const [kids, setKids] = useState<
    { firstName: string; lastName: string; dateOfBirth: string; ageGroup: string }[]
  >([])
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
          setKids(
            Array.from({ length: data.numKids }, () => ({
              firstName: '',
              lastName: '',
              dateOfBirth: '',
              ageGroup: '',
            }))
          )
        }
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Could not load booking')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  const updateKid = useCallback(
    (index: number, field: 'firstName' | 'lastName' | 'dateOfBirth' | 'ageGroup', value: string) => {
      setKids((prev) => {
        const next = [...prev]
        const row = next[index]
        if (row) next[index] = { ...row, [field]: value }
        return next
      })
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setFormError(null)
      if (!sessionId || !summary) return
      if (password.length < 8) {
        setFormError('Use at least 8 characters for your password.')
        return
      }
      const todayIso = new Date().toISOString().slice(0, 10)
      for (let i = 0; i < kids.length; i++) {
        const k = kids[i]
        if (!k?.firstName.trim() || !k?.lastName.trim()) {
          setFormError(`Add first and last name for athlete ${i + 1}.`)
          return
        }
        if (!k.dateOfBirth.trim()) {
          setFormError(`Add date of birth for athlete ${i + 1}.`)
          return
        }
        if (k.dateOfBirth > todayIso) {
          setFormError(`Date of birth for athlete ${i + 1} cannot be in the future.`)
          return
        }
        if (!k.ageGroup.trim()) {
          setFormError(`Select an age group for athlete ${i + 1} (used for youth block booking).`)
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
            kids: kids.map(k => ({
              firstName: k.firstName.trim(),
              lastName: k.lastName.trim(),
              dateOfBirth: k.dateOfBirth.trim(),
              ageGroup: k.ageGroup.trim(),
            })),
          }),
        })
        const data = (await res.json()) as { error?: string; debug?: string }
        if (!res.ok) {
          const msg = data.debug ? `${data.error ?? 'Signup failed'} (${data.debug})` : (data.error ?? 'Signup failed')
          throw new Error(msg)
        }

        const { error: signErr } = await supabase.auth.signInWithPassword({
          email: summary.email,
          password,
        })
        if (signErr) {
          router.push(PARENT_LOGIN_WITH_RETURN)
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
        <Link href={MARKETING_HREF.bookAssessmentDirectory} className="text-formula-volt underline-offset-2 hover:underline">
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
    <form onSubmit={e => void handleSubmit(e)} className="not-prose max-w-xl space-y-8">
      <section className="rounded-sm border border-formula-volt/25 bg-formula-volt/[0.06] p-5 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.06)]">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-formula-mist">Your athletes · portal header</p>
        <p className="mt-2 text-[14px] leading-relaxed text-formula-frost/88">
          Names, birth date, and age group are saved to your athlete profile. The age group controls which youth training blocks you can book in the parent
          portal — choose the band your child trains in (ask staff if unsure).
        </p>
        <div className="mt-5 space-y-4">
          {kids.map((k, i) => (
            <div
              key={i}
              className="grid gap-3 rounded-sm border border-formula-frost/14 bg-formula-deep/50 p-4 sm:grid-cols-2"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-volt/90 sm:col-span-2">
                Athlete {i + 1}
              </p>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-formula-frost/55">First name</label>
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
              <div className="sm:col-span-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-formula-frost/55">Date of birth</label>
                <input
                  type="date"
                  value={k.dateOfBirth}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={e => updateKid(i, 'dateOfBirth', e.target.value)}
                  autoComplete="bday"
                  className="mt-1 w-full max-w-[14rem] border border-formula-frost/18 bg-formula-deep/80 px-3 py-2 text-sm text-formula-paper outline-none focus:border-formula-volt/40"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-formula-frost/55">Age group (for booking)</label>
                <select
                  value={k.ageGroup}
                  onChange={e => updateKid(i, 'ageGroup', e.target.value)}
                  className="mt-1 w-full max-w-md border border-formula-frost/18 bg-formula-deep/80 px-3 py-2 text-sm text-formula-paper outline-none focus:border-formula-volt/40"
                >
                  <option value="">Select age group…</option>
                  {PORTAL_SIGNUP_AGE_GROUPS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-[12px] leading-snug text-formula-mist">
                  Must match the facility training band (e.g. U12 → 12–14 stations). Adult programs use desk booking.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-sm border border-formula-frost/14 bg-formula-paper/[0.03] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-formula-mist">Guardian account</p>
        <div className="grid gap-1 text-[13px] text-formula-frost/85">
          <p>
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-formula-mist">Name · from checkout</span>
            <span className="mt-1 block font-medium text-formula-paper">{summary.parentFullName || '-'}</span>
          </p>
          <p className="pt-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-formula-mist">Email · login</span>
            <span className="mt-1 block font-medium text-formula-paper">{summary.email}</span>
          </p>
        </div>
        <div className="space-y-1.5 pt-2">
          <label htmlFor="ps-password" className="font-mono text-[10px] uppercase tracking-[0.14em] text-formula-frost/60">
            Create password
          </label>
          <input
            id="ps-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full border border-formula-frost/18 bg-formula-deep/80 px-3 py-2.5 text-sm text-formula-paper outline-none focus:border-formula-volt/40"
          />
        </div>
      </section>

      {formError ? <p className="text-sm text-amber-300/95">{formError}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create portal & sign in'}
        </Button>
        <Link
          href={PARENT_LOGIN_WITH_RETURN}
          className={cn(
            'inline-flex h-10 items-center border border-formula-frost/20 px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-frost/80',
            'hover:border-formula-frost/35'
          )}
        >
          I already have an account · sign in
        </Link>
      </div>
    </form>
  )
}
