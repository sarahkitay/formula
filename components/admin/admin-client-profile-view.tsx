import Link from 'next/link'
import type { ClientLedgerProfile } from '@/lib/billing/client-ledger-profile-server'
import { formatCurrency, formatDate } from '@/lib/utils'
import { StatusPill } from '@/components/ui/badge'

export function AdminClientProfileView({ profile }: { profile: ClientLedgerProfile }) {
  const { analytics } = profile

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-formula-frost/12 bg-formula-paper/[0.04] p-5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Ledger identity</p>
        <h2 className="mt-2 font-mono text-lg font-semibold text-formula-paper">{profile.displayName}</h2>
        {profile.primaryEmail ? (
          <p className="mt-1 font-mono text-[13px] text-formula-frost/85">{profile.primaryEmail}</p>
        ) : (
          <p className="mt-1 font-mono text-[12px] text-formula-mist">No receipt email on file for these rows.</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-formula-frost/12 p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-formula-mist">First purchase</p>
          <p className="mt-1 font-mono text-sm text-formula-paper">
            {analytics.firstPurchaseAt ? formatDate(analytics.firstPurchaseAt, 'datetime') : '-'}
          </p>
        </div>
        <div className="rounded-lg border border-formula-frost/12 p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-formula-mist">Last activity</p>
          <p className="mt-1 font-mono text-sm text-formula-paper">
            {analytics.lastPurchaseAt ? formatDate(analytics.lastPurchaseAt, 'datetime') : '-'}
          </p>
        </div>
        <div className="rounded-lg border border-formula-frost/12 p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-formula-mist">Lifetime (completed)</p>
          <p className="mt-1 font-mono text-sm font-semibold text-formula-volt">
            {formatCurrency(analytics.lifetimeRevenueUsd)}
          </p>
        </div>
        <div className="rounded-lg border border-formula-frost/12 p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-formula-mist">Avg completed order</p>
          <p className="mt-1 font-mono text-sm text-formula-paper">{formatCurrency(analytics.averageOrderUsd)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-formula-frost/12 p-5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-mist">Checkout mix</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {Object.entries(analytics.byCheckoutType).map(([k, n]) => (
            <li
              key={k}
              className="rounded-md border border-formula-frost/14 bg-formula-base/40 px-2.5 py-1 font-mono text-[11px] text-formula-frost/90"
            >
              <span className="text-formula-paper">{k}</span> · {n}
            </li>
          ))}
        </ul>
        <p className="mt-3 font-mono text-[10px] text-formula-mist">
          {analytics.purchaseCount} ledger row{analytics.purchaseCount === 1 ? '' : 's'} · {analytics.completedCount}{' '}
          completed payment{analytics.completedCount === 1 ? '' : 's'}
        </p>
      </div>

      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-mist">Purchase history</p>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-formula-frost/75">
          Everything we have today comes from Stripe Checkout metadata stored in <code className="text-formula-volt">stripe_purchases</code>. Open a row to see
          raw fields for support and reconciliation.
        </p>
        <ul className="mt-4 space-y-3">
          {profile.purchases.map(p => (
            <li key={p.id} className="rounded-lg border border-formula-frost/12 bg-formula-paper/[0.03]">
              <details className="group px-4 py-3">
                <summary className="cursor-pointer list-none font-mono text-[12px] text-formula-paper marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex flex-wrap items-baseline justify-between gap-2">
                    <span>
                      {formatDate(p.createdAt, 'datetime')} · {p.description}
                    </span>
                    <span className="flex items-center gap-2">
                      <StatusPill status={p.status} />
                      <span className="text-formula-volt">{formatCurrency(p.amountUsd)}</span>
                    </span>
                  </span>
                  <span className="mt-1 block font-mono text-[10px] text-formula-mist">
                    {p.type} · {p.stripeSessionId}
                  </span>
                </summary>
                <pre className="mt-3 max-h-64 overflow-auto rounded-md border border-formula-frost/10 bg-formula-base/80 p-3 font-mono text-[10px] leading-relaxed text-formula-frost/85">
                  {JSON.stringify(
                    {
                      id: p.id,
                      email: p.email,
                      stripe_customer_id: p.stripeCustomerId,
                      payment_status: p.paymentStatus,
                      metadata: p.metadata,
                    },
                    null,
                    2
                  )}
                </pre>
              </details>
            </li>
          ))}
        </ul>
      </div>

      <p className="font-mono text-[10px] text-formula-mist">
        <Link href="/admin/payments" className="text-formula-volt underline-offset-2 hover:underline">
          ← Back to payments
        </Link>
        {' · '}
        <Link href="/admin/events-layer" className="text-formula-volt underline-offset-2 hover:underline">
          Events
        </Link>
      </p>
    </div>
  )
}
