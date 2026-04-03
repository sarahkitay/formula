'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface GridCardProps {
  title: string
  metric?: string
  description: string
  href: string
  status?: 'active' | 'warning' | 'neutral'
  className?: string
}

/** Lab navigation tile: square, sharp corners, hard shadow on hover */
export function GridCard({ title, metric, description, href, status = 'neutral', className }: GridCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex aspect-square flex-col justify-between border border-[#222] bg-[#141414] p-6 shadow-lab transition-all duration-300 hover:bg-[#1a1a1a] hover:shadow-lab-hover',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="max-w-[85%] font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          {title}
        </h3>
        {status === 'active' && (
          <div
            className="mt-0.5 h-1.5 w-1.5 shrink-0 bg-[#f4fe00] shadow-[0_0_8px_#f4fe00]"
            aria-hidden
          />
        )}
        {status === 'warning' && (
          <div className="mt-0.5 h-1.5 w-1.5 shrink-0 bg-warning" aria-hidden />
        )}
      </div>

      <div>
        {metric && (
          <div className="mb-2 font-mono text-3xl font-light tracking-tighter text-[#f4fe00] md:text-4xl">
            {metric}
          </div>
        )}
        <p className="text-sm leading-tight text-zinc-400 transition-colors group-hover:text-zinc-100">
          {description}
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#f4fe00]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Link>
  )
}
