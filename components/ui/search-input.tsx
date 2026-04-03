'use client'

import * as React from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchInputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  loading?: boolean
  className?: string
  autoFocus?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function SearchInput({
  placeholder = 'Search…',
  value,
  onChange,
  onClear,
  loading,
  className,
  autoFocus,
  size = 'md',
}: SearchInputProps) {
  const sizeStyles = {
    sm: 'h-8 px-3 pl-8 text-sm',
    md: 'h-9 px-3.5 pl-9 text-[13px]',
    lg: 'h-10 px-4 pl-10 text-sm',
  }
  const iconSize = {
    sm: 'left-2.5 h-3.5 w-3.5',
    md: 'left-3 h-3.5 w-3.5',
    lg: 'left-3.5 h-4 w-4',
  }

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 flex items-center text-text-muted',
          iconSize[size]
        )}
      >
        {loading ? (
          <Loader2 className="h-full w-full animate-spin" />
        ) : (
          <Search className="h-full w-full opacity-70" strokeWidth={1.75} />
        )}
      </div>

      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          'w-full rounded-control border border-border bg-card text-text-primary shadow-sm placeholder:text-text-muted',
          'transition-[background-color,box-shadow,border-color] duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
          'focus:border-primary/55 focus:outline-none focus:shadow-[0_0_0_1px_rgb(244_254_0/0.35)]',
          sizeStyles[size],
          value ? 'pr-8' : 'pr-3'
        )}
      />

      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('')
            onClear?.()
          }}
          className="absolute inset-y-0 right-2 flex items-center text-text-muted transition-colors duration-150 hover:text-text-primary"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      )}
    </div>
  )
}
