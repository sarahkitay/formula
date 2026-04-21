import { PageContainer } from '@/components/layout/app-shell'
import { InvoiceSendForm } from '@/components/admin/invoice-send-form'
import { PageHeader } from '@/components/ui/page-header'
import { Receipt } from 'lucide-react'

export default function AdminInvoicesPage() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader
          title="Invoices"
          subtitle="Compose an invoice message, then open Mail or Messages on this device — or copy the text to paste anywhere."
        />
        <div className="rounded-xl border border-border-subtle bg-surface-elevated/40 p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-2 text-text-muted">
            <Receipt className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span className="text-xs font-medium uppercase tracking-wide">Open on this device</span>
          </div>
          <InvoiceSendForm />
        </div>
      </div>
    </PageContainer>
  )
}
