'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { MARKETING_HREF } from '@/lib/marketing/nav'

type Props = {
  open: boolean
  onClose: () => void
  bandLabel: string
  /** e.g. U10 / U12 — copy only */
  rosterAgeHint: string
}

export function PackageGateModal({ open, onClose, bandLabel, rosterAgeHint }: Props) {
  const [confirmed, setConfirmed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (open) setConfirmed(false)
  }, [open])

  return (
    <Modal open={open} onClose={onClose} title="Training block" size="sm">
      <ModalBody>
        <p className="text-sm text-formula-frost/85">
          Published youth blocks on the calendar are <strong className="text-formula-paper">band {bandLabel}</strong> ({rosterAgeHint}). Spots are held for
          families with an active training package.
        </p>
        <label className="mt-4 flex items-start gap-3">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 h-4 w-4 accent-formula-volt"
          />
          <span className="text-sm text-formula-paper">I confirm my athlete falls in this age band.</span>
        </label>
        <p className="mt-3 text-xs text-formula-mist">Misrepresentation may void scheduling; staff verify at check-in.</p>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>
          Cancel
        </Button>
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
      </ModalFooter>
    </Modal>
  )
}
