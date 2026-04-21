import Link from 'next/link'
import { MARKETING_HREF } from '@/lib/marketing/nav'

/**
 * Homepage closing band: programs snapshot + primary Book Assessment (centered).
 */
export function HomeNextSteps() {
  return (
    <section
      id="next-steps"
      className="border-t border-formula-frost/10 bg-formula-deep/[0.35]"
      aria-labelledby="home-next-steps-heading"
    >
      <div className="mx-auto max-w-[1200px] px-6 py-16 text-center md:py-20">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-mist">Programs snapshot</p>
        <h2
          id="home-next-steps-heading"
          className="mx-auto mt-3 max-w-[28ch] font-mono text-xl font-semibold tracking-tight text-formula-paper md:text-2xl"
        >
          One facility. Every level.
        </h2>
        <ul className="mx-auto mt-6 max-w-[62ch] list-none space-y-3 p-0 text-center text-[15px] leading-relaxed text-formula-frost/85">
          <li>
            <strong className="font-medium text-formula-paper">Youth programs:</strong> structured sessions, capped enrollment, no drop-in chaos.
          </li>
          <li>
            <strong className="font-medium text-formula-paper">The Formula:</strong> assessment, scoring, and a personalized development plan.
          </li>
          <li>
            <strong className="font-medium text-formula-paper">Friday Youth Game Circuit:</strong> structured competitive play. Balanced teams. Real game
            reps.
          </li>
          <li>
            <strong className="font-medium text-formula-paper">Clinics:</strong> small group, coach-led, high-repetition skill sessions.
          </li>
          <li>
            <strong className="font-medium text-formula-paper">Camps:</strong> full-facility immersion. Structured days.
          </li>
          <li>
            <strong className="font-medium text-formula-paper">Adult programming:</strong> pickup and leagues for adults. Same professional standards.
          </li>
          <li>
            <strong className="font-medium text-formula-paper">Field rentals:</strong> structured field time (default 180 min blocks) —{' '}
            <Link href={MARKETING_HREF.rentals} className="font-medium text-formula-volt/90 underline-offset-4 hover:underline">
              rentals
            </Link>
            . Separate from hosted parties.
          </li>
          <li>
            <strong className="font-medium text-formula-paper">Events:</strong> corporate and large blocks —{' '}
            <Link href={MARKETING_HREF.events} className="font-medium text-formula-volt/90 underline-offset-4 hover:underline">
              request staff
            </Link>
            .
          </li>
        </ul>
        <p className="mx-auto mt-6 max-w-[52ch] text-[14px] leading-relaxed text-formula-frost/70">
          Full catalog and packages live on{' '}
          <Link href={MARKETING_HREF.youthMembership} className="font-medium text-formula-volt/90 underline-offset-4 hover:underline">
            Membership
          </Link>
          . How we measure progress is on{' '}
          <Link href={MARKETING_HREF.fpi} className="font-medium text-formula-volt/90 underline-offset-4 hover:underline">
            The Formula
          </Link>
          .
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={MARKETING_HREF.bookAssessmentPortal}
            className="inline-flex h-11 w-fit items-center border border-formula-volt/50 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-base transition-[filter] duration-300 hover:brightness-105"
          >
            Book an assessment
          </Link>
          <Link
            href={MARKETING_HREF.assessment}
            className="inline-flex h-11 w-fit items-center border border-formula-frost/18 bg-formula-paper/[0.05] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper transition-colors hover:border-formula-frost/28"
          >
            Assessment details
          </Link>
        </div>
      </div>
    </section>
  )
}
