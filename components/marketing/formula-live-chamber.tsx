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

function Motif({
  kind,
  active,
  accent,
}: {
  kind: (typeof PILLARS)[number]['motif']
  active: boolean
  accent?: boolean
}) {
  const o = active ? (accent ? 1 : 0.92) : 0.2
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
    <div
      className={cn('h-8 w-10 shrink-0', classFor, accent && active && 'drop-shadow-[0_0_10px_rgba(220,255,0,0.12)]')}
      style={{ opacity: o }}
      aria-hidden
    >
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
  side,
  accent,
}: {
  pillar: (typeof PILLARS)[number]
  index: number
  visible: boolean
  streamsLive: boolean
  flicker: boolean
  side: 'left' | 'right'
  accent: boolean
}) {
  const display = flicker && streamsLive ? `${(0.1 + (index * 0.03) % 0.09).toFixed(2)}` : pillar.settleWeight
  const towardCenter = side === 'left'
  const lineOrigin = towardCenter ? 'origin-left' : 'origin-right'
  const lineGradient = towardCenter
    ? 'bg-gradient-to-r from-[rgba(220,255,0,0.32)] to-transparent'
    : 'bg-gradient-to-l from-[rgba(220,255,0,0.32)] to-transparent'

  return (
    <motion.div
      className={cn(
        'flex items-center gap-2.5 pb-2.5 last:pb-0 lg:gap-3 lg:pb-2',
        side === 'right' && 'flex-row-reverse',
        accent && visible && 'flc-pillar--accent -mx-1 px-1 py-1 lg:-mx-2 lg:px-2'
      )}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 6,
      }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <Motif kind={pillar.motif} active={visible} accent={accent && visible} />
      <div className={cn('min-w-0 flex-1', side === 'right' && 'text-right')}>
        <span
          className={cn(
            'font-mono text-[13px] tracking-tight md:text-sm',
            accent && visible
              ? 'font-semibold text-formula-paper'
              : 'font-medium text-formula-volt'
          )}
        >
          {pillar.label}
        </span>
        {streamsLive ? (
          <motion.span
            className={cn(
              'ml-2 inline-block font-mono text-[10px] tabular-nums tracking-tight text-formula-frost/42',
              side === 'right' && 'ml-0 mr-2'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            w<sub className="text-formula-mist/70">{pillar.weightLetter}</sub>≈{display}
          </motion.span>
        ) : null}
      </div>
      <motion.div
        className={cn(
          'hidden h-[1px] max-w-[4.5rem] flex-1 lg:block',
          lineOrigin,
          lineGradient
        )}
        initial={false}
        animate={{ scaleX: streamsLive && visible ? 1 : 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  )
}

/**
 * Full-bleed emotional centerpiece for /fpi: weighted model as a calm, awakening instrument, not a slogan.
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

  const perimeterClass =
    'font-mono text-[8px] uppercase tracking-[0.26em] text-formula-frost/22 transition-opacity duration-[1.4s]'

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
        <p className="font-mono text-[9px] font-medium uppercase tracking-[0.28em] text-formula-frost/32">Living model</p>
        <h2
          id="formula-live-chamber-heading"
          className="mt-4 max-w-[26ch] font-mono text-xl font-semibold leading-snug tracking-tight text-formula-paper md:max-w-[30ch] md:text-2xl"
        >
          The Formula is not a slogan. It is revealed as a living weighted system.
        </h2>
        <p className="sr-only">
          Six domains combine with age-specific weights into an internal composite for coaching and placement. Animation illustrates the model; figures are
          representative.
        </p>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-5 xl:gap-7">
          <div className="flex flex-1 flex-col">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.28em] text-formula-frost/28">Inputs</p>
            <div className="flex flex-col gap-1 lg:gap-0.5">
              {PILLARS.slice(0, 3).map((p, i) => (
                <PillarRow
                  key={p.id}
                  pillar={p}
                  index={i}
                  visible={pillarCount > i}
                  streamsLive={streamsLive}
                  flicker={flicker}
                  side="left"
                  accent={p.id === 'decision'}
                />
              ))}
            </div>
          </div>

          <div className="flex shrink-0 flex-col justify-center lg:w-[min(300px,30vw)]">
            <div
              className="relative rounded-md border border-white/[0.08] px-5 py-6"
              style={{ background: 'rgba(0,0,0,0.25)' }}
            >
              <svg className="pointer-events-none absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] opacity-[0.05]" aria-hidden>
                <line x1="50%" y1="8" x2="50%" y2="92%" stroke="currentColor" className="text-formula-frost" strokeWidth="0.5" strokeDasharray="2 3" />
                <line x1="8" y1="50%" x2="calc(100% - 8px)" y2="50%" stroke="currentColor" className="text-formula-frost" strokeWidth="0.5" strokeDasharray="2 3" />
              </svg>
              <p className="relative text-center font-mono text-[8px] uppercase tracking-[0.22em] text-formula-frost/38">
                Convergence
              </p>
              <div className="relative mt-4 h-2 w-full overflow-hidden rounded-sm bg-formula-paper/[0.06]">
                <motion.div
                  className="h-full rounded-sm bg-gradient-to-r from-formula-volt/25 via-formula-volt/55 to-formula-volt/35"
                  initial={false}
                  animate={{ width: compositeLive ? '100%' : '0%' }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <motion.div
                className="relative mt-6 text-center"
                initial={false}
                animate={{ opacity: perfVisible ? 1 : 0, y: perfVisible ? 0 : 6 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <span
                  className="font-mono text-[clamp(1.35rem,4vw,1.8rem)] font-semibold tracking-[-0.04em] text-formula-paper"
                  style={{
                    textShadow: '0 0 36px rgba(220, 255, 0, 0.08), 0 1px 0 rgba(0,0,0,0.35)',
                  }}
                >
                  Performance
                </span>
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

          <div className="flex flex-1 flex-col">
            <p className="mb-3 text-right font-mono text-[9px] uppercase tracking-[0.28em] text-formula-frost/28">Application</p>
            <div className="flex flex-col gap-1 lg:gap-0.5">
              {PILLARS.slice(3, 6).map((p, i) => (
                <PillarRow
                  key={p.id}
                  pillar={p}
                  index={i + 3}
                  visible={pillarCount > i + 3}
                  streamsLive={streamsLive}
                  flicker={flicker}
                  side="right"
                  accent={false}
                />
              ))}
            </div>
          </div>
        </div>

        <motion.div
          className="relative mt-10 max-w-xl border-t border-formula-frost/[0.08] pt-8"
          initial={false}
          animate={{ opacity: philosophyOn ? 1 : 0, y: philosophyOn ? 0 : 10 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-formula-paper/92">
            Weighted composite
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-formula-frost/72">
            Each domain is scored independently, then combined using age-specific weights.
          </p>
          <p className="mt-4 font-mono text-[12px] leading-snug tracking-tight text-formula-frost/52">
            Not a sum. A system.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
