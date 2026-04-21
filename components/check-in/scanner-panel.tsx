'use client'

import * as React from 'react'
import { Wifi } from 'lucide-react'
import { SITE } from '@/lib/site-config'

/**
 * Global key buffer for future wristband / HID wedge hardware.
 * Ignores keystrokes while focus is in text inputs.
 */
export function ScannerPanel() {
  const buf = React.useRef('')
  const [display, setDisplay] = React.useState('')

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'Enter') {
        if (buf.current) setDisplay(buf.current)
        buf.current = ''
        return
      }
      if (e.key === 'Backspace') {
        buf.current = buf.current.slice(0, -1)
        return
      }
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        buf.current = (buf.current + e.key).slice(-48)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="border border-formula-frost/12 bg-formula-paper/[0.04] p-5 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_.04)]">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-formula-frost/14 bg-formula-deep/50 text-success">
          <Wifi className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
            Wristband // scanner buffer
          </p>
          <p className="mt-1 text-xs text-formula-frost/80">{SITE.checkInNote}</p>
          <p className="mt-3 break-all font-mono text-[11px] font-bold text-formula-volt">{display || 'N/A'}</p>
        </div>
        <span className="shrink-0 border border-formula-volt/45 bg-formula-volt/90 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-formula-base">
          standby
        </span>
      </div>
    </div>
  )
}
