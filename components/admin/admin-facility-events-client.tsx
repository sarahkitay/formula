'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { Calendar, Check, Copy, CreditCard, FileSignature, Search } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { AdminPanel } from '@/components/admin/admin-panel'
import { TabSwitcher } from '@/components/ui/tab-switcher'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { staffApiFetch } from '@/lib/auth/staff-api-fetch'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { toISODateLocal } from '@/lib/schedule/generator'
import type { FacilityEventFieldScope, FacilityEventRow, FacilityEventStatus } from '@/lib/events/facility-events-server'
import { BOOK_INITIAL } from '@/app/(admin)/admin/events/book-state'
import {
  createFacilityEventBookAction,
  createFacilityEventWaiverLinkAction,
  setFacilityEventStatusAction,
} from '@/app/(admin)/admin/events/actions'

const FIELD_LABELS: Record<FacilityEventFieldScope, string> = {
  field_1: 'Field 1',
  field_2: 'Field 2',
  field_3: 'Field 3',
  full_facility: 'Full facility',
}

/** Sunday YYYY-MM-DD of the week containing this event (local browser calendar; matches schedule week picker). */
function weekStartSundayForFacilityYmd(ymd: string): string {
  const d = new Date(`${ymd}T12:00:00`)
  const dow = d.getDay()
  d.setDate(d.getDate() - dow)
  return toISODateLocal(d)
}

function formatMinuteClock(totalMinutes: number): string {
  const h24 = Math.floor(totalMinutes / 60) % 24
  const min = totalMinutes % 60
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  const ap = h24 >= 12 ? 'PM' : 'AM'
  return `${h12}:${min.toString().padStart(2, '0')} ${ap}`
}

