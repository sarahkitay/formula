'use client'

import { useActionState, useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useRouter } from 'next/navigation'
import { submitFieldRentalAgreement } from '@/app/(site)/rentals/actions'
import { FieldRentalWaiverLegalDocument } from '@/components/marketing/field-rental-waiver-legal-document'
import { FIELD_RENTAL_WAIVER_ACK_CHECKBOXES } from '@/lib/rentals/field-rental-waiver-legal-copy'
import { cn } from '@/lib/utils'

const ACK_FIELD_NAMES = ['agreementAccepted', 'riskAccepted', 'rulesAccepted'] as const

const INITIAL_STATE = { ok: false, message: '' }

const fieldClass =
  'min-h-12 rounded-none border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none transition-colors focus:border-formula-volt/45'
const labelClass = 'font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-mist'

const accordionClass =
  'rounded-none border border-formula-frost/14 bg-formula-paper/[0.02] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]'
const accordionSummaryClass =
  'cursor-pointer list-none px-5 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-formula-paper marker:content-none [&::-webkit-details-marker]:hidden'

function pointerToCanvasCoords(
  canvas: HTMLCanvasElement,
  event: ReactPointerEvent<HTMLCanvasElement>
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  }
}

export type FieldRentalRosterInvite = {
  token: string
  expected: number
  completed: number
}

type FormProps = {
  rosterInvite?: FieldRentalRosterInvite
  /**
   * `public` (default): participant / roster shared links - no rental type or headcount fields.
   * `coach`: staff booking waiver - rental type + participant count required (see `/coach/field-rental-waiver`).
   */
  variant?: 'public' | 'coach'
}

