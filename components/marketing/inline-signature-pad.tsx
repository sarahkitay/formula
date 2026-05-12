'use client'

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { cn } from '@/lib/utils'

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

export type InlineSignaturePadProps = {
  onChange: (dataUrl: string) => void
  className?: string
}

/** Minimal canvas signature capture (same behavior as field rental agreement form). */
export function InlineSignaturePad({ onChange, className }: InlineSignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

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
    onChange(canvas.toDataURL('image/png'))
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    onChange('')
  }

  return (
    <div className={cn('space-y-2', className)}>
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
  )
}
