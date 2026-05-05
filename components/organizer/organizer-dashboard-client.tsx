'use client'

import { useCallback, useEffect, useState } from 'react'
import { PageContainer } from '@/components/layout/app-shell'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

type InviteRow = {
  id: string
  token: string
  expected_waiver_count: number
  completed_count: number
  remaining_count: number
  purchaser_name: string | null
  checkout_amount_total_cents: number | null
  checkout_currency: string | null
  booking_rental_field: string | null
  booking_rental_date: string | null
  booking_session_weeks: number | null
  waiver_url: string
  stripe_checkout_session_id: string | null
}

export function OrganizerDashboardClient() {
  const [invites, setInvites] = useState<InviteRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const token = session?.access_token
    if (!token) {
      setError('Not signed in.')
      setInvites([])
      return
    }
    const res = await fetch('/api/organizer/waiver-invites', { headers: { Authorization: `Bearer ${token}` } })
    const body = (await res.json()) as { invites?: InviteRow[]; error?: string }
    if (!res.ok) {
      setError(body.error ?? 'Could not load rentals.')
      setInvites([])
      return
    }
    setInvites(body.invites ?? [])
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function copyLink(url: string, id: string) {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      setError('Could not copy link — copy manually from the address bar after opening the link.')
    }
  }

  function formatMoney(cents: number | null, currency: string | null) {
    if (cents == null || !Number.isFinite(cents)) return '—'
    const cur = (currency ?? 'usd').toUpperCase()
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur === 'USD' ? 'USD' : cur }).format(cents / 100)
  }

  if (invites === null) {
    return (
      <PageContainer>
        <p className="font-mono text-[11px] text-formula-mist">Loading your field rentals…</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <h1 className="font-mono text-xl font-semibold tracking-tight text-formula-paper">Field rental roster links</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-formula-frost/85">
        Each row is a paid booking tied to your checkout email. Share the roster link so participants can sign the waiver. Progress updates as signatures come in.
      </p>
      {error ? <p className="mt-4 text-sm text-red-300/90">{error}</p> : null}

      {invites.length === 0 ? (
        <p className="mt-8 text-sm text-formula-mist">No invites loaded.</p>
      ) : (
        <ul className="not-prose mt-8 grid gap-4 sm:grid-cols-2">
          {invites.map(inv => (
            <li
              key={inv.id}
              className="rounded-lg border border-formula-frost/14 bg-formula-paper/[0.04] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
            >
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-volt/90">Roster link</p>
              <p className="mt-2 text-sm text-formula-frost/88">
                Waivers signed <strong className="text-formula-paper">{inv.completed_count}</strong> / {inv.expected_waiver_count}
                {inv.remaining_count > 0 ? (
                  <span className="text-formula-mist"> · {inv.remaining_count} remaining</span>
                ) : (
                  <span className="text-formula-volt"> · complete</span>
                )}
              </p>
              <p className="mt-2 text-[13px] text-formula-frost/75">
                {inv.booking_rental_field ? <>Field · {inv.booking_rental_field}</> : null}
                {inv.booking_rental_date ? (
                  <>
                    {inv.booking_rental_field ? ' · ' : null}
                    {inv.booking_rental_date}
                  </>
                ) : null}
                {inv.booking_session_weeks != null ? <> · {inv.booking_session_weeks} week(s)</> : null}
              </p>
              <p className="mt-2 font-mono text-[11px] text-formula-mist">Paid {formatMoney(inv.checkout_amount_total_cents, inv.checkout_currency)}</p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <a
                  href={inv.waiver_url}
                  className="inline-flex min-h-10 items-center justify-center border border-formula-volt/45 bg-formula-volt/15 px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-volt no-underline transition-colors hover:bg-formula-volt/25"
                >
                  Open roster page
                </a>
                <button
                  type="button"
                  onClick={() => void copyLink(inv.waiver_url, inv.id)}
                  className={cn(
                    'inline-flex min-h-10 items-center justify-center border border-formula-frost/18 bg-formula-paper/[0.05] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-paper transition-colors hover:border-formula-frost/28',
                    copiedId === inv.id && 'border-formula-volt/40 text-formula-volt'
                  )}
                >
                  {copiedId === inv.id ? 'Copied' : 'Copy roster link'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  )
}