export function FieldRentalAgreementForm({ rosterInvite, variant = 'public' }: FormProps) {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureDataUrl, setSignatureDataUrl] = useState('')
  const [isMinor, setIsMinor] = useState(false)
  const [state, action, pending] = useActionState(submitFieldRentalAgreement, INITIAL_STATE)

  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])

  useEffect(() => {
    if (state.ok) router.refresh()
  }, [state.ok, router])

  const showCoachBookingFields = variant === 'coach' && !rosterInvite

  const drawPoint = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = pointerToCanvasCoords(canvas, event)

    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#DCFF00'
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const startDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.setPointerCapture(event.pointerId)
    setIsDrawing(true)
    drawPoint(event)
  }

  const continueDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    drawPoint(event)
  }

  const finishDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.releasePointerCapture(event.pointerId)
    setIsDrawing(false)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    setSignatureDataUrl(canvas.toDataURL('image/png'))
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSignatureDataUrl('')
  }

  return (
    <section
      id="participant-waiver"
      className="not-prose scroll-mt-28 rounded-none border border-formula-frost/12 bg-formula-base/[0.38] px-4 py-8 sm:px-6 md:px-8 md:py-10"
    >
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-volt/90">Field rental agreement</p>
      <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-formula-frost/82">
        Expand each section, complete the fields, then submit. Required items are marked with an asterisk.
      </p>

      <details className={cn(accordionClass, 'mt-8')} open>
        <summary className={accordionSummaryClass}>Facility agreement & waiver language</summary>
        <div className="border-t border-formula-frost/10 px-5 py-6 md:px-6">
          <FieldRentalWaiverLegalDocument introVariant={rosterInvite ? 'roster' : 'standard'} />
        </div>
      </details>

      <form action={action} className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6">
        <input type="hidden" name="signatureDataUrl" value={signatureDataUrl} />
        {rosterInvite ? <input type="hidden" name="waiverInviteToken" value={rosterInvite.token} /> : null}
        {showCoachBookingFields ? <input type="hidden" name="waiverFormRole" value="coach" /> : null}

        {showCoachBookingFields ? (
          <details className={cn(accordionClass, 'md:col-span-2')} open>
            <summary className={accordionSummaryClass}>Staff booking context</summary>
            <div className="grid gap-4 border-t border-formula-frost/10 px-5 py-5 md:grid-cols-2 md:px-6">
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Rental type (booking) *</span>
                <select
                  name="rentalType"
                  required
                  className={fieldClass}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select rental type
                  </option>
                  <option value="club_team_practice">Club / Team Practice</option>
                  <option value="private_semi_private">Private / Semi-Private Training</option>
                  <option value="general_pickup">General Use / Pick-Up Play</option>
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Participant count (booking) *</span>
                <input
                  name="participantCount"
                  required
                  type="number"
                  min={1}
                  max={500}
                  className={fieldClass}
                  placeholder="e.g. 12"
                />
              </label>
            </div>
          </details>
        ) : null}

        <details className={cn(accordionClass, 'md:col-span-2')} open>
          <summary className={accordionSummaryClass}>Participant details</summary>
          <div className="grid gap-4 border-t border-formula-frost/10 px-5 py-5 md:grid-cols-2 md:gap-5 md:px-6">
            <label className="flex flex-col gap-2">
              <span className={labelClass}>Participant name *</span>
              <input name="participantName" required className={fieldClass} />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>Email *</span>
              <input name="participantEmail" required type="email" className={fieldClass} />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>Phone *</span>
              <input name="participantPhone" required type="tel" autoComplete="tel" className={fieldClass} />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>Date of birth *</span>
              <input name="participantDob" type="date" required max={today} className={fieldClass} />
            </label>

            <label className="flex flex-col gap-2 md:col-span-2">
              <span className={labelClass}>Address *</span>
              <textarea
                name="participantAddress"
                required
                rows={2}
                autoComplete="street-address"
                className={cn(fieldClass, 'min-h-[5.5rem] py-2')}
                placeholder="Street, city, state, ZIP"
              />
            </label>
          </div>
        </details>

        <details className={cn(accordionClass, 'md:col-span-2')} open>
          <summary className={accordionSummaryClass}>Guardian, emergency contact & organization</summary>
          <div className="grid gap-4 border-t border-formula-frost/10 px-5 py-5 md:gap-5 md:px-6">
            <label className="flex flex-col gap-2 md:col-span-2">
              <span className={labelClass}>Emergency contact: name & phone *</span>
              <textarea
                name="emergencyContact"
                required
                rows={2}
                className={cn(fieldClass, 'min-h-[5.5rem] py-2')}
                placeholder="e.g. Jane Doe · 818-555-0100"
              />
            </label>

            <label className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                checked={isMinor}
                onChange={e => setIsMinor(e.target.checked)}
                className="h-4 w-4 accent-formula-volt"
              />
              <span className="text-[14px] text-formula-frost/85">Participant is under 18 years old</span>
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>Parent / guardian name {isMinor ? '*' : '(if minor)'}</span>
              <input name="parentGuardianName" required={isMinor} className={fieldClass} />
            </label>

            <label className="flex flex-col gap-2 md:col-span-2">
              <span className={labelClass}>Team / organization *</span>
              <input name="organizationName" required className={fieldClass} placeholder="Club or team name" />
            </label>

            <label className="flex flex-col gap-2 md:col-span-2">
              <span className={labelClass}>Notes</span>
              <textarea name="notes" rows={3} className={cn(fieldClass, 'min-h-[6.5rem] py-2')} placeholder="Optional booking notes" />
            </label>
          </div>
        </details>

        <details className={cn(accordionClass, 'md:col-span-2')} open>
          <summary className={accordionSummaryClass}>Signature & confirmations</summary>
          <div className="space-y-5 border-t border-formula-frost/10 px-5 py-5 md:px-6">
            <div className="space-y-2">
              <span className={labelClass}>Digital signature *</span>
              <div className="rounded-none border border-formula-frost/16 bg-black/30 p-2">
                <canvas
                  ref={canvasRef}
                  width={920}
                  height={180}
                  className="h-[130px] w-full touch-none bg-[#0b0d10]"
                  onPointerDown={startDrawing}
                  onPointerMove={continueDrawing}
                  onPointerUp={finishDrawing}
                  onPointerLeave={finishDrawing}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={clearSignature}
                  className="inline-flex h-10 items-center border border-formula-frost/18 px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-mist transition-colors hover:border-formula-frost/28"
                >
                  Clear signature
                </button>
                <p className="text-[13px] text-formula-mist">Sign with mouse, trackpad, or touch.</p>
              </div>
            </div>

            <label className="flex max-w-xl flex-col gap-2">
              <span className={labelClass}>Printed name for signature *</span>
              <input name="signatureName" required className={fieldClass} />
            </label>

            <div className="space-y-3 pt-1">
              {FIELD_RENTAL_WAIVER_ACK_CHECKBOXES.map((label, i) => (
                <label key={ACK_FIELD_NAMES[i]} className="flex items-start gap-3">
                  <input type="checkbox" name={ACK_FIELD_NAMES[i]} required className="mt-1 h-4 w-4 accent-formula-volt" />
                  <span className="text-[14px] leading-relaxed text-formula-frost/85">{label}</span>
                </label>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={pending || !signatureDataUrl}
                className="inline-flex min-h-12 items-center border border-black/25 bg-formula-volt px-8 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-black transition-[filter] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? 'Submitting…' : 'Submit Field Rental Request'}
              </button>
              {state.message ? (
                <p className={`mt-4 text-[14px] ${state.ok ? 'text-formula-volt' : 'text-red-300'}`} role="status">
                  {state.message}
                </p>
              ) : null}
            </div>
          </div>
        </details>
      </form>
    </section>
  )
}
