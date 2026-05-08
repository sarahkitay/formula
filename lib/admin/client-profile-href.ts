import type { Payment } from '@/types'

/** Deep link to admin client ledger profile (Stripe purchases for one receipt email, or single purchase). */
export function adminClientProfileHref(p: Pick<Payment, 'id' | 'customerEmail'>): string {
  const e = p.customerEmail?.trim()
  if (e && e.includes('@')) {
    return `/admin/clients/profile?email=${encodeURIComponent(e)}`
  }
  return `/admin/clients/profile?purchaseId=${encodeURIComponent(p.id)}`
}
