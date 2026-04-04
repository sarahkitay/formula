'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function CheckoutSuccessPortalModal({ nextStep }: { nextStep?: string }) {
  const [open, setOpen] = useState(nextStep === 'portal-assessment')

  if (nextStep !== 'portal-assessment') return null

  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Assessment payment received" size="sm">
      <ModalBody className="space-y-3">
        <p className="text-sm leading-relaxed text-text-secondary">
          Your payment went through. Staff will align your Skills Check on the calendar — watch Schedule for the confirmed slot and any prep notes.
        </p>
        <p className="text-xs text-text-muted">Receipt and updates also go to the email you used at checkout.</p>
      </ModalBody>
      <ModalFooter className="flex-col items-stretch gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="order-2 sm:order-1">
          Close
        </Button>
        <Link
          href="/parent/bookings#upcoming-bookings"
          className={cn(
            'order-1 inline-flex h-7 items-center justify-center rounded-control px-2.5 text-xs font-medium sm:order-2',
            'bg-primary text-primary-foreground shadow-glow-blue hover:brightness-110 hover:shadow-glow-accent-sm'
          )}
        >
          Upcoming appointments
        </Link>
      </ModalFooter>
    </Modal>
  )
}
