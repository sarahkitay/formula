import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  compact?: boolean
}

export function EmptyState({ icon, title, description, action, className, compact }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'gap-3 py-8' : 'gap-4 py-16',
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            'flex items-center justify-center rounded-card bg-muted text-text-muted shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]',
            compact ? 'h-10 w-10' : 'h-14 w-14'
          )}
        >
          <div className={compact ? 'h-5 w-5' : 'h-6 w-6'}>{icon}</div>
        </div>
      )}

      <div className="space-y-1.5">
        <p className={cn('font-semibold text-text-primary', compact ? 'text-sm' : 'text-md')}>
          {title}
        </p>
        {description && (
          <p className={cn('max-w-xs text-text-secondary', compact ? 'text-xs' : 'text-sm')}>
            {description}
          </p>
        )}
      </div>

      {action && (
        <Button variant="secondary" size={compact ? 'sm' : 'md'} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
