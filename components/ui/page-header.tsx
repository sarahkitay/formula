import * as React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumb?: BreadcrumbItem[]
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, breadcrumb, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-6', className)}>
      <div className="min-w-0 space-y-1">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1 text-[11px] text-text-muted">
            {breadcrumb.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight className="h-3 w-3 shrink-0 opacity-50" strokeWidth={1.75} />}
                {item.href ? (
                  <Link href={item.href} className="transition-colors hover:text-text-secondary">
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="truncate text-2xl font-semibold uppercase tracking-tight text-text-primary md:text-[1.65rem] md:leading-tight">
          {title}
        </h1>
        {subtitle && <p className="max-w-2xl text-[13px] leading-relaxed text-text-secondary">{subtitle}</p>}
      </div>

      {actions && <div className="flex shrink-0 items-start gap-2 pt-0.5">{actions}</div>}
    </div>
  )
}
