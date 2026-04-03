'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  UserCheck,
  Users,
  CreditCard,
  DollarSign,
  MapPin,
  TrendingUp,
  Settings,
  ClipboardList,
  FileText,
  BarChart2,
  BookOpen,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react'
import type { NavItem } from '@/lib/nav/types'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-5 w-5" strokeWidth={1.75} />,
  Calendar: <Calendar className="h-5 w-5" strokeWidth={1.75} />,
  UserCheck: <UserCheck className="h-5 w-5" strokeWidth={1.75} />,
  Users: <Users className="h-5 w-5" strokeWidth={1.75} />,
  CreditCard: <CreditCard className="h-5 w-5" strokeWidth={1.75} />,
  DollarSign: <DollarSign className="h-5 w-5" strokeWidth={1.75} />,
  MapPin: <MapPin className="h-5 w-5" strokeWidth={1.75} />,
  TrendingUp: <TrendingUp className="h-5 w-5" strokeWidth={1.75} />,
  Settings: <Settings className="h-5 w-5" strokeWidth={1.75} />,
  ClipboardList: <ClipboardList className="h-5 w-5" strokeWidth={1.75} />,
  FileText: <FileText className="h-5 w-5" strokeWidth={1.75} />,
  BarChart2: <BarChart2 className="h-5 w-5" strokeWidth={1.75} />,
  BookOpen: <BookOpen className="h-5 w-5" strokeWidth={1.75} />,
  ShoppingBag: <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />,
}

export function DashboardNav({
  items,
  title = 'Go to',
  className,
}: {
  items: NavItem[]
  title?: string
  className?: string
}) {
  const pathname = usePathname()

  return (
    <section className={cn('space-y-3', className)}>
      <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">{title}</h2>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => {
          const active = pathname === item.href
          const icon = ICON_MAP[item.icon]
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'group panel-technical flex items-center gap-3 p-4 transition-colors duration-150 hover:border-primary/30 hover:bg-muted/40',
                  active && 'border-primary/40 bg-primary/10 ring-1 ring-primary/25'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-muted text-text-secondary',
                    active && 'bg-primary/15 text-foreground'
                  )}
                >
                  {icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[13px] font-medium text-text-primary">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-1.5 py-px text-[10px] font-medium',
                            item.badgeVariant === 'accent' && 'bg-primary text-primary-foreground',
                          item.badgeVariant === 'error' && 'bg-foreground text-background',
                          item.badgeVariant === 'warning' && 'bg-accent text-accent-foreground ring-1 ring-primary/25',
                          !item.badgeVariant && 'bg-muted text-text-muted'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-text-muted">Open module</p>
                </div>
                <ChevronRight
                  className={cn(
                    'h-4 w-4 shrink-0 text-text-muted transition-opacity duration-150 group-hover:opacity-100',
                    active ? 'text-primary opacity-100' : 'opacity-0'
                  )}
                  strokeWidth={1.75}
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
