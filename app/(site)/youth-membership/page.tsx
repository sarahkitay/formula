import type { Metadata } from 'next'
import Link from 'next/link'
import { FormulaMinisMembershipSection } from '@/components/marketing/formula-minis-membership-section'
import { HomeProgramsAndPathways } from '@/components/marketing/home-programs-and-pathways'
import { MarketingInnerPage, CtaRow } from '@/components/marketing/marketing-inner'
import { YouthMembershipPackageHero } from '@/components/marketing/youth-membership-package-hero'
import { marketingInnerH1CompactClassName } from '@/lib/marketing/display-typography'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export const metadata: Metadata = {
  title: 'Formula memberships',
  description:
    'Assessment-first memberships, early bird session packages, Formula Minis (ages 2–5) weekday and Sunday packs, and monthly tier waitlist. Turf: no cleats—turf or tennis shoes only.',
}

export default function YouthMembershipPage() {
  return (
    <>
      <div className="mx-auto max-w-[1100px] px-6 pt-28 md:pt-32">
        <YouthMembershipPackageHero />
      </div>

      <div className="marketing-section-divider" aria-hidden />
      <div className="mx-auto max-w-[1100px] px-6">
        <FormulaMinisMembershipSection />
      </div>
      <div className="marketing-section-divider" aria-hidden />
      <HomeProgramsAndPathways id="programs-catalog" />

      <MarketingInnerPage
        wide
        titleAs="h2"
        articleClassName="!pt-12 md:!pt-16"
        eyebrow="Program guide"
        title="Age brackets & other options"
        titleClassName={marketingInnerH1CompactClassName}
        intro="Formula Minis (2–3) and Formula Juniors (4–5) use fixed packs in the Formula Minis section on this page. U8–U19 covers standard sessions and memberships."
      >
        <div className="not-prose mb-10 rounded-sm border border-formula-volt/28 bg-formula-volt/[0.06] p-4 md:p-5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Footwear (turf)</p>
          <p className="mt-2 text-sm leading-relaxed text-formula-frost/90">
            <strong className="text-formula-paper">No cleats</strong> on the turf. Wear <strong className="text-formula-paper">turf shoes or tennis shoes only</strong>.
          </p>
        </div>

        <h2>Age brackets</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse font-mono text-[11px] text-formula-frost/90">
            <caption className="sr-only">Program age brackets</caption>
            <thead>
              <tr className="border-b border-formula-frost/15 text-left text-formula-mist uppercase tracking-wide">
                <th className="pb-2 pr-3 font-medium">Program</th>
                <th className="pb-2 pr-3 font-medium">Ages</th>
                <th className="pb-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  program: 'Formula Minis',
                  ages: '2–3',
                  notes: (
                    <>
                      Weekday/Sunday packs on the{' '}
                      <Link
                        href="#formula-minis"
                        className="text-formula-volt underline decoration-formula-volt/35 underline-offset-2 hover:decoration-formula-volt/70"
                      >
                        View packs
                      </Link>
                    </>
                  ),
                },
                {
                  program: 'Formula Juniors',
                  ages: '4–5',
                  notes: 'Sunday (weekday TBA)',
                },
                {
                  program: 'U8–U19',
                  ages: '6–18',
                  notes: 'Standard sessions/memberships',
                },
              ].map(row => (
                <tr key={row.program} className="border-b border-formula-frost/[0.07] last:border-b-0">
                  <td className="py-2 pr-3 align-top text-formula-paper/95">{row.program}</td>
                  <td className="py-2 pr-3 align-top">{row.ages}</td>
                  <td className="py-2 align-top text-formula-frost/85">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="!mt-14">Other options (live now)</h2>
        <ul>
          <li>
            <strong>Clinics</strong> (members first):{' '}
            <Link href={MARKETING_HREF.clinics}>Explore</Link>
          </li>
          <li>
            <strong>Friday circuit</strong>:{' '}
            <Link href={MARKETING_HREF.fridayCircuit}>Join</Link>
          </li>
          <li>
            <strong>Camps, rentals, events, adults</strong>:{' '}
            <Link href="#programs-catalog">See all</Link>
          </li>
        </ul>

        <p className="not-prose mt-10 text-[15px] leading-relaxed text-formula-frost/85">
          Deep dive: <Link href={MARKETING_HREF.assessment}>Assessments</Link> · <Link href={MARKETING_HREF.fpi}>The Formula</Link> ·{' '}
          <Link href={MARKETING_HREF.facility}>Facility</Link>
        </p>

        <CtaRow
          primary={{ label: 'Book an assessment', href: MARKETING_HREF.bookAssessmentPortal }}
          secondary={{ label: 'Join the membership waitlist', waitlist: true }}
        />
      </MarketingInnerPage>
    </>
  )
}
