'use client'

import Link from 'next/link'
import { BOOKING_HUB_PARENT, BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'
import { BOOKING_HUB_DIRECTORY_ID, MARKETING_HREF } from '@/lib/marketing/nav'
import { cn } from '@/lib/utils'

type HubVariant = 'public' | 'portal'

type Tile = { href: string; label: string; description: string }

export function BookAssessmentHub({ variant }: { variant: HubVariant }) {
  const p = variant === 'portal' ? BOOKING_HUB_PARENT : BOOKING_HUB_PUBLIC

  const tiles: Tile[] =
    variant === 'portal'
      ? [
          { href: p.contact, label: 'Your account', description: 'Signed-in guardian · receipts' },
          { href: p.skillsCheck, label: 'June pre-book', description: 'Skills Check calendar & pay' },
          { href: p.youthBlocks, label: 'Youth training blocks', description: 'Preview published weeks' },
          { href: p.fieldRental, label: 'Field rental', description: 'Deposit · default 2 hr blocks (not party checkout)' },
          { href: p.birthdayParty, label: 'Birthday party', description: 'Party deposit checkout' },
          { href: p.waiver, label: 'Rental waiver', description: 'Sign agreement on file' },
        ]
      : [
          { href: p.contact, label: 'Guardian contact', description: 'Name & email for receipts' },
          { href: p.skillsCheck, label: 'June pre-book', description: 'Skills Check calendar & pay' },
          { href: p.youthBlocks, label: 'Youth training blocks', description: 'Preview published weeks' },
          { href: p.fieldRental, label: 'Field rental', description: 'Deposit · default 2 hr blocks (not party checkout)' },
          { href: p.birthdayParty, label: 'Birthday party', description: 'Party deposit checkout' },
          { href: p.waiver, label: 'Rental waiver', description: 'Sign agreement on file' },
        ]

  return (
    <section
      id={BOOKING_HUB_DIRECTORY_ID}
      aria-label="Reserve by category"
      className="not-prose scroll-mt-28 space-y-5"
    >
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {tiles.map((item) => (
          <li key={item.href} className="min-w-0">
            <Link
              href={item.href}
              className={cn(
                'flex min-h-[7.25rem] w-full flex-col justify-between rounded-xl border-2 border-formula-frost/20 bg-gradient-to-br from-formula-paper/[0.07] to-formula-base/90 px-5 py-5 shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition-[border-color,box-shadow,transform] duration-200 md:min-h-[8.25rem] md:px-6 md:py-6',
                'hover:-translate-y-0.5 hover:border-formula-volt/55 hover:shadow-[0_16px_48px_rgba(0,0,0,0.38),0_0_0_1px_rgba(220,255,0,0.12)]',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-formula-volt/80'
              )}
            >
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Open</span>
              <span className="mt-3 text-balance font-mono text-lg font-semibold leading-snug tracking-tight text-formula-paper md:text-xl">
                {item.label}
              </span>
              <span className="mt-2 text-pretty text-sm leading-snug text-formula-frost/80 md:text-[15px]">{item.description}</span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={MARKETING_HREF.parties}
        className={cn(
          'group mt-2 flex w-full min-w-0 flex-col gap-1 rounded-xl border-2 border-formula-frost/22 bg-formula-paper/[0.06] px-5 py-6 text-left transition-[border-color,transform] duration-200 sm:px-6 md:flex-row md:items-center md:justify-between md:py-7',
          'hover:-translate-y-0.5 hover:border-formula-volt/50 hover:bg-formula-paper/[0.09]',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-formula-volt/80'
        )}
      >
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-formula-mist">Birthday parties</p>
          <p className="mt-2 text-xl font-semibold tracking-tight text-formula-paper md:text-2xl group-hover:text-formula-volt">
            Full party story + policies
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-formula-frost/80 md:text-[15px]">
            Hosted parties, pricing context, and facility rules live on the dedicated parties page — open it before you book the deposit from the hub.
          </p>
        </div>
        <span className="mt-4 inline-flex shrink-0 items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-volt md:mt-0">
          Go to parties page
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>
    </section>
  )
}
