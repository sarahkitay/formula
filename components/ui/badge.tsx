import * as React from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent' | 'outline'

/* Formula Soccer Center: green primary, yellow secondary */
const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-muted text-foreground ring-1 ring-inset ring-border',
  success: 'bg-success/15 text-success ring-1 ring-inset ring-success/35',
  warning: 'bg-accent text-accent-foreground ring-1 ring-inset ring-[#f4fe00]/25',
  error: 'bg-destructive text-destructive-foreground ring-1 ring-inset ring-destructive/40',
  info: 'bg-primary/25 text-accent-foreground ring-1 ring-inset ring-primary/40',
  accent: 'bg-primary text-primary-foreground ring-1 ring-inset ring-[#f4fe00]/30',
  outline: 'bg-transparent text-foreground ring-1 ring-inset ring-border',
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  dot?: boolean
  size?: 'sm' | 'md'
}

export function Badge({ variant = 'default', dot, size = 'sm', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-md',
        size === 'sm' ? 'px-1.5 py-px text-[10px]' : 'px-2 py-0.5 text-xs',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('h-1 w-1 shrink-0 rounded-full', dotColor(variant))} />}
      {children}
    </span>
  )
}

function dotColor(variant: BadgeVariant): string {
  switch (variant) {
    case 'success':
      return 'bg-success'
    case 'info':
    case 'accent':
      return 'bg-primary'
    case 'warning':
      return 'bg-accent-foreground'
    case 'error':
      return 'bg-destructive-foreground'
    default:
      return 'bg-muted-foreground'
  }
}

export function StatusPill({ status, className }: { status: string; className?: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'default', label: 'Inactive' },
    suspended: { variant: 'error', label: 'Suspended' },
    confirmed: { variant: 'success', label: 'Confirmed' },
    cancelled: { variant: 'error', label: 'Cancelled' },
    waitlisted: { variant: 'warning', label: 'Waitlisted' },
    completed: { variant: 'default', label: 'Completed' },
    'in-progress': { variant: 'info', label: 'In progress' },
    scheduled: { variant: 'info', label: 'Scheduled' },
    pending: { variant: 'warning', label: 'Pending' },
    paid: { variant: 'success', label: 'Paid' },
    failed: { variant: 'error', label: 'Failed' },
    refunded: { variant: 'default', label: 'Refunded' },
    expired: { variant: 'error', label: 'Expired' },
    paused: { variant: 'warning', label: 'Paused' },
  }
  const entry = map[status] ?? { variant: 'default' as BadgeVariant, label: status }
  return (
    <Badge
      variant={entry.variant}
      className={cn(
        'rounded-[2px] border-0 py-0.5 pl-2 pr-2 font-mono text-[10px] uppercase tracking-[0.12em] ring-0',
        'border-l-2 border-l-current bg-transparent',
        className
      )}
    >
      {entry.label}
    </Badge>
  )
}

export function SessionTypeBadge({ type }: { type: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    training: { variant: 'info', label: 'Training' },
    evaluation: { variant: 'info', label: 'Evaluation' },
    game: { variant: 'warning', label: 'Game' },
    camp: { variant: 'success', label: 'Camp' },
    private: { variant: 'default', label: 'Private' },
  }
  const entry = map[type] ?? { variant: 'default' as BadgeVariant, label: type }
  return (
    <Badge
      variant={entry.variant}
      className="rounded-[2px] border-0 py-0.5 pl-2 pr-2 font-mono text-[10px] uppercase tracking-[0.12em] ring-0 border-l-2 border-l-current bg-transparent"
    >
      {entry.label}
    </Badge>
  )
}
