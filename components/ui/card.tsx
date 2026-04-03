import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Larger radius + shadow (default). */
  size?: 'md' | 'lg'
  /** Lift + lime ring on hover (desktop). */
  interactive?: boolean
}

export function Card({
  className,
  size = 'lg',
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        size === 'lg' ? 'card-surface' : 'card-surface-sm',
        interactive && 'card-interactive card-interactive-hover cursor-default',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 pt-5 pb-0', className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />
}
