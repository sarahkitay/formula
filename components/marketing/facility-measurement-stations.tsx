import { cn } from '@/lib/utils'

const STATIONS: { tool: string; measures: string }[] = [
  { tool: 'Speed Track', measures: 'Acceleration & repeat sprint performance' },
  { tool: 'Footbot', measures: 'Technical reps & ball-control load' },
  { tool: 'Double Speed Court', measures: 'Reaction, scanning & decisions under pressure' },
]

/**
 * Reinforces “every station measures something” on the facility page.
 */
export function FacilityMeasurementStations({ className }: { className?: string }) {
  return (
    <div className={cn('not-prose mt-8 md:mt-10', className)}>
      <p className="font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-formula-mist">Measurement map</p>
      <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-formula-frost/85">
        Every station measures something. Nothing is decoration.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-1 md:grid-cols-3">
        {STATIONS.map(s => (
          <li
            key={s.tool}
            className="border border-formula-frost/12 bg-formula-paper/[0.03] px-4 py-4 font-mono text-[11px] shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-volt/90">[{s.tool}]</p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-formula-mist">measures</p>
            <p className="mt-1.5 text-[13px] font-normal leading-snug tracking-normal text-formula-frost/88">{s.measures}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