function eventMatchesSearch(ev: FacilityEventRow, q: string): boolean {
  const s = q.trim().toLowerCase()
  if (!s) return true
  const blob = [
    ev.title,
    ev.event_date,
    ev.organizer_name,
    ev.organizer_email,
    ev.notes,
    FIELD_LABELS[ev.field_scope],
    ev.status,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return blob.includes(s)
}

type Props = {
  events: FacilityEventRow[]
  waiverUrlByEventId: Record<string, string>
  siteOrigin: string
  dbConfigured: boolean
}

export function AdminFacilityEventsClient({ events, waiverUrlByEventId, siteOrigin, dbConfigured }: Props) {
  const router = useRouter()
  const [tab, setTab] = React.useState<'booked' | 'requests'>('booked')
  const [search, setSearch] = useState('')
  const [bookState, bookAction, bookPending] = useActionState(createFacilityEventBookAction, BOOK_INITIAL)
  const [pendingStatus, startStatusTransition] = useTransition()
  const [waiverBusyId, setWaiverBusyId] = useState<string | null>(null)
  const [payBusyId, setPayBusyId] = useState<string | null>(null)
  const [payFlash, setPayFlash] = useState<{ eventId: string; url: string } | null>(null)
  const [payError, setPayError] = useState<{ eventId: string; message: string } | null>(null)

  const bookWasPending = useRef(false)
  const scrollTargetEventId = useRef<string | null>(null)
  useEffect(() => {
    if (bookWasPending.current && !bookPending && bookState.ok) {
      if (bookState.createdEventId) {
        scrollTargetEventId.current = bookState.createdEventId
      }
      router.refresh()
    }
    bookWasPending.current = bookPending
  }, [bookPending, bookState.ok, bookState.createdEventId, router])

  useEffect(() => {
    const tid = scrollTargetEventId.current
    if (!tid || !events.some(e => e.id === tid)) return
    requestAnimationFrame(() => {
      document.getElementById(`facility-event-${tid}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
    scrollTargetEventId.current = null
  }, [events])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    const prefix = '#facility-event-'
    if (!hash.startsWith(prefix)) return
    const id = decodeURIComponent(hash.slice(prefix.length)).trim()
    if (!id || !events.some(e => e.id === id)) return
    setTab('booked')
    requestAnimationFrame(() => {
      document.getElementById(`facility-event-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }, [events])

  const filtered = useMemo(() => events.filter(ev => eventMatchesSearch(ev, search)), [events, search])

  async function onStatus(evId: string, status: FacilityEventStatus) {
    const fd = new FormData()
    fd.set('eventId', evId)
    fd.set('status', status)
    startStatusTransition(() => {
      void (async () => {
        const r = await setFacilityEventStatusAction(fd)
        if (!r.ok) {
          window.alert(r.message)
          return
        }
        router.refresh()
      })()
    })
  }

  async function onWaiverSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const id = String(fd.get('eventId') ?? '')
    setWaiverBusyId(id)
    try {
      const r = await createFacilityEventWaiverLinkAction(fd)
      if (!r.ok) {
        window.alert(r.message)
        return
      }
      try {
        await navigator.clipboard.writeText(r.waiver_url)
      } catch {
        /* ignore */
      }
      router.refresh()
    } finally {
      setWaiverBusyId(null)
    }
  }

  async function onPaymentSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const id = String(fd.get('eventId') ?? '')
    const payeeName = String(fd.get('payeeName') ?? '').trim()
    const amountUsd = String(fd.get('amountUsd') ?? '').trim()
    const memo = String(fd.get('memo') ?? '').trim()
    const customerEmail = String(fd.get('customerEmail') ?? '').trim()
    const waiverInviteId = String(fd.get('waiverInviteId') ?? '').trim()
    setPayBusyId(id)
    setPayFlash(null)
    setPayError(null)
    try {
      const res = await staffApiFetch('/api/admin/invoice-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payeeName,
          amountUsd,
          memo,
          customerEmail,
          waiverInviteId: waiverInviteId || undefined,
        }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        setPayError({ eventId: id, message: data.error ?? 'Could not create payment link' })
        return
      }
      setPayFlash({ eventId: id, url: data.url })
    } catch {
      setPayError({ eventId: id, message: 'Network error' })
    } finally {
      setPayBusyId(null)
    }
  }

  return (
    <PageContainer fullWidth>
      <div className="space-y-6">
        <PageHeader
          title="Events"
          subtitle="Book facility events (tournaments, rentals-as-events). Confirmed dates appear on Admin → Schedule in the week of the event; click a violet block to open waivers and payment links. Calendar blocks on Schedule are still added from published program + overrides — event rows drive the staff overlay."
          breadcrumb={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Events' },
          ]}
        />

        <TabSwitcher
          variant="pill"
          className="max-w-xl"
          tabs={[
            { id: 'booked', label: 'Booked events', count: events.length },
            { id: 'requests', label: 'Incoming requests' },
          ]}
          activeTab={tab}
          onChange={id => setTab(id as 'booked' | 'requests')}
        />

        {tab === 'requests' ? (
          <AdminPanel title="Public event inquiries" eyebrow="EMAIL">
            <p className="font-mono text-[11px] leading-relaxed text-formula-frost/90">
              Requests from the marketing site are emailed to ops (there is no request inbox database yet). Review the form on{' '}
              <Link href={`${MARKETING_HREF.events}#event-request`} className="text-formula-volt underline-offset-2 hover:underline">
                Events → request an event
              </Link>
              . When you confirm a date, use <strong className="text-formula-paper/90">Booked events</strong> to create the row here, then add the block on{' '}
              <Link href="/admin/schedule" className="text-formula-volt underline-offset-2 hover:underline">
                Schedule
              </Link>
              .
            </p>
          </AdminPanel>
        ) : (
          <>
            {!dbConfigured ? (
              <p className="font-mono text-[11px] text-amber-200/90">
                Set <span className="text-formula-volt">SUPABASE_SERVICE_ROLE_KEY</span> to load and save events.
              </p>
            ) : null}

            <AdminPanel title="Book an event" eyebrow="CREATE">
              <form action={bookAction} className="grid gap-3 font-mono text-[11px] md:grid-cols-2">
                <label className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-formula-mist">Title *</span>
                  <input name="title" required minLength={2} maxLength={200} className="border border-formula-frost/16 bg-formula-paper/[0.04] px-3 py-2 text-formula-paper" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-formula-mist">Date *</span>
                  <input name="eventDate" type="date" required className="border border-formula-frost/16 bg-formula-paper/[0.04] px-3 py-2 text-formula-paper" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-formula-mist">Start (local) *</span>
                  <input name="startTime" type="time" required className="border border-formula-frost/16 bg-formula-paper/[0.04] px-3 py-2 text-formula-paper" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-formula-mist">Duration (minutes) *</span>
                  <input
                    name="durationMinutes"
                    type="number"
                    min={15}
                    max={960}
                    step={15}
                    defaultValue={120}
                    required
                    className="border border-formula-frost/16 bg-formula-paper/[0.04] px-3 py-2 text-formula-paper"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-formula-mist">Field *</span>
                  <select name="fieldScope" required className="border border-formula-frost/16 bg-formula-paper/[0.04] px-3 py-2 text-formula-paper">
                    <option value="field_1">Field 1</option>
                    <option value="field_2">Field 2</option>
                    <option value="field_3">Field 3 (outdoor)</option>
                    <option value="full_facility">Full facility</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-formula-mist">Status</span>
                  <select name="status" defaultValue="confirmed" className="border border-formula-frost/16 bg-formula-paper/[0.04] px-3 py-2 text-formula-paper">
                    <option value="draft">Draft</option>
                    <option value="requested">Requested</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-formula-mist">Organizer name</span>
                  <input name="organizerName" maxLength={200} className="border border-formula-frost/16 bg-formula-paper/[0.04] px-3 py-2 text-formula-paper" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-formula-mist">Organizer email</span>
                  <input name="organizerEmail" type="email" maxLength={200} className="border border-formula-frost/16 bg-formula-paper/[0.04] px-3 py-2 text-formula-paper" />
                </label>
                <label className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-formula-mist">Notes</span>
                  <textarea name="notes" rows={2} maxLength={1000} className="border border-formula-frost/16 bg-formula-paper/[0.04] px-3 py-2 text-formula-paper" />
                </label>

                <fieldset className="md:col-span-2 space-y-3 rounded border border-formula-frost/12 bg-formula-base/25 p-3">
                  <legend className="text-[10px] font-bold uppercase tracking-[0.14em] text-formula-mist">
                    Links for this event (optional on save)
                  </legend>
                  <p className="text-[10px] leading-relaxed text-formula-frost/80">
                    Creates the same roster waiver and Stripe checkout used in the event list. Payment checkout can include the waiver invite in Stripe metadata when both run in one save (waiver first).
                  </p>
                  <label className="flex cursor-pointer items-start gap-2 text-formula-paper">
                    <input type="checkbox" name="bookCreateWaiver" value="on" className="mt-0.5 border-formula-frost/30" />
                    <span>
                      <span className="block font-medium">Create attendee waiver link</span>
                      <span className="mt-1 block text-[10px] text-formula-mist">Roster link for signers; stored on this event.</span>
                    </span>
                  </label>
                  <label className="block pl-6 text-[10px] text-formula-mist">
                    Expected signers
                    <input
                      name="bookExpectedWaiverCount"
                      type="number"
                      min={1}
                      max={500}
                      defaultValue={30}
                      className="mt-0.5 w-full max-w-[8rem] border border-formula-frost/16 bg-formula-paper/[0.04] px-2 py-1 text-formula-paper"
                    />
                  </label>
                  <label className="flex cursor-pointer items-start gap-2 text-formula-paper">
                    <input type="checkbox" name="bookCreatePayment" value="on" className="mt-0.5 border-formula-frost/30" />
                    <span>
                      <span className="block font-medium">Create Stripe payment link</span>
                      <span className="mt-1 block text-[10px] text-formula-mist">Requires bill-to (organizer name or title) and amount.</span>
                    </span>
                  </label>
                  <div className="grid gap-2 pl-6 md:grid-cols-2">
                    <label className="block text-[10px] text-formula-mist">
                      Amount (USD) *
                      <input
                        name="bookAmountUsd"
                        inputMode="decimal"
                        placeholder="e.g. 500"
                        className="mt-0.5 w-full border border-formula-frost/16 bg-formula-paper/[0.04] px-2 py-1 text-formula-paper"
                      />
                    </label>
                    <label className="block text-[10px] text-formula-mist md:col-span-2">
                      Checkout memo (optional)
                      <textarea
                        name="bookPaymentMemo"
                        rows={2}
                        placeholder="Defaults to event title, date, and id."
                        className="mt-0.5 w-full border border-formula-frost/16 bg-formula-paper/[0.04] px-2 py-1 text-[11px] text-formula-paper"
                      />
                    </label>
                  </div>
                </fieldset>

                <div className="md:col-span-2">
                  <Button type="submit" variant="primary" size="sm" loading={bookPending}>
                    Save event
                  </Button>
                </div>
              </form>
              {bookState.message ? (
                <p className={cn('mt-2 font-mono text-[11px]', bookState.ok ? 'text-formula-volt/90' : 'text-amber-200/90')}>{bookState.message}</p>
              ) : null}
              {bookState.ok && (bookState.waiverUrl || bookState.paymentUrl) ? (
                <div className="mt-3 space-y-3 rounded border border-formula-frost/12 bg-formula-base/40 p-3 font-mono text-[10px] text-formula-paper">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-formula-mist">New links from this save</p>
                  {bookState.waiverUrl ? (
                    <div>
                      <span className="text-formula-mist">Waiver</span>
                      <code className="mt-1 block break-all rounded border border-formula-frost/12 bg-black/25 px-2 py-1.5 text-formula-frost/90">{bookState.waiverUrl}</code>
                      <button
                        type="button"
                        className="mt-1 text-formula-volt underline-offset-2 hover:underline"
                        onClick={() => void navigator.clipboard.writeText(bookState.waiverUrl!)}
                      >
                        Copy waiver URL
                      </button>
                    </div>
                  ) : null}
                  {bookState.paymentUrl ? (
                    <div>
                      <span className="text-formula-mist">Stripe checkout</span>
                      <code className="mt-1 block break-all rounded border border-formula-frost/12 bg-black/25 px-2 py-1.5 text-formula-frost/90">{bookState.paymentUrl}</code>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <a
                          href={bookState.paymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-formula-volt underline-offset-2 hover:underline"
                        >
                          Open checkout
                        </a>
                        <button
                          type="button"
                          className="text-formula-mist underline-offset-2 hover:underline"
                          onClick={() => void navigator.clipboard.writeText(bookState.paymentUrl!)}
                        >
                          Copy payment URL
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </AdminPanel>

            <AdminPanel
              title="Search & manage"
              eyebrow="LIST"
              actions={
                <label className="flex max-w-md flex-1 items-center gap-2 font-mono text-[10px] text-formula-mist">
                  <Search className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                  <input
                    type="search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Title, date, organizer, field, status…"
                    className="min-w-0 flex-1 border border-formula-frost/14 bg-formula-base/50 px-2 py-1.5 text-[12px] text-formula-paper placeholder:text-formula-mist/50"
                  />
                </label>
              }
            >
              {filtered.length === 0 ? (
                <p className="font-mono text-[11px] text-formula-mist">No events match this search yet.</p>
              ) : (
                <div className="space-y-4">
                  {filtered.map(ev => {
                    const waiverUrl = ev.waiver_invite_id ? waiverUrlByEventId[ev.id] : null
                    const defaultPayee = ev.organizer_name?.trim() || 'Event customer'
                    const defaultMemo = [`Event: ${ev.title}`, `Date: ${ev.event_date}`, `${formatMinuteClock(ev.start_minute)} · ${ev.duration_minutes} min`, FIELD_LABELS[ev.field_scope], `${siteOrigin}/admin/events`].join(' · ')
                    return (
                      <div
                        id={`facility-event-${ev.id}`}
                        key={ev.id}
                        className="rounded-md border border-formula-frost/12 bg-formula-base/35 p-3 font-mono text-[11px] scroll-mt-24"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-formula-paper">{ev.title}</p>
                            <p className="mt-1 text-formula-frost/85">
                              {ev.event_date} · {formatMinuteClock(ev.start_minute)} · {ev.duration_minutes} min · {FIELD_LABELS[ev.field_scope]}
                            </p>
                            {ev.organizer_name || ev.organizer_email ? (
                              <p className="mt-1 text-formula-mist/90">
                                {ev.organizer_name}
                                {ev.organizer_email ? ` · ${ev.organizer_email}` : ''}
                              </p>
                            ) : null}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="text-[10px] text-formula-mist">
                              Status
                              <select
                                className="ml-1 border border-formula-frost/18 bg-formula-base/60 px-2 py-1 text-[11px] text-formula-paper"
                                value={ev.status}
                                disabled={pendingStatus}
                                onChange={e => void onStatus(ev.id, e.target.value as FacilityEventStatus)}
                              >
                                <option value="draft">Draft</option>
                                <option value="requested">Requested</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </label>
                            <Link
                              href={`/admin/schedule?weekStart=${encodeURIComponent(weekStartSundayForFacilityYmd(ev.event_date))}`}
                              className="inline-flex items-center gap-1 rounded border border-formula-frost/20 px-2 py-1 text-[10px] uppercase tracking-wide text-formula-volt hover:border-formula-volt/40"
                            >
                              <Calendar className="h-3 w-3" aria-hidden />
                              On schedule
                            </Link>
                          </div>
                        </div>

                        <div className="mt-3 grid gap-3 border-t border-formula-frost/10 pt-3 md:grid-cols-2">
                          <div className="md:col-span-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-formula-mist">Links for this event</p>
                            <p className="mt-1 text-[10px] leading-relaxed text-formula-frost/75">
                              Waiver is stored on this event row. Checkout can attach the same roster invite to Stripe metadata when a waiver exists — create waiver first if you need both.
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-formula-mist">Attendee waiver</p>
                            {waiverUrl ? (
                              <div className="mt-2 space-y-2">
                                <code className="block break-all rounded border border-formula-frost/12 bg-black/25 px-2 py-1.5 text-[10px] text-formula-frost/90">
                                  {waiverUrl}
                                </code>
                                <button
                                  type="button"
                                  className="text-[10px] uppercase tracking-wide text-formula-volt underline-offset-2 hover:underline"
                                  onClick={() => void navigator.clipboard.writeText(waiverUrl)}
                                >
                                  <Copy className="mr-1 inline h-3 w-3" aria-hidden />
                                  Copy waiver link
                                </button>
                              </div>
                            ) : (
                              <form className="mt-2 space-y-2" onSubmit={onWaiverSubmit}>
                                <input type="hidden" name="eventId" value={ev.id} />
                                <label className="block text-[10px] text-formula-mist">
                                  Expected signers
                                  <input
                                    name="expectedWaiverCount"
                                    type="number"
                                    min={1}
                                    max={500}
                                    defaultValue={30}
                                    className="mt-0.5 w-full border border-formula-frost/16 bg-formula-paper/[0.04] px-2 py-1 text-formula-paper"
                                  />
                                </label>
                                <Button type="submit" variant="secondary" size="sm" loading={waiverBusyId === ev.id} className="gap-1">
                                  <FileSignature className="h-3.5 w-3.5" aria-hidden />
                                  Create waiver link
                                </Button>
                              </form>
                            )}
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-formula-mist">Stripe payment link</p>
                            <p className="mt-1 text-[10px] text-formula-frost/70">
                              {ev.waiver_invite_id
                                ? "Checkout metadata includes this event's waiver invite."
                                : 'No waiver on this event yet — link is invoice-only unless you create a waiver first.'}
                            </p>
                            <form className="mt-2 space-y-2" onSubmit={onPaymentSubmit}>
                              <input type="hidden" name="eventId" value={ev.id} />
                              <input type="hidden" name="waiverInviteId" value={ev.waiver_invite_id ?? ''} />
                              <label className="block text-[10px] text-formula-mist">
                                Bill to *
                                <input name="payeeName" required minLength={2} defaultValue={defaultPayee} className="mt-0.5 w-full border border-formula-frost/16 bg-formula-paper/[0.04] px-2 py-1 text-formula-paper" />
                              </label>
                              <label className="block text-[10px] text-formula-mist">
                                Amount (USD) *
                                <input name="amountUsd" required inputMode="decimal" placeholder="e.g. 500" className="mt-0.5 w-full border border-formula-frost/16 bg-formula-paper/[0.04] px-2 py-1 text-formula-paper" />
                              </label>
                              <label className="block text-[10px] text-formula-mist">
                                Email (optional)
                                <input name="customerEmail" type="email" defaultValue={ev.organizer_email ?? ''} className="mt-0.5 w-full border border-formula-frost/16 bg-formula-paper/[0.04] px-2 py-1 text-formula-paper" />
                              </label>
                              <label className="block text-[10px] text-formula-mist">
                                Memo
                                <textarea name="memo" rows={2} defaultValue={defaultMemo} className="mt-0.5 w-full border border-formula-frost/16 bg-formula-paper/[0.04] px-2 py-1 text-[11px] text-formula-paper" />
                              </label>
                              <Button type="submit" variant="secondary" size="sm" loading={payBusyId === ev.id} className="gap-1">
                                <CreditCard className="h-3.5 w-3.5" aria-hidden />
                                Create payment link
                              </Button>
                            </form>
                            {payFlash?.eventId === ev.id ? (
                              <div className="mt-2 space-y-1">
                                <a
                                  href={payFlash.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block text-[10px] text-formula-volt underline-offset-2 hover:underline"
                                >
                                  Open Checkout
                                </a>
                                <button
                                  type="button"
                                  className="ml-2 text-[10px] text-formula-mist underline-offset-2 hover:underline"
                                  onClick={() => void navigator.clipboard.writeText(payFlash.url)}
                                >
                                  <Check className="mr-1 inline h-3 w-3" aria-hidden />
                                  Copy URL
                                </button>
                              </div>
                            ) : null}
                            {payError?.eventId === ev.id ? (
                              <p className="mt-1 text-[10px] text-amber-200/90">{payError.message}</p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </AdminPanel>
          </>
        )}
      </div>
    </PageContainer>
  )
}
