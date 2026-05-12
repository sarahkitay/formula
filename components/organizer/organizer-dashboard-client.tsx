'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { PageContainer } from '@/components/layout/app-shell'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { FACILITY_TIMEZONE } from '@/lib/facility/facility-day'

type InviteRow = {
  id: string
  token: string
  expected_waiver_count: number
  completed_count: number
  remaining_count: number
  overage_count: number
  purchaser_name: string | null
  checkout_amount_total_cents: number | null
  checkout_currency: string | null
  booking_rental_field: string | null
  booking_rental_date: string | null
  booking_session_weeks: number | null
  waiver_url: string
  stripe_checkout_session_id: string | null
}

type PurchaseRow = {
  stripe_session_id: string
  created_at: string
  amount: number
  currency: string | null
  payment_status: string | null
  summary: string
  checkout_success_href: string | null
}

type HubPayload = {
  invites: InviteRow[]
  purchases: PurchaseRow[]
}

export function OrganizerDashboardClient() {
  const [data, setData] = useState<HubPayload | null>(null)
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
      setData({ invites: [], purchases: [] })
      return
    }
    const res = await fetch('/api/organizer/waiver-invites', { headers: { Authorization: `Bearer ${token}` } })
    const body = (await res.json()) as HubPayload & { error?: string }
    if (!res.ok) {
      setError(body.error ?? 'Could not load organizer hub data.')
      setData({ invites: [], purchases: [] })
      return
    }
    setData({
      invites: Array.isArray(body.invites) ? body.invites : [],
      purchases: Array.isArray(body.purchases) ? body.purchases : [],
    })
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
      setError('Could not copy link. Copy manually from the address bar after opening the link.')
    }
  }

  function formatMoney(cents: number | null, currency: string | null) {
    if (cents == null || !Number.isFinite(cents)) return '-'
    const cur = (currency ?? 'usd').toUpperCase()
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur === 'USD' ? 'USD' : cur }).format(cents / 100)
  }

  function formatMoneyPurchase(amount: number, currency: string | null) {
    if (!Number.isFinite(amount)) return '-'
    const cur = (currency ?? 'usd').toUpperCase()
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur === 'USD' ? 'USD' : cur }).format(amount / 100)
  }

  function formatDate(iso: string) {
    try {
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: FACILITY_TIMEZONE,
      }).format(new Date(iso))
    } catch {
      return iso
    }
  }

  if (data === null) {
    return (
      <PageContainer>
        <p className="font-mono text-[11px] text-formula-mist">Loading organizer hub…</p>
      </PageContainer>
    )
  }

  const { invites, purchases } = data
  const purchaseSessionIds = new Set(purchases.map(p => p.stripe_session_id))
  const orphanInvites = invites.filter(inv => {
    const sid = (inv.stripe_checkout_session_id ?? '').trim()
    if (!sid) return true
    return !purchaseSessionIds.has(sid)
  })

  function inviteForSession(sessionId: string | null | undefined): InviteRow | undefined {
    const s = (sessionId ?? '').trim()
    if (!s) return undefined
    return invites.find(i => (i.stripe_checkout_session_id ?? '').trim() === s)
  }

  return (
    <PageContainer>
      <h1 className="font-mono text-xl font-semibold tracking-tight text-formula-paper">Field rental hub</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-formula-frost/85">
        Book new windows on the public rentals page. Past payments show when they were recorded under the same email as this
        account. Roster waiver links appear once checkout has created an invite for that payment.
      </p>
      {error ? <p className="mt-4 text-sm text-red-300/90">{error}</p> : null}

      <section className="mt-10 rounded-lg border border-formula-frost/14 bg-formula-paper/[0.04] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-volt/90">Book</p>
        <p className="mt-2 text-sm text-formula-frost/80">Reserve a field window and complete rental checkout payment.</p>
        <Link
          href="/rentals"
          className="mt-4 inline-flex min-h-10 items-center justify-center border border-formula-volt/45 bg-formula-volt/15 px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-volt no-underline transition-colors hover:bg-formula-volt/25"
        >
          Open rentals & booking
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.16em] text-formula-paper">Paid rentals & receipts</h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-formula-mist">
          Pulled from payment records for your sign-in email. Use “View receipt” to return to checkout success (roster link when
          available).
        </p>
        {purchases.length === 0 ? (
          <p className="mt-6 text-sm text-formula-mist">
            No field-rental payments are on file for this email yet. After you pay, the same email must be used at Stripe
            checkout, or ask staff to align your receipt email with this account.
          </p>
        ) : (
          <ul className="not-prose mt-6 grid gap-4 lg:grid-cols-2">
            {purchases.map(p => {
              const inv = inviteForSession(p.stripe_session_id)
              return (
                <li
                  key={p.stripe_session_id}
                  className="rounded-lg border border-formula-frost/14 bg-formula-paper/[0.04] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                >
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-frost/55">Payment</p>
                  <p className="mt-2 text-sm text-formula-paper">{p.summary}</p>
                  <p className="mt-1 font-mono text-[11px] text-formula-mist">
                    {formatDate(p.created_at)} · {formatMoneyPurchase(p.amount, p.currency)}
                    {p.payment_status ? (
                      <span className="text-formula-frost/70">
                        {' '}
                        · {(p.payment_status ?? '').replace(/_/g, ' ')}
                      </span>
                    ) : null}
                  </p>
                  {p.checkout_success_href ? (
                    <a
                      href={p.checkout_success_href}
                      className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.12em] text-formula-volt/90 underline-offset-4 hover:underline"
                    >
                      View receipt / checkout success
                    </a>
                  ) : null}

                  <div className="mt-5 border-t border-formula-frost/10 pt-4">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-volt/90">
                      Roster waivers
                    </p>
                    {inv ? (
                      <>
                        <p className="mt-2 text-sm text-formula-frost/88">
                          Signed <strong className="text-formula-paper">{inv.completed_count}</strong> / {inv.expected_waiver_count}
                          {inv.remaining_count > 0 ? (
                            <span className="text-formula-mist"> · {inv.remaining_count} remaining</span>
                          ) : (inv.overage_count ?? 0) > 0 ? (
                            <span className="text-amber-200/90">
                              {' '}
                              · complete · +{inv.overage_count} extra (ask staff to update headcount)
                            </span>
                          ) : (
                            <span className="text-formula-volt"> · complete</span>
                          )}
                        </p>
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
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
                      </>
                    ) : (
                      <p className="mt-2 text-[13px] leading-relaxed text-formula-mist">
                        No roster invite is linked to this payment row yet. If you just paid, wait a moment and refresh. Otherwise
                        open your receipt link above or contact the front desk with your session reference so staff can attach the
                        roster.
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.16em] text-formula-paper">Roster links (all invites)</h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-formula-mist">
          Waivers tied to your checkout email. Entries that already appear under a paid rental above are omitted here to avoid
          duplicates.
        </p>
        {orphanInvites.length === 0 ? (
          <p className="mt-6 text-sm text-formula-mist">
            {invites.length > 0
              ? 'Every roster invite on file is matched to a payment card above.'
              : 'No roster invites on file for this email yet; they are created when field-rental checkout completes (or when staff adds one).'}
          </p>
        ) : (
          <ul className="not-prose mt-6 grid gap-4 sm:grid-cols-2">
            {orphanInvites.map(inv => (
              <li
                key={inv.id}
                className="rounded-lg border border-formula-frost/14 bg-formula-paper/[0.04] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
              >
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-volt/90">Roster link</p>
                <p className="mt-2 text-sm text-formula-frost/88">
                  Waivers signed <strong className="text-formula-paper">{inv.completed_count}</strong> / {inv.expected_waiver_count}
                  {inv.remaining_count > 0 ? (
                    <span className="text-formula-mist"> · {inv.remaining_count} remaining</span>
                  ) : (inv.overage_count ?? 0) > 0 ? (
                    <span className="text-amber-200/90">
                      {' '}
                      · complete · +{inv.overage_count} extra (ask staff to update headcount)
                    </span>
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
      </section>
    </PageContainer>
  )
}
