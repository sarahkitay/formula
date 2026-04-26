'use client'

import * as React from 'react'
import Link from 'next/link'
import type { FieldRentalAgreementRow } from '@/lib/rentals/field-rental-agreements-server'
import type { CalendarFeedBlock } from '@/lib/schedule/calendar-feed'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { DAY_LABELS } from '@/components/schedule/control-schedule-grid'
import { humanRentalWindowSummary } from '@/lib/rentals/rental-time-window'

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
  } | null>(null)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open || !block) {
      setRentalDetail(null)
      setLoadError(null)
      return
    }
    if (!block.id.startsWith('rent-')) {
      setRentalDetail(null)
      setLoadError(null)
      return
    }
    const rawId = block.id.slice('rent-'.length)
    let cancelled = false
    setLoading(true)
    setLoadError(null)
    void (async () => {
      try {
        const res = await fetch(`/api/schedule/rental-booking-detail?id=${encodeURIComponent(rawId)}`)
        const body = (await res.json()) as {
          booking?: RentalBookingDetail
          agreements?: FieldRentalAgreementRow[]
          error?: string
        }
        if (!res.ok) throw new Error(body.error ?? 'Failed to load rental')
        if (!cancelled && body.booking) {
          setRentalDetail({ booking: body.booking, agreements: body.agreements ?? [] })
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
    return () => {
      cancelled = true
    }
  }, [open, block])

  if (!block) return null

  const day = DAY_LABELS[block.dayIndex]
  const isRental = block.id.startsWith('rent-')

  return (
    <Modal open={open} onClose={onClose} title={isRental ? 'Field rental hold' : 'Calendar entry'} size="sm">
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

        {isRental ? (
          <div className="space-y-2 rounded border border-formula-frost/12 bg-formula-paper/[0.05] px-3 py-2 text-xs text-text-secondary shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
            {loading ? <p className="font-mono text-[10px] text-text-muted">Loading roster waivers…</p> : null}
            {loadError ? <p className="text-amber-200/90">{loadError}</p> : null}
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
                  <ul className="max-h-40 space-y-1 overflow-y-auto border border-border/60 py-1">
                    {rentalDetail.agreements.map(a => (
                      <li key={a.id} className="px-1 font-mono text-[10px] leading-snug text-text-primary">
                        {a.participant_name} · {a.rental_type.replace(/_/g, ' ')}
                      </li>
                    ))}
                  </ul>
                )}
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
        {isRental ? (
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
