import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { adminModuleDestinations } from '@/lib/nav/admin'
import { cn } from '@/lib/utils'

export default function AdminModulesHubPage() {
  return (
    <PageContainer fullWidth>
      <div className="space-y-8">
        <PageHeader
          title="Modules"
          subtitle="Programming, commercial, and facility tools — same destinations as before, grouped off the short top nav."
          breadcrumb={[
            { label: 'Schedule', href: '/admin/schedule' },
            { label: 'Modules' },
          ]}
        />

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {adminModuleDestinations.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'block rounded-lg border border-formula-frost/14 bg-formula-paper/[0.04] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] transition-colors',
                  'hover:border-formula-volt/25 hover:bg-formula-paper/[0.07]'
                )}
              >
                <p className="font-mono text-[11px] font-bold uppercase tracking-tight text-formula-paper">
                  {item.label}
                </p>
                {item.description ? (
                  <p className="mt-2 text-[12px] leading-snug text-formula-frost/85">{item.description}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageContainer>
  )
}
