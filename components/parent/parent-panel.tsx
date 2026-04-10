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
        'border border-formula-frost/12 bg-formula-paper/[0.04] p-6 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]',
        className
      )}
    >
      {eyebrow && (
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-formula-mist">{eyebrow}</p>
      )}
      <h2 className="mt-1 text-lg font-semibold tracking-tight text-formula-paper">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function ParentSoftBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-formula-frost/12 bg-formula-deep/50 px-5 py-4 text-[13px] leading-relaxed text-formula-frost/85 [&_strong]:font-semibold [&_strong]:text-formula-paper">
      {children}
    </div>
  )
}
