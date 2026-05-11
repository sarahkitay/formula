import { checkStripeServerSecretKey } from '@/lib/stripe/server'
import { SettingsPageClient } from '@/components/admin/settings-page-client'

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const stripe = checkStripeServerSecretKey()
  return <SettingsPageClient stripePaymentsConnected={stripe.ok} />
}
