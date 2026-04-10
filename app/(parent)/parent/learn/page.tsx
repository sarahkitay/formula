import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { parentEducationSections } from '@/lib/mock-data/parent-portal'
import { parentPortalCard, parentPortalDashedCallout } from '@/lib/parent/portal-surface'
import { cn } from '@/lib/utils'

export default function ParentLearnPage() {
  return (
  <PageContainer>
  <div className="space-y-10">
  <PageHeader
  title="How Formula fits your journey"
  subtitle="Structure, science, and respect for the athlete - without public comparison or pressure."
  />

  <div className="grid gap-6 md:grid-cols-2">
  {parentEducationSections.map(section => (
  <article key={section.title} className={cn('p-6', parentPortalCard)}>
  <h2 className="text-base font-semibold tracking-tight text-formula-paper">{section.title}</h2>
  <p className="mt-3 text-sm leading-relaxed text-formula-frost/82">{section.body}</p>
  </article>
  ))}
  </div>

  <div className={parentPortalDashedCallout}>
  <p className="text-sm leading-relaxed text-formula-frost/82">
  Questions? Your front-desk team and coaching staff are happy to explain how sessions, assessments, and programs
  work together - we’re here to build trust, not urgency.
  </p>
  </div>
  </div>
  </PageContainer>
  )
}
