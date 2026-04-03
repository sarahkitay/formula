import * as React from 'react'
import { cn } from '@/lib/utils'

export function ParentPanel({
  title,
  eyebrow,
  children,
  className,
}: {
  title: string
  eyebrow?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'border border-white/10 bg-[#111111] p-6',
        className
      )}
    >
      {eyebrow && (
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">{eyebrow}</p>
      )}
      <h2 className="mt-1 text-lg font-semibold tracking-tight text-zinc-100">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function ParentSoftBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-white/10 bg-[#0f0f0f] px-5 py-4 text-[13px] leading-relaxed text-zinc-400 [&_strong]:font-semibold [&_strong]:text-zinc-100">
      {children}
    </div>
  )
}
