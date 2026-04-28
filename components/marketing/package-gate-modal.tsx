'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import {
  FORMULA_MINIS_SIX_WEEK,
  FORMULA_SUNDAY_CHILD_PROGRAM_10_WK,
} from '@/lib/marketing/public-pricing'
import type { ScheduleAgeBand } from '@/types/schedule'

type Props = {
  open: boolean
  onClose: () => void
  bandLabel: string
  /** e.g. U10 / U12 — copy only */
  rosterAgeHint: string
  /** When set, surface Formula Minis / weekend published pricing instead of generic session packages. */
  scheduleAgeBand?: ScheduleAgeBand | null
}

const minisCtaClass =
  'inline-flex h-8 items-center justify-center rounded-control border border-black/15 bg-black px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white hover:brightness-110'

export function PackageGateModal({ open, onClose, bandLabel, rosterAgeHint, scheduleAgeBand }: Props) {
  const [confirmed, setConfirmed] = useState(false)
  const router = useRouter()
  const isMinisBand = scheduleAgeBand === '2-3'
  const isPreschoolBand = scheduleAgeBand === '4-5'
  const showMinisPricing = isMinisBand || isPreschoolBand

  useEffect(() => {
    if (open) setConfirmed(false)
  }, [open])

  return (
    <Modal open={open} onClose={onClose} title="Training block" size="sm" className="text-black [&_h2]:text-black">
      <ModalBody>
        <p className="text-sm text-black">
          Published youth blocks on the calendar are <strong className="font-semibold text-black">band {bandLabel}</strong> ({rosterAgeHint}). Spots are held
          for families with an active training package.
        </p>

        {showMinisPricing ? (
          <div className="mt-4 rounded-md border border-black/10 bg-black/[0.03] p-3 text-black">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-black/60">Published children&apos;s packages</p>
            {isMinisBand ? (
              <ul className="mt-2 space-y-1.5 text-xs leading-snug text-black/90">
                <li>
                  <strong>Weekday Formula Minis</strong> (ages 2–3): {FORMULA_MINIS_SIX_WEEK.label} —{' '}
                  <strong>${FORMULA_MINIS_SIX_WEEK.priceUsd}</strong> ({FORMULA_MINIS_SIX_WEEK.sessionsInPack} sessions · ~$
                  {FORMULA_MINIS_SIX_WEEK.perSessionUsd}/session).
                </li>
                <li>
                  <strong>Sunday Weekend Program</strong> (ages 2–5, including Minis 2–3):{' '}
                  <strong>${FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.priceUsd}</strong> / {FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.sessionsInPack} scheduled Sundays.
                </li>
              </ul>
            ) : (
              <ul className="mt-2 space-y-1.5 text-xs leading-snug text-black/90">
                <li>
                  <strong>Sunday Weekend Program</strong> (ages 2–5): Formula Juniors ages 4 &amp; 5 —{' '}
                  <strong>${FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.priceUsd}</strong> / {FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.sessionsInPack} Sundays.
                </li>
                <li>Weekday Formula Juniors blocks are still being finalized; weekend enrollment uses the Sunday package.</li>
              </ul>
            )}
            <p className="mt-2 text-[11px] leading-snug text-black/70">
              Session <em>count</em> packages ($150 / $250) on the programs page are for older youth tracks — not the same checkout as Minis.
            </p>
          </div>
        ) : null}

        <label className="mt-4 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 border-black/30 accent-black"
          />
          <span className="text-sm text-black">I confirm my athlete falls in this age band.</span>
        </label>
        <p className="mt-3 text-xs text-black/75">Misrepresentation may void scheduling; staff verify at check-in.</p>
      </ModalBody>
      <ModalFooter className="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>
          Cancel
        </Button>
        {showMinisPricing ? (
          <>
            <Link
              href={isPreschoolBand ? `${MARKETING_HREF.minis}#sunday-weekend` : `${MARKETING_HREF.minis}#weekday-package`}
              className={minisCtaClass}
              onClick={onClose}
            >
              {isPreschoolBand ? 'Sunday weekend · $500' : `Weekday Minis · $${FORMULA_MINIS_SIX_WEEK.priceUsd}`}
            </Link>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              disabled={!confirmed}
              onClick={() => {
                onClose()
                router.push(`${MARKETING_HREF.youthMembership}?from=booking`)
              }}
            >
              Session packages (older youth)
            </Button>
          </>
        ) : (
          <Button
            variant="primary"
            size="sm"
            type="button"
            disabled={!confirmed}
            onClick={() => {
              onClose()
              router.push(`${MARKETING_HREF.youthMembership}?from=booking`)
            }}
          >
            Purchase package to secure blocks
          </Button>
        )}
      </ModalFooter>
    </Modal>
  )
}
