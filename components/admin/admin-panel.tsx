import * as React from 'react'
import { cn } from '@/lib/utils'

export function AdminPanel({
  title,
  eyebrow,
  children,
  className,
  actions,
}: {
  title: string
  eyebrow?: string
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
}) {
  return (
    <section
      className={cn(
        'border border-formula-frost/12 bg-formula-paper/[0.04] p-5 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]',
        className
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          {eyebrow && (
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-formula-mist">{eyebrow}</p>
          )}
          <h2 className="font-mono text-xs font-bold uppercase tracking-wide text-formula-paper">{title}</h2>
        </div>
        {actions}
      </div>
      {children}
    </section>
  )
}

export function AdminMonoTable({
  headers,
  rows,
}: {
  headers: string[]
  rows: (string | number | React.ReactNode)[][]
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-mono text-[11px]">
        <thead>
          <tr className="border-b border-formula-frost/12 text-left text-formula-mist uppercase tracking-wide">
            {headers.map(h => (
              <th key={h} className="pb-2 pr-4 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-formula-frost/[0.08] text-formula-frost/90">
              {row.map((cell, j) => (
                <td key={j} className="py-2 pr-4 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
