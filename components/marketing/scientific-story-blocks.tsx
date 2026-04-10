'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

const gridPaper =
  'bg-[linear-gradient(to_right,rgb(255_255_255_/_0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255_/_0.06)_1px,transparent_1px)] bg-[size:20px_20px]'

/** Softer grid for parent journey strip so copy stays primary. */
const gridPaperFaint =
  'bg-[linear-gradient(to_right,rgb(255_255_255_/_0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255_/_0.018)_1px,transparent_1px)] bg-[size:20px_20px]'

export function FeelVsDataStrip({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        'not-prose max-w-[52ch] text-[15px] leading-relaxed text-formula-frost/88 md:text-[16px] md:leading-snug',
        className
      )}
    >
      Most training is based on feel.{' '}
      <span className="font-semibold text-formula-paper">Formula is based on data.</span>
    </p>
  )
}

/** Example pillar-style scores (illustrative, not live athlete data). */
const SAMPLE_METRICS: { tag: string; value: string; micro: string }[] = [
  { tag: 'SPEED', value: '7.4', micro: 'measured' },
  { tag: 'AGILITY', value: '6.9', micro: 'captured' },
  { tag: 'DECISION', value: '5.8', micro: 'logged' },
]

function MetricRow({ tag, value, micro, delay }: { tag: string; value: string; micro: string; delay: number }) {
  const reduce = useReducedMotion()
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-formula-frost/10 py-3 font-mono first:pt-0 last:border-b-0">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt/90">[{tag}]</span>
        <span className="text-[9px] uppercase tracking-[0.18em] text-formula-mist">{micro}</span>
      </div>
      <motion.span
        className="shrink-0 text-xl font-semibold tabular-nums tracking-tight text-formula-paper sm:text-2xl"
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.35, delay: reduce ? 0 : delay }}
      >
        {value}
      </motion.span>
    </div>
  )
}

function BarFill({ targetPct, delay, label }: { targetPct: number; delay: number; label: string }) {
  const reduce = useReducedMotion()
  return (
    <div className="space-y-1">
      <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-formula-mist">
        <span>{label}</span>
        <span className="text-formula-frost/50">tracked</span>
      </div>
      <div className="h-2 overflow-hidden border border-formula-frost/15 bg-formula-deep/80">
        <motion.div
          className="h-full bg-formula-volt/85"
          initial={reduce ? { width: `${targetPct}%` } : { width: 0 }}
          whileInView={{ width: `${targetPct}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

/** Before / after block fill (tactile progress metaphor). */
export function BeforeAfterProgress({ className }: { className?: string }) {
  return (
    <div className={cn('not-prose font-mono text-[10px] uppercase tracking-[0.18em]', className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-sm border border-formula-frost/12 bg-formula-paper/[0.03] p-4">
          <p className="text-formula-mist">Baseline</p>
          <p className="mt-3 text-[11px] leading-none tracking-[0.12em] text-formula-frost/90" aria-hidden>
            ▓▓▓░░░
          </p>
          <p className="mt-2 text-[9px] normal-case tracking-normal text-formula-mist/90">captured</p>
        </div>
        <div className="rounded-sm border border-formula-volt/20 bg-formula-volt/[0.06] p-4">
          <p className="text-formula-frost/90">After training focus</p>
          <p className="mt-3 text-[11px] leading-none tracking-[0.12em] text-formula-paper" aria-hidden>
            ▓▓▓▓▓░
          </p>
          <p className="mt-2 text-[9px] normal-case tracking-normal text-formula-mist">tracked over time</p>
        </div>
      </div>
    </div>
  )
}

export function SampleMetricsPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'not-prose relative overflow-hidden rounded-sm border border-formula-frost/12 bg-formula-deep/40 p-5 shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.04)] md:p-6',
        gridPaper,
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-formula-volt/[0.03] to-transparent" aria-hidden />
      <div className="relative">
        <p className="font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-formula-mist">Sample readout</p>
        <p className="mt-1 text-[11px] text-formula-frost/65">Illustrative: your athlete&apos;s scores are age-weighted.</p>
        <div className="mt-5">
          {SAMPLE_METRICS.map((m, i) => (
            <MetricRow key={m.tag} {...m} delay={0.08 + i * 0.1} />
          ))}
        </div>
        <div className="mt-8 space-y-4 border-t border-formula-frost/10 pt-6">
          <BarFill targetPct={58} delay={0.05} label="Pillar balance" />
          <BarFill targetPct={82} delay={0.2} label="Technical load" />
        </div>
      </div>
    </div>
  )
}

const JOURNEY_STEPS: { step: number; title: string; body: string; axis: string }[] = [
  {
    step: 1,
    title: 'Assessment',
    body: 'Your athlete completes a one-hour skills check across all key areas.',
    axis: 'session · captured',
  },
  {
    step: 2,
    title: 'Scores',
    body: 'We measure performance using real systems like Footbot, Speed Track, and Speed Court.',
    axis: 'systems · measured',
  },
  {
    step: 3,
    title: 'Your dashboard',
    body: 'You see scores, progress, and training focus, all in your parent portal.',
    axis: 'visibility · logged',
  },
]

/** “What you’ll see as a parent”: scannable 3-step strip. */
export function ParentJourneyBlock({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        'not-prose rounded-sm border border-formula-frost/14 bg-formula-paper/[0.03] p-6 md:p-8',
        gridPaperFaint,
        className
      )}
      aria-labelledby="parent-journey-heading"
    >
      <div className="relative">
        <p className="font-mono text-[9px] font-medium uppercase tracking-[0.24em] text-formula-mist">Parent path</p>
        <h2 id="parent-journey-heading" className="mt-2 text-lg font-semibold tracking-tight text-formula-paper md:text-xl">
          What you&apos;ll see as a parent
        </h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3 md:gap-6">
          {JOURNEY_STEPS.map(s => (
            <li
              key={s.step}
              className="border-l-2 border-formula-volt/35 pl-4 md:min-h-[11rem] md:border-formula-frost/15 md:pl-5"
            >
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt/90">
                Step {s.step}: {s.title}
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-formula-mist">{s.axis}</p>
              <p className="mt-4 text-[13px] leading-relaxed text-formula-frost/82">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** Four-line framework: outcome → proof → system → visibility */
export function FormulaStoryFramework({ className }: { className?: string }) {
  const rows: { k: string; v: string }[] = [
    { k: 'OUTCOME', v: 'Know where your athlete stands.' },
    { k: 'PROOF', v: 'Real scores. Measured. Tracked.' },
    { k: 'SYSTEM', v: 'Six pillars. Standardized tests.' },
    { k: 'VISIBILITY', v: 'You see everything. Progress over time.' },
  ]
  return (
    <div className={cn('not-prose space-y-0 rounded-sm border border-formula-frost/12 font-mono text-[11px] md:text-xs', className)}>
      {rows.map((r, i) => (
        <div
          key={r.k}
          className={cn(
            'flex flex-col gap-1 border-formula-frost/10 px-4 py-3.5 sm:flex-row sm:items-baseline sm:gap-6 sm:py-3',
            i > 0 && 'border-t'
          )}
        >
          <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.2em] text-formula-volt/90">{r.k}</span>
          <span className="text-formula-frost/88 sm:min-w-0 sm:flex-1">{r.v}</span>
        </div>
      ))}
    </div>
  )
}
