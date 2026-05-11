import Link from 'next/link'
import { BOOKING_HUB_PARENT, BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { DAY_PASS_ONE_DAY } from '@/lib/marketing/public-pricing'

export function BookDayPassLanding({ variant }: { variant: 'public' | 'portal' }) {
  const hub = variant === 'portal' ? BOOKING_HUB_PARENT : BOOKING_HUB_PUBLIC

  return (
    <div className="not-prose space-y-8">
      {variant === 'portal' ? (
        <h1 className="text-2xl font-semibold tracking-tight text-formula-paper">
          {`One-day pass · $${DAY_PASS_ONE_DAY.priceUsd}`}
        </h1>
      ) : null}
      <p className="max-w-[62ch] text-[15px] leading-relaxed text-formula-frost/88 sm:text-[16px]">
        One-day passes are <strong className="text-formula-paper">${DAY_PASS_ONE_DAY.priceUsd}</strong> per athlete. Pick the age group that fits your player;
        staff confirm placement at check-in. If you want to see published youth windows first, open{' '}
        <Link href={hub.youthBlocks} className="text-formula-volt underline-offset-2 hover:underline">
          youth training blocks
        </Link>
        . Questions before you arrive:{' '}
        <Link href={hub.contact} className="text-formula-volt underline-offset-2 hover:underline">
          guardian contact
        </Link>{' '}
        or the desk.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {DAY_PASS_ONE_DAY.ageGroups.map((row) => (
          <li
            key={row.label}
            className="rounded-xl border border-formula-frost/16 bg-formula-paper/[0.04] px-4 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-formula-paper"
          >
            {row.label}
            <span className="mt-2 block text-[12px] font-normal normal-case tracking-normal text-formula-frost/75">{row.note}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-formula-frost/70">
        Ongoing training and packages: see{' '}
        <Link href={`${MARKETING_HREF.youthMembership}#programs-catalog`} className="text-formula-volt underline-offset-2 hover:underline">
          memberships and programs
        </Link>
        .
      </p>
    </div>
  )
}
