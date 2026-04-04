'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import {
  buildAssessmentTimeSlots,
  readAssessmentPortalAccount,
  writeAssessmentPortalAccount,
  type AssessmentPortalAccount,
  type AssessmentTimeSlot,
} from '@/lib/parent/assessment-booking'
import { cn } from '@/lib/utils'

export default function ParentBookAssessmentPage() {
  const [mounted, setMounted] = useState(false)
  const [account, setAccount] = useState<AssessmentPortalAccount | null>(null)
  const [accountModalOpen, setAccountModalOpen] = useState(true)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accountError, setAccountError] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<AssessmentTimeSlot | null>(null)

  const slots = useMemo(() => buildAssessmentTimeSlots(new Date()), [])

  useEffect(() => {
    setMounted(true)
    const existing = readAssessmentPortalAccount()
    if (existing) {
      setAccount(existing)
      setAccountModalOpen(false)
    }
  }, [])

  const handleCreateAccount = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setAccountError(null)
      if (!fullName.trim() || !email.trim()) {
        setAccountError('Enter your name and email to continue.')
        return
      }
      if (password.length < 8) {
        setAccountError('Use at least 8 characters for your password (demo gate).')
        return
      }
      const next = { fullName: fullName.trim(), email: email.trim() }
      writeAssessmentPortalAccount(next)
      setAccount({ ...next, createdAt: new Date().toISOString() })
      setAccountModalOpen(false)
    },
    [email, fullName, password.length]
  )

  const formatSlotWhen = useCallback((iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }, [])

  if (!mounted) {
    return (
      <PageContainer>
        <PageHeader title="Book assessment" subtitle="Loading…" />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Book assessment"
        subtitle="Create a parent portal account, pick an open Skills Check window, then pay securely to hold your slot."
      />

      <Modal
        open={accountModalOpen}
        onClose={() => {}}
        title="Create a portal account"
        size="md"
        closeOnBackdrop={false}
        closeOnEscape={false}
        showCloseButton={false}
      >
        <form onSubmit={handleCreateAccount}>
          <ModalBody className="space-y-4">
            <p className="text-sm leading-relaxed text-text-secondary">
              Create an account in order to view assessment availability and book. You&apos;ll use the same portal for schedule, progress, and billing.
            </p>
            <div className="space-y-1.5">
              <label htmlFor="ba-fullname" className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Parent / guardian name
              </label>
              <input
                id="ba-fullname"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                autoComplete="name"
                className="w-full rounded-control border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-border-bright"
                placeholder="Alex Morgan"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="ba-email" className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Email
              </label>
              <input
                id="ba-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full rounded-control border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-border-bright"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="ba-password" className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Password
              </label>
              <input
                id="ba-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-control border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-border-bright"
                placeholder="At least 8 characters"
              />
              <p className="text-[11px] text-text-muted">
                Demo gate only — replace with your auth provider (e.g. Supabase) in production.
              </p>
            </div>
            {accountError ? <p className="text-sm text-amber-400">{accountError}</p> : null}
          </ModalBody>
          <ModalFooter className="justify-end border-border">
            <Button type="submit" variant="primary">
              Create account & continue
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {account ? (
        <div className="space-y-8">
          <p className="text-sm text-text-secondary">
            Signed in as <span className="font-medium text-text-primary">{account.fullName}</span> ({account.email}).{' '}
            <Link href={MARKETING_HREF.assessment} className="text-primary underline-offset-2 hover:underline">
              What we measure
            </Link>
          </p>

          <section aria-labelledby="assessment-slots-heading">
            <h2 id="assessment-slots-heading" className="text-base font-semibold text-text-primary">
              Open Skills Check windows
            </h2>
            <p className="mt-1 text-sm text-text-muted">Select a time. You&apos;ll confirm with payment on the next step.</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {slots.map(slot => {
                const active = selectedSlot?.id === slot.id
                return (
                  <li key={slot.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={cn(
                        'w-full rounded-xl border p-4 text-left transition-colors',
                        active
                          ? 'border-primary/50 bg-primary/10 ring-1 ring-primary/30'
                          : 'border-border bg-surface hover:border-border-bright'
                      )}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-wide text-text-muted">{slot.label}</p>
                      <p className="mt-2 text-sm font-semibold text-text-primary">{formatSlotWhen(slot.startsAtIso)}</p>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>

          {selectedSlot ? (
            <section
              className="rounded-xl border border-border bg-elevated p-5 shadow-depth-md"
              aria-labelledby="secure-slot-heading"
            >
              <h2 id="secure-slot-heading" className="text-lg font-semibold text-text-primary">
                Secure this slot
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                {selectedSlot.label} · <span className="text-text-primary">{formatSlotWhen(selectedSlot.startsAtIso)}</span>
              </p>
              <p className="mt-3 text-xs text-text-muted">
                Pay the assessment fee to hold this window. Stripe opens in a new step; when payment completes, you&apos;ll get a link to your upcoming
                appointments in Schedule.
              </p>
              <div className="not-prose mt-6">
                <CheckoutLaunchButton
                  checkoutType="assessment"
                  label="Pay now"
                  successNext="portal-assessment"
                  metadata={{
                    assessment_slot_id: selectedSlot.id,
                    assessment_slot_start: selectedSlot.startsAtIso,
                    customer_email_hint: account.email,
                  }}
                />
              </div>
              <Button type="button" variant="ghost" size="sm" className="mt-3" onClick={() => setSelectedSlot(null)}>
                Choose a different time
              </Button>
            </section>
          ) : null}

          <p className="text-xs text-text-muted">
            Full training schedule and session credits live in{' '}
            <Link href="/parent/bookings#upcoming-bookings" className="text-primary underline-offset-2 hover:underline">
              Schedule
            </Link>
            .
          </p>
        </div>
      ) : null}
    </PageContainer>
  )
}
