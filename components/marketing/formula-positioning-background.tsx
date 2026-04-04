/** Full-page lab backdrop for What Formula Is / positioning layouts. */
export function FormulaPositioningBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(86,117,102,0.26),transparent_34%),radial-gradient(circle_at_75%_30%,rgba(50,80,67,0.18),transparent_28%),linear-gradient(180deg,#10211d_0%,#0b0f0e_48%,#090b0b_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:54px_54px]" />
      <div className="absolute left-0 top-[15%] h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute left-0 top-[52%] h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <div className="absolute left-[15%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/8 to-transparent" />
      <div className="absolute right-[18%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/7 to-transparent" />
      <div className="absolute inset-0 opacity-[0.06] mix-blend-screen [background-image:radial-gradient(circle_at_20%_30%,white_0.6px,transparent_0.9px),radial-gradient(circle_at_70%_55%,white_0.6px,transparent_0.9px),radial-gradient(circle_at_40%_75%,white_0.6px,transparent_0.9px)] [background-size:220px_220px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,transparent_70%,rgba(0,0,0,0.22))]" />
    </div>
  )
}
