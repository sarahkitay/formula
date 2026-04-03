/** Public marketing: symbolic “Formula”  -  matches weighted multi-domain model on /fpi. Server component. */

export function TheFormulaEquation() {
  return (
    <div className="not-prose my-10 border border-formula-frost/14 bg-formula-paper/[0.03] p-6 md:p-8">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-formula-mist">The equation</p>
      <div className="mt-6 overflow-x-auto">
        <p className="font-mono text-[clamp(0.85rem,2.5vw,1.05rem)] leading-relaxed tracking-tight text-formula-paper md:whitespace-nowrap">
          <span className="text-formula-volt">Speed</span>
          <span className="mx-1.5 text-formula-mist">+</span>
          <span className="text-formula-volt">Agility</span>
          <span className="mx-1.5 text-formula-mist">+</span>
          <span className="text-formula-volt">Decision-making</span>
          <span className="mx-1.5 text-formula-mist">+</span>
          <span className="text-formula-volt">Technical execution</span>
          <span className="mx-1.5 text-formula-mist">+</span>
          <span className="text-formula-volt">Game application</span>
          <span className="mx-2 text-formula-mist">→</span>
          <span className="font-semibold text-formula-paper">Performance</span>
        </p>
      </div>
      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-formula-mist">
        In practice we compute a <strong className="font-medium text-formula-paper">weighted composite</strong>, not a simple sum: each domain is scored from
        structured testing and observation, then combined through age-specific weights so the same athlete is evaluated fairly for their stage of
        development.
      </p>
      <p className="mt-3 font-mono text-[11px] leading-relaxed tracking-tight text-formula-frost/80 md:text-[12px]">
        <span className="text-formula-mist">P ≈</span>{' '}
        <span className="text-formula-volt/95">w</span>
        <sub className="text-formula-mist">s</sub>
        <span className="text-formula-paper">S</span>
        <span className="text-formula-mist"> + </span>
        <span className="text-formula-volt/95">w</span>
        <sub className="text-formula-mist">a</sub>
        <span className="text-formula-paper">A</span>
        <span className="text-formula-mist"> + </span>
        <span className="text-formula-volt/95">w</span>
        <sub className="text-formula-mist">c</sub>
        <span className="text-formula-paper">C</span>
        <span className="text-formula-mist"> + …</span>
        <span className="ml-2 text-formula-mist">(weights sum to 1 within each age band)</span>
      </p>
    </div>
  )
}
