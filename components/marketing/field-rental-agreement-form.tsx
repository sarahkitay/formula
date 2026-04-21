'use client'

import { useActionState, useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useRouter } from 'next/navigation'
import { submitFieldRentalAgreement } from '@/app/(site)/rentals/actions'

const INITIAL_STATE = { ok: false, message: '' }

/** Map pointer position to canvas bitmap pixels (fixes CSS-sized canvas vs width/height attributes). */
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
   * `public` (default): participant / roster shared links — no rental type or headcount fields.
   * `coach`: staff booking waiver — rental type + participant count required (see `/coach/field-rental-waiver`).
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
      className="not-prose my-14 scroll-mt-28 border border-formula-frost/12 bg-formula-base/70 p-6 md:p-9"
    >
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Field rental agreement</p>
      <h3 className="mt-4 font-mono text-xl font-semibold tracking-tight text-formula-paper md:text-2xl">
        Field Rental Agreement and Facility Use Waiver
      </h3>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-formula-mist">
        {rosterInvite ? (
          <>
            You are signing for <strong className="text-formula-paper">one participant</strong> on this roster link. Each person should submit their own
            waiver using the same link until the booking is complete. Minors: a parent or legal guardian completes the waiver.
          </>
        ) : (
          <>
            Required per participant: name, email, date of birth, and signed waiver before field access. Minors: parent or legal guardian completes the
            waiver. Submitting sends a copy to our team and saves the waiver for staff review. Use the field rental checkout when you are also placing a paid
            hold.
          </>
        )}
      </p>

      <div className="mt-8 space-y-4 border border-formula-frost/10 bg-formula-paper/[0.02] p-4 text-sm leading-relaxed text-formula-mist md:p-5">
        <p>
          <strong className="text-formula-paper">1) Rental type and classification:</strong> Facility may reclassify incorrect booking type and adjust pricing or
          terminate without refund.
        </p>
        <p>
          <strong className="text-formula-paper">2) Capacity limits:</strong> Club/Team Practice max 20 per field. Private/Semi-Private max 4; 5+ reclassified.
          General Use/Pick-Up max 15 and no commercial/team instruction.
        </p>
        <p>
          <strong className="text-formula-paper">3-5) Registration, minors, and field rules:</strong> all participants need signed waiver; parent/guardian signs for
          minors. No cleats. Water only on field. No food/gum/other drinks on turf. Follow staff instructions.
        </p>
        <p>
          <strong className="text-formula-paper">6-11) Time, cancellation, liability, insurance, indemnification:</strong> overstay billed in 30-minute increments;
          48-hour cancellation policy; renter responsible for damage; COI may be required; renter assumes risk and certifies all participants signed.
        </p>
      </div>

      <form action={action} className="mt-8 grid gap-5 md:grid-cols-2">
        <input type="hidden" name="signatureDataUrl" value={signatureDataUrl} />
        {rosterInvite ? <input type="hidden" name="waiverInviteToken" value={rosterInvite.token} /> : null}
        {showCoachBookingFields ? <input type="hidden" name="waiverFormRole" value="coach" /> : null}

        {showCoachBookingFields ? (
          <>
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Rental type (booking) *</span>
              <select
                name="rentalType"
                required
                className="h-11 border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
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
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Participant count (booking) *</span>
              <input
                name="participantCount"
                required
                type="number"
                min={1}
                max={500}
                className="h-11 border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
                placeholder="e.g. 12"
              />
            </label>
          </>
        ) : null}

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Participant name *</span>
          <input
            name="participantName"
            required
            className="h-11 border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Email *</span>
          <input
            name="participantEmail"
            required
            type="email"
            className="h-11 border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Phone</span>
          <input
            name="participantPhone"
            className="h-11 border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Date of birth *</span>
          <input
            name="participantDob"
            type="date"
            required
            max={today}
            className="h-11 border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
          />
        </label>

        <label className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={isMinor}
            onChange={e => setIsMinor(e.target.checked)}
            className="h-4 w-4 accent-formula-volt"
          />
          <span className="text-sm text-formula-mist">Participant is under 18 years old</span>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">
            Parent/guardian name {isMinor ? '*' : '(if minor)'}
          </span>
          <input
            name="parentGuardianName"
            required={isMinor}
            className="h-11 border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Team / organization</span>
          <input
            name="organizationName"
            className="h-11 border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
          />
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Notes</span>
          <textarea
            name="notes"
            rows={3}
            className="border border-formula-frost/16 bg-formula-paper/[0.03] px-3 py-2 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
            placeholder="Optional booking notes"
          />
        </label>

        <div className="space-y-2 md:col-span-2">
          <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Digital signature *</span>
          <div className="border border-formula-frost/16 bg-black/30 p-2">
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
              className="inline-flex h-9 items-center border border-formula-frost/18 px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist hover:border-formula-frost/30"
            >
              Clear signature
            </button>
            <p className="text-xs text-formula-mist">Sign using mouse, trackpad, or touch.</p>
          </div>
        </div>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Printed name for signature *</span>
          <input
            name="signatureName"
            required
            className="h-11 border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
          />
        </label>

        <label className="flex items-start gap-3 md:col-span-2">
          <input type="checkbox" name="agreementAccepted" required className="mt-1 h-4 w-4 accent-formula-volt" />
          <span className="text-sm text-formula-mist">I agree to all terms in the Field Rental Agreement and Facility Use Waiver.</span>
        </label>
        <label className="flex items-start gap-3 md:col-span-2">
          <input type="checkbox" name="riskAccepted" required className="mt-1 h-4 w-4 accent-formula-volt" />
          <span className="text-sm text-formula-mist">I assume all participation risks and agree to indemnify and hold harmless Formula Soccer Center.</span>
        </label>
        <label className="flex items-start gap-3 md:col-span-2">
          <input type="checkbox" name="rulesAccepted" required className="mt-1 h-4 w-4 accent-formula-volt" />
          <span className="text-sm text-formula-mist">I understand and will comply with facility rules, time limits, and cancellation policy.</span>
        </label>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={pending || !signatureDataUrl}
            className="inline-flex h-11 items-center border border-black/20 bg-formula-volt px-7 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-black transition-[filter] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? 'Submitting...' : 'Submit signed agreement'}
          </button>
          {state.message ? (
            <p className={`mt-3 text-sm ${state.ok ? 'text-formula-volt' : 'text-red-300'}`} role="status">
              {state.message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  )
}
