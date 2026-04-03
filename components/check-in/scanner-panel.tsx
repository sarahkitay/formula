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
    <div className="animate-scanner-pulse border border-black/10 bg-white p-5 shadow-lab">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-black/10 bg-[#f9f9f9] text-[#005700]">
          <Wifi className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Wristband // scanner buffer
          </p>
          <p className="mt-1 text-xs text-zinc-500">{SITE.checkInNote}</p>
          <p className="mt-3 break-all font-mono text-[11px] font-bold text-[#005700]">
            {display || 'N/A'}
          </p>
        </div>
        <span className="shrink-0 border border-[#f4fe00] bg-[#f4fe00] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black">
          standby
        </span>
      </div>
    </div>
  )
}
