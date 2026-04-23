import {
  FIELD_RENTAL_WAIVER_ACK_CHECKBOXES,
  FIELD_RENTAL_WAIVER_BULLETS,
  FIELD_RENTAL_WAIVER_INTRO,
  FIELD_RENTAL_WAIVER_TITLE,
} from '@/lib/rentals/field-rental-waiver-legal-copy'
import { cn } from '@/lib/utils'

export function FieldRentalWaiverLegalDocument({
  introVariant,
  className,
}: {
  introVariant: 'standard' | 'roster'
  className?: string
}) {
  return (
    <div className={cn('not-prose', className)}>
      <h3 className="font-mono text-xl font-semibold tracking-tight text-formula-paper md:text-2xl">{FIELD_RENTAL_WAIVER_TITLE}</h3>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-formula-mist">
        {introVariant === 'roster' ? FIELD_RENTAL_WAIVER_INTRO.roster : FIELD_RENTAL_WAIVER_INTRO.standard}
      </p>

      <div className="mt-8 space-y-4 border border-formula-frost/10 bg-formula-paper/[0.02] p-4 text-sm leading-relaxed text-formula-mist md:p-5">
        {FIELD_RENTAL_WAIVER_BULLETS.map((b) => (
          <p key={b.lead}>
            <strong className="text-formula-paper">{b.lead}</strong> {b.body}
          </p>
        ))}
      </div>

      <div className="mt-8 border-t border-formula-frost/10 pt-6">
        <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-mist">Required acknowledgments (form checkboxes)</h4>
        <ul className="mt-3 list-none space-y-2 p-0 text-sm text-formula-mist">
          {FIELD_RENTAL_WAIVER_ACK_CHECKBOXES.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="shrink-0 text-formula-volt">□</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
