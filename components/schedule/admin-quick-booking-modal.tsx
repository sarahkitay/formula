'use client'

import * as React from 'react'
import Link from 'next/link'
import { isoDateForWeekDay } from '@/lib/schedule/generator'
import { PROGRAM_UI } from '@/lib/schedule/rules'
import { SCHEDULE_ASSETS } from '@/lib/schedule/assets'
import type { CalendarFeedBlock } from '@/lib/schedule/calendar-feed'
import type { DayIndex, GeneratedWeek, ScheduleOverride, ScheduleProgramKind, ScheduleSlot } from '@/types/schedule'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { DAY_LABELS } from '@/components/schedule/control-schedule-grid'
import { clampDayMinutes, formatWallTimeForInput, parseWallTimeToMinutes } from '@/lib/schedule/wall-time'
import { CAL_DISPLAY_END, CAL_DISPLAY_START } from '@/lib/schedule/calendar-day-layout'
import { cn } from '@/lib/utils'

const PROGRAM_KINDS = Object.keys(PROGRAM_UI) as ScheduleProgramKind[]

const FIELD_LABEL = 'block text-[11px] font-medium text-text-primary'
const FIELD_HINT = 'mt-0.5 block text-[10px] text-text-muted'
const FIELD_CONTROL =
  'mt-0.5 w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-text-primary shadow-sm placeholder:text-text-muted focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50'

function formatHm(minute: number) {
  const h = Math.floor(minute / 60)
  const m = minute % 60
  const am = h >= 12 ? 'p' : 'a'
  const hr = h > 12 ? h - 12 : h === 0 ? 12 : h
  return m === 0 ? `${hr}${am}` : `${hr}:${m.toString().padStart(2, '0')}${am}`
}

function durationLabel(min: number): string {
  if (min < 60) return `${min} min`
  if (min % 60 === 0) return min === 60 ? '1 hour' : `${min / 60} hours`
  return `${Math.floor(min / 60)}h ${min % 60}m`
}

function snapDurationToGrid(start: number, end: number): { duration: number; end: number } {
  const maxRem = CAL_DISPLAY_END - start
  let dur = Math.max(30, Math.round((end - start) / 30) * 30)
  dur = Math.min(dur, maxRem)
  if (dur < 30) dur = 30
  return { duration: dur, end: Math.min(CAL_DISPLAY_END, start + dur) }
}

export type AdminQuickBookDraft =
  | { source: 'empty'; dayIndex: DayIndex; startMinute: number; endMinute: number }
  | { source: 'block'; block: CalendarFeedBlock }

