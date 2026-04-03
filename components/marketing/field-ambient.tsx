'use client'

/**
 * Refined pitch-line motif - Style 2 palette (frost lines on deep green-charcoal),
 * slower motion, minimal glow (reference: field-outline inspiration, not demo CSS).
 */
export function FieldAmbient() {
  return (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.32]" aria-hidden>
  <svg
  className="marketing-field-svg absolute -left-[8%] top-1/2 h-[min(140vh,1400px)] w-[116%] -translate-y-1/2 text-formula-frost"
  viewBox="0 0 1200 680"
  preserveAspectRatio="xMidYMid slice"
  >
  <defs>
  <linearGradient id="marketingPitchFade" x1="0%" y1="0%" x2="0%" y2="100%">
  <stop offset="0%" stopColor="#243633" stopOpacity="0" />
  <stop offset="38%" stopColor="#cde1e1" stopOpacity="0.06" />
  <stop offset="72%" stopColor="#cde1e1" stopOpacity="0.03" />
  <stop offset="100%" stopColor="#243633" stopOpacity="0" />
  </linearGradient>
  </defs>
  <g
  className="origin-center"
  style={{
  transform: 'perspective(1550px) rotateX(58deg) scale(1.02)',
  transformBox: 'fill-box' as const,
  }}
  >
  <rect
  x="80"
  y="40"
  width="1040"
  height="560"
  fill="url(#marketingPitchFade)"
  stroke="currentColor"
  strokeWidth={0.55}
  opacity={0.28}
  />
  <line
  x1="600"
  y1="40"
  x2="600"
  y2="600"
  stroke="currentColor"
  strokeWidth={0.5}
  opacity={0.38}
  className="marketing-field-dashanim"
  />
  <ellipse
  cx="600"
  cy="320"
  rx="118"
  ry="92"
  fill="none"
  stroke="currentColor"
  strokeWidth={0.5}
  opacity={0.32}
  className="marketing-field-dashanim-slow"
  />
  <rect x="80" y="188" width="156" height="264" fill="none" stroke="currentColor" strokeWidth={0.45} opacity={0.26} />
  <rect x="964" y="188" width="156" height="264" fill="none" stroke="currentColor" strokeWidth={0.45} opacity={0.26} />
  <line x1="80" y1="320" x2="236" y2="320" stroke="currentColor" strokeWidth={0.45} opacity={0.22} />
  <line x1="964" y1="320" x2="1120" y2="320" stroke="currentColor" strokeWidth={0.45} opacity={0.22} />
  </g>
  </svg>
  </div>
  )
}
