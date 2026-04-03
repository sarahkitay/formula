'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground font-medium shadow-glow-blue hover:brightness-110 hover:shadow-glow-accent-sm',
  secondary:
    'border border-border bg-muted text-text-primary hover:border-border-bright hover:bg-elevated',
  ghost: 'text-text-secondary hover:bg-muted hover:text-text-primary',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-7 gap-1.5 rounded-control px-2.5 text-xs',
  md: 'h-9 gap-2 rounded-control px-3.5 text-[13px]',
  lg: 'h-10 gap-2 rounded-control px-4 text-sm',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'secondary',
      size = 'md',
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium cursor-pointer select-none whitespace-nowrap',
          'transition-[background-color,box-shadow,border-color,filter,color] duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
          'disabled:pointer-events-none disabled:opacity-40',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? <Spinner size={size} /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    )
  }
)
Button.displayName = 'Button'

function Spinner({ size }: { size: ButtonSize }) {
  const sz = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'
  return (
    <svg className={cn('animate-spin', sz)} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}
