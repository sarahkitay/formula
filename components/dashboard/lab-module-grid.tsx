'use client'

import type { NavItem } from '@/lib/nav/types'
import { GridCard } from '@/components/ui/grid-card'
import { cn } from '@/lib/utils'

export function LabModuleGrid({
  items,
  title = 'Modules',
  className,
}: {
  items: NavItem[]
  title?: string
  className?: string
}) {
  return (
    <section className={cn('space-y-3', className)}>
      <h2 className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-text-muted">{title}</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        {items.map(item => (
          <GridCard
            key={item.href}
            href={item.href}
            title={item.label}
            metric={item.metric}
            description={item.description ?? `Open ${item.label}`}
            status={item.gridStatus ?? 'neutral'}
          />
        ))}
      </div>
    </section>
  )
}
