'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const parentLoginHref = `/login?role=parent&next=${encodeURIComponent('/parent/dashboard')}`

export function CheckoutSuccessPortalModal({ nextStep, sessionId }: { nextStep?: string; sessionId?: string }) {
  const [open, setOpen] = useState(nextStep === 'portal-assessment')

  if (nextStep !== 'portal-assessment') return null

  const portalSignupHref =
    sessionId && sessionId.length > 0
      ? `/portal-signup?session_id=${encodeURIComponent(sessionId)}`
      : '/portal-signup'

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="Payment received"
      size="sm"
      className={cn(
        'border border-black/15 bg-white text-black shadow-xl',
        '[&>div:first-child]:border-black/10 [&_h2]:text-black',
        '[&>div:first-child>button]:text-black [&>div:first-child>button:hover]:bg-black/10 [&>div:first-child>button:hover]:text-black'
      )}
    >
      <ModalBody className="space-y-3 text-black">
        <p className="text-sm leading-relaxed text-black">
          Your Skills Check payment is in. Staff will confirm your window; you&apos;ll see updates in the parent portal once your account is set up.
        </p>
        <p className="text-sm font-medium text-black">
          Create your parent portal to view future sessions and athlete details, or sign in if you already have an account.
        </p>
        <p className="text-xs text-black">
          Use the same email as checkout. You&apos;ll add each athlete&apos;s name so they show at the top of your portal.
        </p>
      </ModalBody>
      <ModalFooter className="flex-col items-stretch gap-2 border-black/10 sm:flex-row sm:flex-wrap sm:justify-end">
        <Link
          href={portalSignupHref}
          className={cn(
            'order-1 inline-flex h-10 items-center justify-center rounded-control px-4 text-xs font-semibold sm:order-1',
            'border border-black/25 bg-formula-volt text-black hover:brightness-105'
          )}
        >
          Create parent portal
        </Link>
        <Link
          href={parentLoginHref}
          className={cn(
            'order-2 inline-flex h-10 items-center justify-center rounded-control border border-black/25 bg-white px-4 text-xs font-medium text-black hover:bg-black/[0.06]'
          )}
        >
          Sign in
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(false)}
          className="order-3 !text-black hover:bg-black/10 hover:!text-black sm:order-3"
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}
