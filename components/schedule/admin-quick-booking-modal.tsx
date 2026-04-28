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
import { cn } from '@/lib/utils'

const PROGRAM_KINDS = Object.keys(PROGRAM_UI) as ScheduleProgramKind[]

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

  React.useEffect(() => {
    if (!open || !draft) return
    const { startMinute: sm, endMinute: em0 } = draftStartEnd(draft)
    const s = clampDayMinutes(sm)
    let e = clampDayMinutes(em0)
    if (e <= s) e = Math.min(24 * 60, s + 60)
    setStartMinute(s)
    setEndMinute(e)
    setStartText(formatWallTimeForInput(s))
    setEndText(formatWallTimeForInput(e))
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

  const commitTime = (which: 'start' | 'end', raw: string) => {
    const p = parseWallTimeToMinutes(raw.trim())
    if (p == null) {
      if (which === 'start') setStartText(formatWallTimeForInput(startMinute))
      else setEndText(formatWallTimeForInput(endMinute))
      return
    }
    const m = clampDayMinutes(p)
    if (which === 'start') {
      setStartMinute(m)
      setStartText(formatWallTimeForInput(m))
      setEndMinute(prev => {
        if (prev <= m) {
          const next = Math.min(24 * 60, m + 60)
          setEndText(formatWallTimeForInput(next))
          return next
        }
        return prev
      })
    } else {
      let e = clampDayMinutes(m)
      if (e <= startMinute) e = Math.min(24 * 60, startMinute + 60)
      setEndMinute(e)
      setEndText(formatWallTimeForInput(e))
    }
  }

  const buildRow = (): ScheduleOverride | null => {
    if (!draft) return null
    let s = startMinute
    let e = endMinute
    if (e <= s) e = Math.min(24 * 60, s + 60)
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
      <ModalBody className="space-y-4 font-mono text-[11px]">
        {!draft ? (
          <p className="text-formula-mist">No slot selected.</p>
        ) : (
          <>
            <p className="text-formula-frost/85">
              {DAY_LABELS[draftDayIndex(draft)]} · {dateLabel} ·{' '}
              {sourceBlock ? `${sourceBlock.category.replace(/_/g, ' ')}` : 'Empty grid'}
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
              <label className="text-formula-mist">
                <span className="block">Start</span>
                <input
                  className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-2 py-1.5 text-formula-paper"
                  value={startText}
                  onChange={e => setStartText(e.target.value)}
                  onBlur={() => commitTime('start', startText)}
                  spellCheck={false}
                  autoComplete="off"
                />
              </label>
              <label className="text-formula-mist">
                <span className="block">End</span>
                <input
                  className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-2 py-1.5 text-formula-paper"
                  value={endText}
                  onChange={e => setEndText(e.target.value)}
                  onBlur={() => commitTime('end', endText)}
                  spellCheck={false}
                  autoComplete="off"
                />
              </label>
            </div>

            <label className="flex cursor-pointer items-start gap-2 text-formula-frost/85">
              <input
                type="checkbox"
                checked={addOverrideToDraft}
                onChange={e => setAddOverrideToDraft(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-formula-frost/30 bg-formula-deep/40"
              />
              <span>
                Add a published <strong className="text-formula-paper">schedule override</strong> (draft in config).
                Turn off for payment-only on existing rentals / parties / assessments.
              </span>
            </label>

            <label className="block text-formula-mist">
              <span className="block">Mode</span>
              <div className="mt-1 flex rounded border border-formula-frost/14 p-0.5">
                <button
                  type="button"
                  disabled={!addOverrideToDraft}
                  className={cn(
                    'flex-1 rounded px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-colors',
                    mode === 'replace'
                      ? 'bg-formula-volt text-formula-base'
                      : 'text-formula-frost/80 hover:bg-formula-paper/[0.06]',
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
                    'flex-1 rounded px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-colors',
                    mode === 'clear'
                      ? 'bg-formula-volt text-formula-base'
                      : 'text-formula-frost/80 hover:bg-formula-paper/[0.06]',
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
                <label className="block text-formula-mist">
                  <span className="block">Client or organization</span>
                  <input
                    className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-2 py-1.5 text-formula-paper"
                    value={org}
                    onChange={e => setOrg(e.target.value)}
                    placeholder="e.g. Smith family, Westside FC"
                    spellCheck={false}
                    autoComplete="off"
                  />
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="text-formula-mist">
                    <span className="block">Session type</span>
                    <select
                      className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-2 py-1.5 text-formula-paper"
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
                  <label className="text-formula-mist">
                    <span className="block">Headcount (optional)</span>
                    <input
                      className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-2 py-1.5 text-formula-paper"
                      value={headcount}
                      onChange={e => setHeadcount(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      inputMode="numeric"
                      placeholder="12"
                    />
                  </label>
                </div>
              </>
            ) : addOverrideToDraft && mode === 'clear' ? (
              <label className="block text-formula-mist">
                <span className="block">Note (optional)</span>
                <input
                  className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-2 py-1.5 text-formula-paper"
                  value={org}
                  onChange={e => setOrg(e.target.value)}
                  placeholder="Why this window is cleared"
                  spellCheck={false}
                  autoComplete="off"
                />
              </label>
            ) : (
              <label className="block text-formula-mist">
                <span className="block">Payee (for ledger)</span>
                <input
                  className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-2 py-1.5 text-formula-paper"
                  value={org}
                  onChange={e => setOrg(e.target.value)}
                  placeholder="Name or org on the receipt"
                  spellCheck={false}
                  autoComplete="off"
                />
              </label>
            )}

            <div className="grid grid-cols-2 gap-3">
              <label className="text-formula-mist">
                <span className="block">Paid (USD) — posts to Payments at $0.50+</span>
                <input
                  className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-2 py-1.5 text-formula-paper"
                  value={paidUsd}
                  onChange={e => setPaidUsd(e.target.value)}
                  inputMode="decimal"
                  placeholder="0"
                />
              </label>
              <label className="text-formula-mist">
                <span className="block">Due (USD, optional)</span>
                <input
                  className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-2 py-1.5 text-formula-paper"
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
                <label className="block text-formula-mist">
                  <span className="block">Asset</span>
                  <select
                    className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-2 py-1.5 text-formula-paper"
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

                <label className="block text-formula-mist">
                  <span className="block">youthBlockId (optional)</span>
                  <input
                    className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-2 py-1.5 text-formula-paper"
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
              <p className="border border-red-500/35 bg-red-950/35 px-3 py-2 text-[10px] text-red-100">{ledgerError}</p>
            ) : null}

            <p className="border border-formula-frost/10 bg-formula-deep/30 px-3 py-2 text-[10px] leading-relaxed text-formula-frost/80">
              Paid amounts write a <strong className="text-formula-paper">manual-invoice</strong> row to{' '}
              <Link href="/admin/payments" className="text-formula-volt underline-offset-2 hover:underline">
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
