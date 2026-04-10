'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function CheckoutSuccessPortalModal({ nextStep, sessionId }: { nextStep?: string; sessionId?: string }) {
  const [open, setOpen] = useState(nextStep === 'portal-assessment')

  if (nextStep !== 'portal-assessment') return null

  const portalSignupHref =
    sessionId && sessionId.length > 0
      ? `/portal-signup?session_id=${encodeURIComponent(sessionId)}`
      : '/portal-signup'

  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Assessment payment received" size="sm">
      <ModalBody className="space-y-3">
        <p className="text-sm leading-relaxed text-text-secondary">
          Your payment went through. Staff will align your Skills Check on the calendar; watch Schedule for the confirmed slot and any prep notes.
        </p>
        <p className="text-xs text-text-muted">Receipt and updates also go to the email you used at checkout.</p>
        <p className="text-sm leading-relaxed text-text-secondary">
          Optional: create your parent portal now—add each athlete&apos;s name so they show up under your account.
        </p>
      </ModalBody>
      <ModalFooter className="flex-col items-stretch gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="order-3 sm:order-1">
          Close
        </Button>
        <Link
          href={portalSignupHref}
          className={cn(
            'order-1 inline-flex h-7 items-center justify-center rounded-control px-2.5 text-xs font-medium sm:order-2',
            'border border-formula-frost/20 bg-formula-paper/[0.06] text-formula-paper hover:border-formula-volt/35'
          )}
        >
          Create parent portal
        </Link>
        <Link
          href="/parent/bookings#upcoming-bookings"
          className={cn(
            'order-2 inline-flex h-7 items-center justify-center rounded-control px-2.5 text-xs font-medium sm:order-3',
            'bg-primary text-primary-foreground shadow-glow-blue hover:brightness-110 hover:shadow-glow-accent-sm'
          )}
        >
          Upcoming appointments
        </Link>
      </ModalFooter>
    </Modal>
  )
}
