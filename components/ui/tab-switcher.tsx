'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface Tab {
  id: string
  label: string
  count?: number
}

export interface TabSwitcherProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
  variant?: 'underline' | 'pill'
  className?: string
}

export function TabSwitcher({ tabs, activeTab, onChange, variant = 'underline', className }: TabSwitcherProps) {
  if (variant === 'pill') {
    return (
      <div
        className={cn(
          'flex flex-wrap gap-px rounded-md border border-border bg-muted p-px',
          className
        )}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex min-h-8 items-center gap-1.5 rounded-[0.2rem] px-2.5 py-1 text-[11px] font-medium transition-colors duration-150',
              tab.id === activeTab
                ? 'bg-card text-text-primary shadow-[inset_0_-2px_0_0_var(--color-formula-volt)]'
                : 'text-text-secondary hover:bg-card hover:text-text-primary'
            )}
          >
            <span className="truncate">{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'rounded-sm px-1 py-px text-[10px] font-medium tabular-nums leading-none',
                  tab.id === activeTab ? 'bg-primary/25 text-foreground' : 'bg-muted text-text-muted'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex border-b border-border', className)}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            '-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2 text-[13px] font-medium transition-colors duration-150',
            tab.id === activeTab
              ? 'border-primary text-text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                'rounded-sm px-1.5 py-px text-[10px] font-medium tabular-nums leading-none',
                tab.id === activeTab ? 'bg-primary/20 text-foreground' : 'bg-muted text-text-muted'
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
