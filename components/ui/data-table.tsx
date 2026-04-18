'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { EmptyState } from './empty-state'
import { Loader2 } from 'lucide-react'

export interface Column<T> {
  key: string
  header: string
  width?: string
  className?: string
  render?: (row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: React.ReactNode
  onRowClick?: (row: T) => void
  keyField: keyof T
  className?: string
  stickyHeader?: boolean
}

export function DataTable<T>({
  columns,
  data,
  loading,
  emptyTitle = 'No results',
  emptyDescription,
  emptyIcon,
  onRowClick,
  keyField,
  className,
  stickyHeader,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-14 text-text-muted">
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
        <span className="text-[13px]">Loading dataset...</span>
      </div>
    )
  }

  if (data.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div
      className={cn(
        'panel-technical w-full overflow-x-auto rounded-panel',
        className
      )}
    >
      <table className="w-full text-[13px]">
        <thead
          className={cn(
            'border-b border-border bg-muted/60',
            stickyHeader && 'sticky top-0 z-10 backdrop-blur-md'
          )}
        >
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-text-muted',
                  col.width,
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={String(row[keyField]) || i}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b border-border/80 transition-colors duration-150 last:border-b-0',
                onRowClick && 'cursor-pointer hover:bg-muted/90'
              )}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className={cn('px-4 py-2.5 text-text-primary', col.className)}
                >
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? 'N/A')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
