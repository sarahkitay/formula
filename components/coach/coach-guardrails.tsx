import { Shield } from 'lucide-react'

export function CoachGuardrailsStrip({ items }: { items: string[] }) {
  return (
    <div className="border border-white/10 bg-black/30 px-4 py-3">
      <div className="mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
        <Shield className="h-3 w-3 text-zinc-500" strokeWidth={2} />
        Operational guardrails
      </div>
      <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((line, i) => (
          <li key={i} className="font-mono text-[10px] leading-snug text-zinc-400">
            · {line}
          </li>
        ))}
      </ul>
    </div>
  )
}
