import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { parentEducationSections } from '@/lib/mock-data/parent-portal'

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
  <article
  key={section.title}
  className="border border-white/10 bg-[#111111] p-6"
  >
  <h2 className="text-base font-semibold tracking-tight text-zinc-100">{section.title}</h2>
  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{section.body}</p>
  </article>
  ))}
  </div>

  <div className="border border-dashed border-[#22c55e]/25 bg-[#0f0f0f] px-6 py-8 text-center">
  <p className="text-sm leading-relaxed text-zinc-400">
  Questions? Your front-desk team and coaching staff are happy to explain how sessions, assessments, and programs
  work together - we’re here to build trust, not urgency.
  </p>
  </div>
  </div>
  </PageContainer>
  )
}
