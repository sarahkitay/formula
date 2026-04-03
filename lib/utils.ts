import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateString: string, format: 'short' | 'long' | 'time' | 'datetime' = 'short'): string {
  const date = new Date(dateString)
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    case 'long':
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    case 'time':
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    case 'datetime':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' at ' +
        date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    default:
      return dateString
  }
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

/** Avatar fills: brand green, yellow accent, neutrals */
export function getAvatarColor(id: string): string {
  const colors = [
    'bg-primary text-primary-foreground',
    'bg-[#15803d] text-white',
    'bg-[#f4fe00] text-[#0f0f0f]',
    'bg-muted text-foreground',
    'bg-[#2a2a2a] text-[#e5e5e5] ring-1 ring-border',
    'bg-primary/70 text-primary-foreground',
    'bg-[#d6d6d6] text-[#0f0f0f]',
    'bg-success/30 text-success',
  ]
  const index = id.charCodeAt(0) % colors.length
  return colors[index]!
}
