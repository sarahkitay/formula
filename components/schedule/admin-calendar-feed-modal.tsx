'use client'

import * as React from 'react'
import Link from 'next/link'
import type { FieldRentalAgreementRow } from '@/lib/rentals/field-rental-agreements-server'
import type { RentalWaiverCheckinRow } from '@/lib/rentals/rental-waiver-checkins-server'
import type { WaiverInviteRow } from '@/lib/rentals/waiver-invites-server'
import type { CalendarFeedBlock } from '@/lib/schedule/calendar-feed'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { DAY_LABELS } from '@/components/schedule/control-schedule-grid'
import { humanRentalWindowSummary } from '@/lib/rentals/rental-time-window'
import { formatFacilityDateTimeShort } from '@/lib/facility/format-facility-datetime'
import { cn } from '@/lib/utils'

function formatHm(minute: number) {
  const h = Math.floor(minute / 60)
  const m = minute % 60
  const am = h >= 12 ? 'p' : 'a'
  const hr = h > 12 ? h - 12 : h === 0 ? 12 : h
  return m === 0 ? `${hr}${am}` : `${hr}:${m.toString().padStart(2, '0')}${am}`
}

type RentalBookingDetail = {
  id: string
  field_id: string
  session_date: string
  time_slot: string
  rental_ref: string
  stripe_checkout_session_id: string | null
  status: string
}

function waiverInviteIdFromBlock(block: CalendarFeedBlock): string | null {
  const fromProp = block.waiverInviteId?.trim()
  if (fromProp && /^[0-9a-f-]{36}$/i.test(fromProp)) return fromProp
  const m = /^waiver-inv-([0-9a-f-]{36})-/i.exec(block.id)
  return m ? m[1] : null
}

export interface AdminCalendarFeedModalProps {
  open: boolean
  onClose: () => void
  weekStart: string
  block: CalendarFeedBlock | null
  onOpenPublishTab: () => void
}

