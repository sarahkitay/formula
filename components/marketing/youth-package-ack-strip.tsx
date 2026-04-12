'use client'

import { useState } from 'react'
import { writeHasYouthTrainingPackage } from '@/lib/booking/package-gate'

/** Sets a browser flag so the unified booking hub treats the visitor as packaged (until billing syncs). */
export function YouthPackageAckStrip() {
  const [done, setDone] = useState(false)

  return (
    <div className="not-prose my-8 rounded-sm border border-formula-volt/28 bg-formula-volt/[0.06] p-4 md:p-5">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Booking hub</p>
      <p className="mt-2 max-w-2xl text-sm text-formula-frost/85">
        After you purchase a session package, confirm here on this device so the schedule hub sends you straight to the parent portal for youth blocks
        instead of the package gate.
      </p>
      <button
        type="button"
        disabled={done}
        onClick={() => {
          writeHasYouthTrainingPackage(true)
          setDone(true)
        }}
        className="mt-4 inline-flex h-10 items-center border border-formula-volt/50 bg-formula-volt/90 px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-black disabled:cursor-default disabled:opacity-60"
      >
        {done ? 'Saved on this browser' : 'I purchased a package — unlock calendar booking'}
      </button>
    </div>
  )
}