function nextOverrideId() {
  return `ov-cal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function draftDayIndex(d: AdminQuickBookDraft): DayIndex {
  return d.source === 'empty' ? d.dayIndex : d.block.dayIndex
}

function draftStartEnd(d: AdminQuickBookDraft): { startMinute: number; endMinute: number } {
  if (d.source === 'empty') return { startMinute: d.startMinute, endMinute: d.endMinute }
  return { startMinute: d.block.startMinute, endMinute: d.block.endMinute }
}

function defaultAddOverrideForDraft(d: AdminQuickBookDraft): boolean {
  if (d.source === 'empty') return true
  return d.block.templateSurface === true
}

function kindGuessFromBlock(block: CalendarFeedBlock): ScheduleProgramKind {
  switch (block.category) {
    case 'party':
      return 'party'
    case 'rental_booking':
      return 'field_rental_premium'
    case 'assessment':
      return 'clinic'
    case 'youth_program':
      return 'youth_training'
    case 'field_rental':
      return 'field_rental_premium'
    default:
      return 'flex_ops'
  }
}

function assetIdGuessFromBlock(block: CalendarFeedBlock): string {
  if (block.category === 'rental_booking') {
    const m = block.label.match(/Field rental ·\s*(\S+)/i)
    const fid = m?.[1]?.trim()
    if (fid && SCHEDULE_ASSETS.some(a => a.id === fid)) return fid
  }
  if (block.partyBookingId && block.sublabel) {
    const fid = block.sublabel.split('·')[0]?.trim()
    if (fid && SCHEDULE_ASSETS.some(a => a.id === fid)) return fid
  }
  return 'performance-center'
}

function orgGuessFromBlock(block: CalendarFeedBlock): string {
  const raw = block.label.trim()
  if (block.category === 'rental_booking') {
    return raw.replace(/^Field rental ·\s*/i, '').trim() || raw
  }
  if (block.category === 'party') {
    const m = raw.match(/^Party ·\s*(.+)$/i)
    return (m?.[1] ?? raw).replace(/\s*\([^)]*\)\s*$/, '').trim() || raw
  }
  return raw.replace(/\s*·\s*\d+\s*rotations\s*$/i, '').trim() || raw
}

function buildOverrideLabel(
  mode: 'replace' | 'clear',
  org: string,
  kind: ScheduleProgramKind,
  headcount: string,
  paidUsd: string,
  dueUsd: string
): string {
  if (mode === 'clear') {
    const t = org.trim()
    return t ? `Clear · ${t}` : 'Clear generated slots'
  }
  const name = org.trim() || 'Hold'
  const kindLabel = PROGRAM_UI[kind].key
  const parts: string[] = [name, kindLabel]
  const hc = parseInt(headcount, 10)
  if (!Number.isNaN(hc) && hc > 0) parts.push(`HC ${hc}`)
  const paid = parseFloat(paidUsd.replace(/,/g, ''))
  const due = parseFloat(dueUsd.replace(/,/g, ''))
  if (!Number.isNaN(paid) && paid > 0) parts.push(`Paid $${paid.toFixed(2)}`)
  if (!Number.isNaN(due) && due > 0) parts.push(`Due $${due.toFixed(2)}`)
  return parts.join(' · ')
}

export interface AdminQuickBookingModalProps {
  open: boolean
  onClose: () => void
  weekStart: string
  draft: AdminQuickBookDraft | null
  week: GeneratedWeek | null
  onSave: (override: ScheduleOverride | null, opts: { openPublishTab: boolean }) => void
  onOpenRentalCheckIn?: (block: CalendarFeedBlock) => void
  onOpenRotationRoster?: (slot: ScheduleSlot, relatedSlots: ScheduleSlot[]) => void
}

export function AdminQuickBookingModal({
  open,
  onClose,
  weekStart,
  draft,
  week,
  onSave,
  onOpenRentalCheckIn,
  onOpenRotationRoster,
}: AdminQuickBookingModalProps) {
  const [startText, setStartText] = React.useState('')
  const [endText, setEndText] = React.useState('')
  const [startMinute, setStartMinute] = React.useState(0)
  const [endMinute, setEndMinute] = React.useState(60)
  const [org, setOrg] = React.useState('')
  const [kind, setKind] = React.useState<ScheduleProgramKind>('flex_ops')
  const [headcount, setHeadcount] = React.useState('')
  const [paidUsd, setPaidUsd] = React.useState('')
  const [dueUsd, setDueUsd] = React.useState('')
  const [mode, setMode] = React.useState<'replace' | 'clear'>('replace')
  const [assetId, setAssetId] = React.useState('performance-center')
  const [youthBlockId, setYouthBlockId] = React.useState('')
  const [addOverrideToDraft, setAddOverrideToDraft] = React.useState(true)
  const [ledgerError, setLedgerError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [durationMinutes, setDurationMinutes] = React.useState(60)

  React.useEffect(() => {
    if (!open || !draft) return
    const { startMinute: sm, endMinute: em0 } = draftStartEnd(draft)
    let s = clampDayMinutes(sm)
    s = Math.max(CAL_DISPLAY_START, Math.min(s, CAL_DISPLAY_END - 30))
    let e = clampDayMinutes(em0)
    if (e <= s) e = Math.min(CAL_DISPLAY_END, s + 60)
    e = Math.min(CAL_DISPLAY_END, e)
    const { duration: d0, end: eSnap } = snapDurationToGrid(s, e)
    setStartMinute(s)
    setEndMinute(eSnap)
    setDurationMinutes(d0)
    setStartText(formatWallTimeForInput(s))
    setEndText(formatWallTimeForInput(eSnap))
    setLedgerError(null)
    setAddOverrideToDraft(defaultAddOverrideForDraft(draft))

    if (draft.source === 'block') {
      const b = draft.block
      setOrg(orgGuessFromBlock(b))
      setKind(kindGuessFromBlock(b))
      setHeadcount('')
      setPaidUsd('')
      setDueUsd('')
      setMode('replace')
      setYouthBlockId(b.youthBlockId ?? '')
      setAssetId(assetIdGuessFromBlock(b))
    } else {
      setOrg('')
      setKind('flex_ops')
      setHeadcount('')
      setPaidUsd('')
      setDueUsd('')
      setMode('replace')
      setAssetId('performance-center')
      setYouthBlockId('')
    }
  }, [open, draft])

  const dateLabel = draft ? isoDateForWeekDay(weekStart, draftDayIndex(draft)) : ''

  const durationOptions = React.useMemo(() => {
    const maxRem = Math.max(30, CAL_DISPLAY_END - startMinute)
    const out: number[] = []
    for (let m = 30; m <= maxRem; m += 30) out.push(m)
    return out.length ? out : [30]
  }, [startMinute])

  const commitTime = React.useCallback(
    (which: 'start' | 'end', raw: string) => {
      const p = parseWallTimeToMinutes(raw.trim())
      if (p == null) {
        if (which === 'start') setStartText(formatWallTimeForInput(startMinute))
        else setEndText(formatWallTimeForInput(endMinute))
        return
      }
      const m = clampDayMinutes(p)
      if (which === 'start') {
        const ns = Math.max(CAL_DISPLAY_START, Math.min(m, CAL_DISPLAY_END - 30))
        const maxDur = CAL_DISPLAY_END - ns
        const nextDur = Math.min(durationMinutes, Math.max(30, Math.floor(maxDur / 30) * 30))
        const ne = Math.min(CAL_DISPLAY_END, ns + nextDur)
        setStartMinute(ns)
        setStartText(formatWallTimeForInput(ns))
        setDurationMinutes(nextDur)
        setEndMinute(ne)
        setEndText(formatWallTimeForInput(ne))
        return
      }
      let e = clampDayMinutes(m)
      e = Math.min(CAL_DISPLAY_END, e)
      if (e <= startMinute) e = Math.min(CAL_DISPLAY_END, startMinute + 30)
      const { duration: dNext, end: eFinal } = snapDurationToGrid(startMinute, e)
      setDurationMinutes(dNext)
      setEndMinute(eFinal)
      setEndText(formatWallTimeForInput(eFinal))
    },
    [durationMinutes, endMinute, startMinute]
  )

  React.useEffect(() => {
    if (!open) return
    if (durationOptions.includes(durationMinutes)) return
    const next = durationOptions[durationOptions.length - 1] ?? 30
    setDurationMinutes(next)
    const ne = Math.min(CAL_DISPLAY_END, startMinute + next)
    setEndMinute(ne)
    setEndText(formatWallTimeForInput(ne))
  }, [open, durationOptions, durationMinutes, startMinute])

  const buildRow = (): ScheduleOverride | null => {
    if (!draft) return null
    const s = Math.max(CAL_DISPLAY_START, Math.min(startMinute, CAL_DISPLAY_END - 30))
    const e = Math.min(CAL_DISPLAY_END, s + durationMinutes)
    const label = buildOverrideLabel(mode, org, kind, headcount, paidUsd, dueUsd)
    return {
      id: nextOverrideId(),
      date: isoDateForWeekDay(weekStart, draftDayIndex(draft)),
      assetId,
      startMinute: s,
      endMinute: e,
      kind,
      label,
      mode,
      youthBlockId: youthBlockId.trim() || undefined,
    }
  }

  const paidCents = React.useMemo(() => {
    const paid = parseFloat(paidUsd.replace(/,/g, ''))
    if (Number.isNaN(paid) || paid <= 0) return 0
    return Math.round(paid * 100)
  }, [paidUsd])

  const payeeForLedger = org.trim()

  const validOverride =
    mode === 'clear' || (mode === 'replace' && payeeForLedger.length > 0)

  const canRecordLedger = paidCents >= 50 && payeeForLedger.length > 0

  const canSubmit =
    !submitting &&
    ((addOverrideToDraft && validOverride) || (!addOverrideToDraft && canRecordLedger))

  React.useEffect(() => {
    if (!addOverrideToDraft && mode === 'clear') {
      setMode('replace')
    }
  }, [addOverrideToDraft, mode])

  const blockSummary = React.useMemo(() => {
    if (!draft || draft.source !== 'block') return ''
    const b = draft.block
    return `${b.category} · ${b.label}`.slice(0, 400)
  }, [draft])

  const submit = async (openPublishTab: boolean) => {
    if (!draft || !canSubmit) return
    setSubmitting(true)
    setLedgerError(null)
    try {
      if (canRecordLedger) {
        const res = await fetch('/api/admin/schedule-ledger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amountCents: paidCents,
            currency: 'usd',
            email: null,
            payeeName: payeeForLedger,
            notes: mode === 'replace' ? `Schedule · ${PROGRAM_UI[kind].key}` : 'Schedule clear',
            weekStart,
            blockSummary: blockSummary || undefined,
          }),
        })
        const body = (await res.json()) as { error?: string }
        if (!res.ok) {
          setLedgerError(body.error ?? 'Could not record payment')
          return
        }
      }

      let row: ScheduleOverride | null = null
      if (addOverrideToDraft) {
        row = buildRow()
        if (!row) return
        if (mode === 'replace' && !payeeForLedger) return
      }

      onSave(row, { openPublishTab: openPublishTab && !!row })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  const sourceBlock = draft?.source === 'block' ? draft.block : null

  return (
    <Modal open={open} onClose={onClose} title={sourceBlock ? 'Slot · client & revenue' : 'Quick slot'} size="md">
      <ModalBody className="space-y-4 font-mono text-[11px] text-text-primary">
        {!draft ? (
          <p className="text-text-muted">No slot selected.</p>
        ) : (
          <>
            <p className="text-sm font-semibold text-text-primary">
              {DAY_LABELS[draftDayIndex(draft)]} · {dateLabel}
            </p>
            <p className="text-[11px] text-text-muted">
              {sourceBlock
                ? `Existing · ${sourceBlock.category.replace(/_/g, ' ')}`
                : draft.source === 'empty'
                  ? `New booking · ${formatHm(draft.startMinute)}–${formatHm(draft.endMinute)} · change duration (30 min steps) or edit start/end`
                  : null}
            </p>

            {sourceBlock?.programSlotIds?.length && week && onOpenRotationRoster ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const ids = sourceBlock.programSlotIds ?? []
                    const slots = ids
                      .map(id => week.slots.find(s => s.id === id))
                      .filter((s): s is ScheduleSlot => s != null)
                    if (slots[0]) {
                      onOpenRotationRoster(slots[0]!, slots)
                      onClose()
                    }
                  }}
                >
                  Rotation roster &amp; check-in
                </Button>
              </div>
            ) : null}

            {sourceBlock?.category === 'rental_booking' && onOpenRentalCheckIn ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    onOpenRentalCheckIn(sourceBlock)
                    onClose()
                  }}
                >
                  Rental waivers &amp; check-in
                </Button>
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-3">
              <label className={FIELD_LABEL}>
                <span className="block">Start</span>
                <input
                  className={FIELD_CONTROL}
                  value={startText}
                  onChange={e => setStartText(e.target.value)}
                  onBlur={() => commitTime('start', startText)}
                  spellCheck={false}
                  autoComplete="off"
                />
                <span className={FIELD_HINT}>Wall time (e.g. 8:15 pm)</span>
              </label>
              <label className={FIELD_LABEL}>
                <span className="block">End</span>
                <input
                  className={FIELD_CONTROL}
                  value={endText}
                  onChange={e => setEndText(e.target.value)}
                  onBlur={() => commitTime('end', endText)}
                  spellCheck={false}
                  autoComplete="off"
                />
                <span className={FIELD_HINT}>Or pick a duration below (30 min steps)</span>
              </label>
            </div>

            <label className={FIELD_LABEL}>
              <span className="block">Duration</span>
              <select
                className={FIELD_CONTROL}
                value={durationMinutes}
                onChange={e => {
                  const d = Number(e.target.value)
                  setDurationMinutes(d)
                  const ne = Math.min(CAL_DISPLAY_END, startMinute + d)
                  setEndMinute(ne)
                  setEndText(formatWallTimeForInput(ne))
                }}
              >
                {durationOptions.map(m => (
                  <option key={m} value={m}>
                    {durationLabel(m)}
                  </option>
                ))}
              </select>
              <span className={FIELD_HINT}>
                Adds to start time; capped at 11:00 PM on the facility calendar ({formatHm(CAL_DISPLAY_END)}).
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-2.5 text-[11px] text-text-secondary">
              <input
                type="checkbox"
                checked={addOverrideToDraft}
                onChange={e => setAddOverrideToDraft(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring/40"
              />
              <span>
                Add a published <strong className="text-text-primary">schedule override</strong> (draft in config).
                Turn off for payment-only on existing rentals / parties / assessments.
              </span>
            </label>

            <label className={FIELD_LABEL}>
              <span className="block">Mode</span>
              <div className="mt-1 flex rounded-md border border-border bg-muted/50 p-0.5">
                <button
                  type="button"
                  disabled={!addOverrideToDraft}
                  className={cn(
                    'flex-1 rounded px-2 py-2 text-[10px] font-bold uppercase tracking-wide transition-colors',
                    mode === 'replace'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-text-muted hover:bg-muted hover:text-text-primary',
                    !addOverrideToDraft && 'pointer-events-none opacity-40'
                  )}
                  onClick={() => setMode('replace')}
                >
                  Book / hold
                </button>
                <button
                  type="button"
                  disabled={!addOverrideToDraft}
                  className={cn(
                    'flex-1 rounded px-2 py-2 text-[10px] font-bold uppercase tracking-wide transition-colors',
                    mode === 'clear'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-text-muted hover:bg-muted hover:text-text-primary',
                    !addOverrideToDraft && 'pointer-events-none opacity-40'
                  )}
                  onClick={() => setMode('clear')}
                >
                  Clear only
                </button>
              </div>
            </label>

            {addOverrideToDraft && mode === 'replace' ? (
              <>
                <label className={FIELD_LABEL}>
                  <span className="block">Client or organization</span>
                  <input
                    className={FIELD_CONTROL}
                    value={org}
                    onChange={e => setOrg(e.target.value)}
                    placeholder="e.g. Smith family, Westside FC"
                    spellCheck={false}
                    autoComplete="off"
                  />
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className={FIELD_LABEL}>
                    <span className="block">Session type</span>
                    <select
                      className={FIELD_CONTROL}
                      value={kind}
                      onChange={e => setKind(e.target.value as ScheduleProgramKind)}
                    >
                      {PROGRAM_KINDS.map(k => (
                        <option key={k} value={k}>
                          {PROGRAM_UI[k].key}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={FIELD_LABEL}>
                    <span className="block">Headcount (optional)</span>
                    <input
                      className={FIELD_CONTROL}
                      value={headcount}
                      onChange={e => setHeadcount(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      inputMode="numeric"
                      placeholder="12"
                    />
                  </label>
                </div>
              </>
            ) : addOverrideToDraft && mode === 'clear' ? (
              <label className={FIELD_LABEL}>
                <span className="block">Note (optional)</span>
                <input
                  className={FIELD_CONTROL}
                  value={org}
                  onChange={e => setOrg(e.target.value)}
                  placeholder="Why this window is cleared"
                  spellCheck={false}
                  autoComplete="off"
                />
              </label>
            ) : (
              <label className={FIELD_LABEL}>
                <span className="block">Payee (for ledger)</span>
                <input
                  className={FIELD_CONTROL}
                  value={org}
                  onChange={e => setOrg(e.target.value)}
                  placeholder="Name or org on the receipt"
                  spellCheck={false}
                  autoComplete="off"
                />
              </label>
            )}

            <div className="grid grid-cols-2 gap-3">
              <label className={FIELD_LABEL}>
                <span className="block">Paid (USD)</span>
                <input
                  className={FIELD_CONTROL}
                  value={paidUsd}
                  onChange={e => setPaidUsd(e.target.value)}
                  inputMode="decimal"
                  placeholder="0"
                />
                <span className={FIELD_HINT}>Posts to Payments at $0.50 or more</span>
              </label>
              <label className={FIELD_LABEL}>
                <span className="block">Due (USD, optional)</span>
                <input
                  className={FIELD_CONTROL}
                  value={dueUsd}
                  onChange={e => setDueUsd(e.target.value)}
                  inputMode="decimal"
                  placeholder="0"
                  disabled={!addOverrideToDraft}
                />
              </label>
            </div>

            {addOverrideToDraft ? (
              <>
                <label className={FIELD_LABEL}>
                  <span className="block">Asset</span>
                  <select
                    className={FIELD_CONTROL}
                    value={assetId}
                    onChange={e => setAssetId(e.target.value)}
                  >
                    {SCHEDULE_ASSETS.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={FIELD_LABEL}>
                  <span className="block">youthBlockId (optional)</span>
                  <input
                    className={FIELD_CONTROL}
                    value={youthBlockId}
                    onChange={e => setYouthBlockId(e.target.value)}
                    placeholder="Preserve parent bookings when replacing a youth anchor"
                    spellCheck={false}
                    autoComplete="off"
                  />
                </label>
              </>
            ) : null}

            {ledgerError ? (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-[11px] text-destructive">
                {ledgerError}
              </p>
            ) : null}

            <p className="rounded-md border border-border bg-muted/60 px-3 py-2.5 text-[11px] leading-relaxed text-text-secondary">
              Paid amounts write a <strong className="text-text-primary">manual-invoice</strong> row to{' '}
              <Link href="/admin/payments" className="font-medium text-primary underline-offset-2 hover:underline">
                Payments
              </Link>
              . Due amounts stay on the override label until you collect them.
            </p>
          </>
        )}
      </ModalBody>
      <ModalFooter className="flex-wrap justify-between gap-2 sm:flex-nowrap">
        <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" disabled={!canSubmit} onClick={() => void submit(false)}>
            {addOverrideToDraft ? 'Add to draft' : 'Record payment'}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={!canSubmit || !addOverrideToDraft}
            onClick={() => void submit(true)}
          >
            Add &amp; open Publish
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}
