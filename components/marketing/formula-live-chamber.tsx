'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import './formula-live-chamber.css'

const PILLARS: {
  id: string
  label: string
  motif: 'velocity' | 'agility' | 'decision' | 'technical' | 'game' | 'consistency'
  weightLetter: string
  mathLetter: string
  settleWeight: string
}[] = [
  { id: 'speed', label: 'Speed', motif: 'velocity', weightLetter: 's', mathLetter: 'S', settleWeight: '0.17' },
  { id: 'agility', label: 'Agility', motif: 'agility', weightLetter: 'a', mathLetter: 'A', settleWeight: '0.14' },
  { id: 'decision', label: 'Decision-making', motif: 'decision', weightLetter: 'd', mathLetter: 'D', settleWeight: '0.19' },
  { id: 'technical', label: 'Technical execution', motif: 'technical', weightLetter: 't', mathLetter: 'T', settleWeight: '0.18' },
  { id: 'game', label: 'Game application', motif: 'game', weightLetter: 'g', mathLetter: 'G', settleWeight: '0.16' },
  { id: 'consistency', label: 'Consistency', motif: 'consistency', weightLetter: 'k', mathLetter: 'K', settleWeight: '0.16' },
]

function Motif({ kind, active }: { kind: (typeof PILLARS)[number]['motif']; active: boolean }) {
  const o = active ? 1 : 0.2
  const stroke = 'currentColor'
  const classFor = {
    velocity: 'flc-motif-velocity text-formula-volt',
    agility: 'flc-motif-agility text-formula-volt/90',
    decision: 'flc-motif-decision text-formula-volt/85',
    technical: 'flc-motif-technical text-formula-frost/70',
    game: 'flc-motif-game text-formula-volt/80',
    consistency: 'flc-motif-consistency text-formula-frost/60',
  }[kind]

  return (
    <div className={cn('h-8 w-10 shrink-0', classFor)} style={{ opacity: o }} aria-hidden>
      {kind === 'velocity' && (
        <svg viewBox="0 0 40 32" className="h-full w-full" fill="none">
          <line x1="4" y1="16" x2="32" y2="16" stroke={stroke} strokeWidth="1" opacity="0.35" />
          <circle className="flc-dot" cx="8" cy="16" r="2.5" fill="currentColor" />
        </svg>
      )}
      {kind === 'agility' && (
        <svg viewBox="0 0 40 32" className="h-full w-full" fill="none">
          <path d="M8 22 L16 10 L24 18" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 18 L30 12" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
        </svg>
      )}
      {kind === 'decision' && (
        <svg viewBox="0 0 40 32" className="h-full w-full" fill="none">
          <circle cx="10" cy="12" r="3" stroke={stroke} strokeWidth="1" />
          <circle cx="22" cy="20" r="3" stroke={stroke} strokeWidth="1" />
          <circle cx="28" cy="10" r="3" stroke={stroke} strokeWidth="1" />
          <path d="M13 13 L20 18" stroke={stroke} strokeWidth="0.8" opacity="0.4" />
        </svg>
      )}
      {kind === 'technical' && (
        <svg viewBox="0 0 40 32" className="h-full w-full" fill="none">
          <line x1="12" y1="8" x2="12" y2="24" stroke={stroke} strokeWidth="1" />
          <line x1="20" y1="10" x2="20" y2="24" stroke={stroke} strokeWidth="1" />
          <line x1="28" y1="12" x2="28" y2="24" stroke={stroke} strokeWidth="1" />
        </svg>
      )}
      {kind === 'game' && (
        <svg viewBox="0 0 40 32" className="h-full w-full" fill="none">
          <path d="M6 22 Q20 6 34 20" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" fill="none" />
        </svg>
      )}
      {kind === 'consistency' && (
        <svg viewBox="0 0 40 32" className="h-full w-full" fill="none">
          <path
            d="M4 18 Q10 12 16 18 T28 18 T36 16"
            stroke={stroke}
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  )
}

function PillarRow({
  pillar,
  index,
  visible,
  streamsLive,
  flicker,
}: {
  pillar: (typeof PILLARS)[number]
  index: number
  visible: boolean
  streamsLive: boolean
  flicker: boolean
}) {
  const display = flicker && streamsLive ? `${(0.1 + (index * 0.03) % 0.09).toFixed(2)}` : pillar.settleWeight

  return (
    <motion.div
      className="flex items-center gap-3 border-b border-formula-frost/[0.06] pb-3 last:border-b-0 lg:border-b-0 lg:pb-0"
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 6,
      }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <Motif kind={pillar.motif} active={visible} />
      <div className="min-w-0 flex-1">
        <span className="font-mono text-[13px] font-medium tracking-tight text-formula-volt md:text-sm">{pillar.label}</span>
        {streamsLive ? (
          <motion.span
            className="ml-2 inline-block font-mono text-[10px] tabular-nums tracking-tight text-formula-frost/65"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            w<sub className="text-formula-mist">{pillar.weightLetter}</sub>≈{display}
          </motion.span>
        ) : null}
      </div>
      <motion.div
        className="hidden h-px max-w-[3.5rem] flex-1 origin-left bg-gradient-to-r from-formula-volt/35 to-transparent lg:block"
        initial={false}
        animate={{ scaleX: streamsLive && visible ? 1 : 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  )
}

/**
 * Full-bleed emotional centerpiece for /fpi: weighted model as a calm, awakening instrument — not a slogan.
 */
export function FormulaLiveChamber() {
  const reduce = useReducedMotion() === true
  const [gridOn, setGridOn] = useState(reduce ?? false)
  const [perimeterOn, setPerimeterOn] = useState(reduce ?? false)
  const [pillarCount, setPillarCount] = useState(reduce ? 6 : 0)
  const [streamsLive, setStreamsLive] = useState(reduce ?? false)
  const [compositeLive, setCompositeLive] = useState(reduce ?? false)
  const [perfVisible, setPerfVisible] = useState(reduce ?? false)
  const [showMath, setShowMath] = useState(false)
  const [philosophyOn, setPhilosophyOn] = useState(reduce ?? false)
  const [settled, setSettled] = useState(reduce ?? false)
  const [flicker, setFlicker] = useState(false)

  useEffect(() => {
    if (reduce) {
      setGridOn(true)
      setPerimeterOn(true)
      setPillarCount(6)
      setStreamsLive(true)
      setCompositeLive(true)
      setPerfVisible(true)
      setShowMath(false)
      setPhilosophyOn(true)
      setSettled(true)
      return
    }

    const ids: ReturnType<typeof setTimeout>[] = []
    const q = (fn: () => void, ms: number) => {
      ids.push(setTimeout(fn, ms))
    }

    q(() => setGridOn(true), 200)
    q(() => setPerimeterOn(true), 1000)
    for (let i = 1; i <= 6; i++) {
      q(() => setPillarCount(i), 1750 + i * 420)
    }
    q(() => setStreamsLive(true), 1750 + 6 * 420 + 550)
    q(() => setFlicker(true), 1750 + 6 * 420 + 700)
    q(() => setFlicker(false), 1750 + 6 * 420 + 1600)
    q(() => setCompositeLive(true), 1750 + 6 * 420 + 900)
    q(() => setPerfVisible(true), 1750 + 6 * 420 + 2400)
    q(() => setShowMath(true), 1750 + 6 * 420 + 2800)
    q(() => setShowMath(false), 1750 + 6 * 420 + 4800)
    q(() => setPhilosophyOn(true), 1750 + 6 * 420 + 5200)
    q(() => setSettled(true), 1750 + 6 * 420 + 5800)

    return () => {
      ids.forEach(clearTimeout)
    }
  }, [reduce])

  const perimeterClass = 'font-mono text-[9px] uppercase tracking-[0.28em] text-formula-frost/35 transition-opacity duration-[1.4s]'

  return (
    <section
      className={cn(
        'formula-live-chamber not-prose relative my-12 overflow-hidden border border-formula-frost/12 bg-formula-deep/40 px-5 py-10 md:px-10 md:py-14',
        settled && 'formula-live-chamber--settled'
      )}
      aria-labelledby="formula-live-chamber-heading"
    >
      <div className={cn('formula-live-chamber__grid', gridOn && 'is-on')} aria-hidden />
      <div className={cn('formula-live-chamber__grain', settled && 'is-settled')} aria-hidden />

      {/* Perimeter system marks */}
      <div
        className={cn('pointer-events-none absolute left-4 top-3 transition-opacity duration-1000 md:left-6', perimeterOn ? 'opacity-100' : 'opacity-0')}
        aria-hidden
      >
        <span className={perimeterClass}>Input</span>
      </div>
      <div
        className={cn(
          'pointer-events-none absolute right-4 top-3 transition-opacity duration-1000 md:right-6',
          perimeterOn ? 'opacity-100' : 'opacity-0'
        )}
        aria-hidden
      >
        <span className={perimeterClass}>Signal</span>
      </div>
      <div
        className={cn(
          'pointer-events-none absolute bottom-3 left-4 transition-opacity duration-1000 md:left-6',
          perimeterOn ? 'opacity-100' : 'opacity-0'
        )}
        aria-hidden
      >
        <span className={perimeterClass}>Weighting</span>
      </div>
      <div
        className={cn(
          'pointer-events-none absolute bottom-3 right-4 transition-opacity duration-1000 md:right-6',
          perimeterOn ? 'opacity-100' : 'opacity-0'
        )}
        aria-hidden
      >
        <span className={perimeterClass}>Evaluation</span>
      </div>
      <div
        className={cn(
          'pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 transition-opacity duration-1000',
          perimeterOn ? 'opacity-100' : 'opacity-0'
        )}
        aria-hidden
      >
        <span className={perimeterClass}>Composite</span>
      </div>

      <div className="relative z-10">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-formula-mist">Living model</p>
        <h2
          id="formula-live-chamber-heading"
          className="mt-3 max-w-[22ch] font-mono text-lg font-semibold leading-snug tracking-tight text-formula-paper md:text-xl"
        >
          The Formula is not a slogan. It is revealed as a living weighted system.
        </h2>
        <p className="sr-only">
          Six domains combine with age-specific weights into an internal composite for coaching and placement. Animation illustrates the model; figures are
          representative.
        </p>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-6">
          <div className="flex flex-1 flex-col gap-4 lg:gap-5">
            {PILLARS.slice(0, 3).map((p, i) => (
              <PillarRow key={p.id} pillar={p} index={i} visible={pillarCount > i} streamsLive={streamsLive} flicker={flicker} />
            ))}
          </div>

          <div className="flex shrink-0 flex-col justify-center lg:w-[min(280px,28vw)]">
            <div className="relative rounded-sm border border-formula-frost/[0.08] bg-formula-base/30 px-4 py-5">
              <svg className="pointer-events-none absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] opacity-[0.12]" aria-hidden>
                <line x1="50%" y1="8" x2="50%" y2="92%" stroke="currentColor" className="text-formula-frost" strokeWidth="0.5" strokeDasharray="2 3" />
                <line x1="8" y1="50%" x2="calc(100% - 8px)" y2="50%" stroke="currentColor" className="text-formula-frost" strokeWidth="0.5" strokeDasharray="2 3" />
              </svg>
              <p className="relative text-center font-mono text-[9px] uppercase tracking-[0.2em] text-formula-frost/50">Convergence</p>
              <div className="relative mt-4 h-2 w-full overflow-hidden rounded-sm bg-formula-paper/[0.06]">
                <motion.div
                  className="h-full rounded-sm bg-gradient-to-r from-formula-volt/25 via-formula-volt/55 to-formula-volt/35"
                  initial={false}
                  animate={{ width: compositeLive ? '100%' : '0%' }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <motion.div
                className="relative mt-5 text-center"
                initial={false}
                animate={{ opacity: perfVisible ? 1 : 0, y: perfVisible ? 0 : 6 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="font-mono text-[clamp(1.15rem,3.5vw,1.5rem)] font-semibold tracking-tight text-formula-paper">Performance</span>
              </motion.div>
              <motion.div
                className="relative mt-3 min-h-[2.5rem] text-center font-mono text-[11px] leading-relaxed tracking-tight text-formula-frost/75"
                initial={false}
                animate={{ opacity: showMath ? 1 : 0 }}
                transition={{ duration: 0.6 }}
              >
                {showMath ? (
                  <span className="inline-block">
                    <span className="text-formula-mist">P</span>
                    <span className="text-formula-mist"> ≈ </span>
                    {PILLARS.map((p, i) => (
                      <span key={p.id}>
                        <span className="text-formula-volt/90">w</span>
                        <sub className="text-formula-mist">{p.weightLetter}</sub>
                        <span className="text-formula-paper/90">{p.mathLetter}</span>
                        {i < PILLARS.length - 1 ? <span className="text-formula-mist"> + </span> : null}
                      </span>
                    ))}
                    <span className="mt-1 block text-[9px] uppercase tracking-[0.14em] text-formula-mist/80">Σw = 1 by age band</span>
                  </span>
                ) : null}
              </motion.div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 lg:gap-5">
            {PILLARS.slice(3, 6).map((p, i) => (
              <PillarRow
                key={p.id}
                pillar={p}
                index={i + 3}
                visible={pillarCount > i + 3}
                streamsLive={streamsLive}
                flicker={flicker}
              />
            ))}
          </div>
        </div>

        <motion.div
          className="relative mt-10 max-w-3xl border-t border-formula-frost/[0.08] pt-8 text-sm leading-relaxed text-formula-mist"
          initial={false}
          animate={{ opacity: philosophyOn ? 1 : 0, y: philosophyOn ? 0 : 10 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p>
            In practice we compute a <strong className="font-medium text-formula-paper">weighted composite</strong>, not a simple sum: each domain is scored
            from structured testing and observation, then combined through age-specific weights so the same athlete is evaluated fairly for their stage of
            development.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
