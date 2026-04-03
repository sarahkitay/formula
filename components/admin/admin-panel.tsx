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
        'border border-white/10 bg-[#0f0f0f] p-5',
        className
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          {eyebrow && (
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">{eyebrow}</p>
          )}
          <h2 className="font-mono text-xs font-bold uppercase tracking-wide text-zinc-100">{title}</h2>
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
          <tr className="border-b border-white/10 text-left text-zinc-500 uppercase tracking-wide">
            {headers.map(h => (
              <th key={h} className="pb-2 pr-4 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/[0.06] text-zinc-300">
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