export function AdminCalendarFeedModal({
  open,
  onClose,
  weekStart,
  block,
  onOpenPublishTab,
}: AdminCalendarFeedModalProps) {
  const [loading, setLoading] = React.useState(false)
  const [rentalDetail, setRentalDetail] = React.useState<{
    booking: RentalBookingDetail
    agreements: FieldRentalAgreementRow[]
    checkins: RentalWaiverCheckinRow[]
  } | null>(null)
  const [inviteDetail, setInviteDetail] = React.useState<{
    invite: WaiverInviteRow
    agreements: FieldRentalAgreementRow[]
  } | null>(null)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [checkinError, setCheckinError] = React.useState<string | null>(null)
  const [checkinBusyId, setCheckinBusyId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open || !block) {
      setRentalDetail(null)
      setInviteDetail(null)
      setLoadError(null)
      return
    }

    const inviteId = waiverInviteIdFromBlock(block)
    const isSlotBooking = block.id.startsWith('rent-')

    if (!isSlotBooking && !inviteId) {
      setRentalDetail(null)
      setInviteDetail(null)
      setLoadError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setLoadError(null)
    setCheckinError(null)

    if (isSlotBooking) {
      setInviteDetail(null)
      const rawId = block.id.slice('rent-'.length)
      void (async () => {
        try {
          const res = await fetch(`/api/schedule/rental-booking-detail?id=${encodeURIComponent(rawId)}`)
          const body = (await res.json()) as {
            booking?: RentalBookingDetail
            agreements?: FieldRentalAgreementRow[]
            checkins?: RentalWaiverCheckinRow[]
            error?: string
          }
          if (!res.ok) throw new Error(body.error ?? 'Failed to load rental')
          if (!cancelled && body.booking) {
            setRentalDetail({
              booking: body.booking,
              agreements: body.agreements ?? [],
              checkins: body.checkins ?? [],
            })
          }
        } catch (e) {
          if (!cancelled) {
            setRentalDetail(null)
            setLoadError(e instanceof Error ? e.message : 'Failed to load')
          }
        } finally {
          if (!cancelled) setLoading(false)
        }
      })()
    } else if (inviteId) {
      setRentalDetail(null)
      void (async () => {
        try {
          const res = await fetch(`/api/schedule/waiver-invite-detail?id=${encodeURIComponent(inviteId)}`)
          const body = (await res.json()) as {
            invite?: WaiverInviteRow
            agreements?: FieldRentalAgreementRow[]
            error?: string
          }
          if (!res.ok) throw new Error(body.error ?? 'Failed to load roster invite')
          if (!cancelled && body.invite) {
            setInviteDetail({ invite: body.invite, agreements: body.agreements ?? [] })
          }
        } catch (e) {
          if (!cancelled) {
            setInviteDetail(null)
            setLoadError(e instanceof Error ? e.message : 'Failed to load')
          }
        } finally {
          if (!cancelled) setLoading(false)
        }
      })()
    }

    return () => {
      cancelled = true
    }
  }, [open, block])

  const checkinMap = React.useMemo(() => {
    const m = new Map<string, RentalWaiverCheckinRow>()
    for (const c of rentalDetail?.checkins ?? []) {
      m.set(c.field_rental_agreement_id, c)
    }
    return m
  }, [rentalDetail?.checkins])

  const toggleWaiverCheckIn = React.useCallback(
    async (agreementId: string, checkedIn: boolean) => {
      if (!rentalDetail) return
      setCheckinBusyId(agreementId)
      setCheckinError(null)
      try {
        const res = await fetch('/api/schedule/rental-booking-detail', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: rentalDetail.booking.id,
            agreementId,
            checkedIn,
            checkedInBy: 'admin-schedule',
          }),
        })
        const body = (await res.json()) as { ok?: boolean; checkins?: RentalWaiverCheckinRow[]; error?: string }
        if (!res.ok) throw new Error(body.error ?? 'Check-in update failed')
        if (body.checkins) {
          setRentalDetail(prev => (prev ? { ...prev, checkins: body.checkins! } : prev))
        }
      } catch (e) {
        setCheckinError(e instanceof Error ? e.message : 'Check-in update failed')
      } finally {
        setCheckinBusyId(null)
      }
    },
    [rentalDetail]
  )

  if (!block) return null

  const day = DAY_LABELS[block.dayIndex]
  const isRentalSlot = block.id.startsWith('rent-')
  const isWaiverInviteBlock = Boolean(waiverInviteIdFromBlock(block))
  const modalTitle = isRentalSlot ? 'Field rental hold' : isWaiverInviteBlock ? 'Roster rental' : 'Calendar entry'
  const checkedInCount = rentalDetail ? rentalDetail.checkins.length : 0
  const waiverCount = rentalDetail?.agreements.length ?? 0

  return (
    <Modal open={open} onClose={onClose} title={modalTitle} size="sm">
      <ModalBody className="space-y-3">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">When</p>
          <p className="mt-0.5 text-sm font-semibold text-text-primary">
            {day} · week of {weekStart} · {formatHm(block.startMinute)}–{formatHm(block.endMinute)}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">Source</p>
          <p className="mt-0.5 text-sm text-text-primary">{block.label}</p>
          {block.sublabel ? (
            <p className="mt-0.5 text-xs text-text-secondary">
              {block.category === 'rental_booking' ? humanRentalWindowSummary(block.sublabel) : block.sublabel}
            </p>
          ) : null}
        </div>

        {isRentalSlot ? (
          <div className="space-y-2 rounded border border-formula-frost/12 bg-formula-paper/[0.05] px-3 py-2 text-xs text-text-secondary shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
            {loading ? <p className="font-mono text-[10px] text-text-muted">Loading roster waivers…</p> : null}
            {loadError ? <p className="text-amber-200/90">{loadError}</p> : null}
            {checkinError ? <p className="text-amber-200/90">{checkinError}</p> : null}
            {rentalDetail ? (
              <>
                <p>
                  <span className="font-semibold text-text-primary">Ref</span> {rentalDetail.booking.rental_ref}
                </p>
                <p>
                  <span className="font-semibold text-text-primary">Status</span> {rentalDetail.booking.status}
                </p>
                <p>
                  <span className="font-semibold text-text-primary">Window in database</span>{' '}
                  {humanRentalWindowSummary(rentalDetail.booking.time_slot)}
                </p>
                <p className="font-semibold text-text-primary">Signed waivers ({rentalDetail.agreements.length})</p>
                {rentalDetail.agreements.length === 0 ? (
                  <p className="text-text-muted">None submitted yet for this slot.</p>
                ) : (
                  <>
                    <p className="font-mono text-[10px] text-text-muted">
                      Check-in:{' '}
                      <span className="font-semibold text-text-primary">
                        {checkedInCount} / {waiverCount}
                      </span>{' '}
                      signers marked present
                    </p>
                    <ul className="max-h-[min(50vh,18rem)] divide-y divide-border/50 overflow-y-auto rounded border border-border/60">
                      {rentalDetail.agreements.map(a => {
                        const cin = checkinMap.get(a.id)
                        const busy = checkinBusyId === a.id
                        return (
                          <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 px-2 py-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                <Link
                                  href={`/admin/rentals/waivers/${a.id}`}
                                  className="text-[11px] font-semibold text-formula-volt underline-offset-2 hover:underline"
                                >
                                  {a.participant_name}
                                </Link>
                                <span className="font-mono text-[9px] uppercase tracking-wide text-text-muted">
                                  {a.rental_type.replace(/_/g, ' ')}
                                </span>
                              </div>
                              <p className="truncate font-mono text-[10px] text-text-muted">{a.participant_email}</p>
                              {cin ? (
                                <p className="mt-0.5 font-mono text-[9px] text-formula-volt/90">
                                  Present · {formatFacilityDateTimeShort(cin.checked_in_at)}
                                </p>
                              ) : (
                                <p className="mt-0.5 font-mono text-[9px] text-text-muted">Not checked in</p>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              disabled={busy}
                              className={cn('shrink-0', cin && 'border-formula-volt/35 bg-formula-volt/10')}
                              onClick={() => void toggleWaiverCheckIn(a.id, !cin)}
                            >
                              {busy ? '…' : cin ? 'Undo' : 'Check in'}
                            </Button>
                          </li>
                        )
                      })}
                    </ul>
                  </>
                )}
              </>
            ) : null}
          </div>
        ) : isWaiverInviteBlock ? (
          <div className="space-y-2 rounded border border-formula-frost/12 bg-formula-paper/[0.05] px-3 py-2 text-xs text-text-secondary shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
            {loading ? <p className="font-mono text-[10px] text-text-muted">Loading roster invite…</p> : null}
            {loadError ? <p className="text-amber-200/90">{loadError}</p> : null}
            {inviteDetail ? (
              <>
                <p>
                  <span className="font-semibold text-text-primary">Expected waivers</span>{' '}
                  {inviteDetail.invite.expected_waiver_count}
                </p>
                {inviteDetail.invite.rental_ref ? (
                  <p>
                    <span className="font-semibold text-text-primary">Ref</span> {inviteDetail.invite.rental_ref}
                  </p>
                ) : null}
                <p>
                  <span className="font-semibold text-text-primary">Roster link</span>{' '}
                  <Link
                    href={`/rentals/waiver/${inviteDetail.invite.token}`}
                    className="break-all text-formula-volt underline-offset-2 hover:underline"
                  >
                    /rentals/waiver/{inviteDetail.invite.token.slice(0, 12)}…
                  </Link>
                </p>
                <p className="font-semibold text-text-primary">Signed waivers ({inviteDetail.agreements.length})</p>
                {inviteDetail.agreements.length === 0 ? (
                  <p className="text-text-muted">None linked to this invite yet.</p>
                ) : (
                  <ul className="max-h-[min(50vh,18rem)] divide-y divide-border/50 overflow-y-auto rounded border border-border/60">
                    {inviteDetail.agreements.map(a => (
                      <li key={a.id} className="px-2 py-2">
                        <Link
                          href={`/admin/rentals/waivers/${a.id}`}
                          className="text-[11px] font-semibold text-formula-volt underline-offset-2 hover:underline"
                        >
                          {a.participant_name}
                        </Link>
                        <p className="truncate font-mono text-[10px] text-text-muted">{a.participant_email}</p>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="font-mono text-[9px] text-text-muted">
                  Slot check-in uses a paid slot booking; invite-only rows show signers linked to this roster invite.
                </p>
              </>
            ) : null}
          </div>
        ) : (
          <p className="rounded border border-formula-frost/12 bg-formula-paper/[0.05] px-3 py-2 text-xs text-text-secondary shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
            This block is not a generated program slot (assessment, rental, agreement, etc.). Edit underlying records in
            admin tools, or add a <strong className="text-text-primary">schedule override</strong> on the Publish tab to
            reshape generated programs.
          </p>
        )}
      </ModalBody>
      <ModalFooter className="flex flex-wrap gap-2">
        {isRentalSlot || isWaiverInviteBlock ? (
          <Link
            href="/admin/rentals"
            className="inline-flex h-9 items-center rounded-control border border-border bg-muted px-3.5 text-[13px] font-medium text-text-primary no-underline hover:border-border-bright hover:bg-elevated"
          >
            Rentals admin
          </Link>
        ) : null}
        <Button type="button" variant="secondary" size="sm" onClick={onOpenPublishTab}>
          Publish & overrides
        </Button>
        <Button type="button" variant="primary" size="sm" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}
