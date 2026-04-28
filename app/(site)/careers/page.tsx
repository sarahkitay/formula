import type { Metadata } from 'next'
import { CareersApplicationForm } from '@/components/marketing/careers-application-form'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { CAREER_POSITION_OPTIONS } from '@/lib/careers/career-positions'

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Apply for front desk or coaching roles at Formula Soccer Center. Guest experience, scheduling support, and on-floor youth programming.',
}

export default function CareersPage() {
  return (
    <MarketingInnerPage
      eyebrow="Careers"
      title="Join the Formula team"
      intro="We hire for front desk and coaching roles as the facility grows. Submit the form below — applications are stored for staff review and you will hear from us by email when there is a match."
      wide
    >
      <section className="not-prose space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {CAREER_POSITION_OPTIONS.map((o) => (
            <div key={o.value} className="rounded-lg border border-formula-frost/14 bg-formula-paper/[0.03] p-5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt">{o.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-formula-frost/85">{o.blurb}</p>
            </div>
          ))}
        </div>

        <div className="w-full min-w-0 max-w-full overflow-x-clip rounded-xl border border-formula-frost/16 bg-formula-paper/[0.04] p-4 sm:p-5 md:p-8">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-formula-mist">Apply</h2>
          <p className="mt-2 max-w-2xl text-sm text-formula-frost/80">
            No file uploads on this form — link a resume in your message if you would like. Equal opportunity employer.
          </p>
          <div className="mt-6">
            <CareersApplicationForm />
          </div>
        </div>
      </section>
    </MarketingInnerPage>
  )
}
