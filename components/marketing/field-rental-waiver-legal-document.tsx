import {
  FIELD_RENTAL_WAIVER_ACK_CHECKBOXES,
  FIELD_RENTAL_WAIVER_INTRO,
  GOLAZO_WAIVER_DOC_TITLE,
  GOLAZO_WAIVER_ENTITY_LINES,
  GOLAZO_WAIVER_PARTICIPANT_HEADER,
  GOLAZO_WAIVER_SECTIONS,
  GOLAZO_WAIVER_SIGNING_BLOCK,
  type GolazoBlock,
} from '@/lib/rentals/field-rental-waiver-legal-copy'
import { cn } from '@/lib/utils'

function GolazoBlocks({ blocks }: { blocks: readonly GolazoBlock[] }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-formula-mist">
      {blocks.map((b, i) =>
        b.type === 'p' ? (
          <p key={i}>{b.text}</p>
        ) : (
          <ul key={i} className="list-disc space-y-2 pl-5 marker:text-formula-frost/50">
            {b.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        )
      )}
    </div>
  )
}

export function FieldRentalWaiverLegalDocument({
  introVariant,
  className,
}: {
  introVariant: 'standard' | 'roster'
  className?: string
}) {
  return (
    <div className={cn('not-prose', className)}>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Golazo Soccer Center LLC · Formula Soccer</p>
      <h3 className="mt-2 font-mono text-lg font-semibold tracking-tight text-formula-paper md:text-xl">{GOLAZO_WAIVER_DOC_TITLE}</h3>
      <div className="mt-3 space-y-0.5 text-sm text-formula-mist">
        {GOLAZO_WAIVER_ENTITY_LINES.map(line => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-formula-mist">
        {introVariant === 'roster' ? FIELD_RENTAL_WAIVER_INTRO.roster : FIELD_RENTAL_WAIVER_INTRO.standard}
      </p>

      <p className="mt-4 max-w-3xl border border-formula-frost/12 bg-formula-paper/[0.02] p-3 text-sm leading-relaxed text-formula-paper md:p-4">
        {GOLAZO_WAIVER_PARTICIPANT_HEADER}
      </p>

      <div className="mt-6 space-y-2">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-mist">Agreement sections</p>
        <p className="text-xs text-formula-frost/75">Tap a heading to expand or collapse. Read each section before signing.</p>
        <div className="mt-3 divide-y divide-formula-frost/10 border border-formula-frost/12 bg-formula-paper/[0.02]">
          {GOLAZO_WAIVER_SECTIONS.map(sec => (
            <details key={sec.n} className="group px-3 py-2 md:px-4 md:py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-mono text-sm font-medium text-formula-paper marker:content-none [&::-webkit-details-marker]:hidden">
                <span>
                  {sec.n}. {sec.title}
                </span>
                <span className="shrink-0 text-formula-mist transition-transform duration-200 group-open:rotate-180" aria-hidden>
                  ▼
                </span>
              </summary>
              <div className="mt-3 border-t border-formula-frost/8 pt-3">
                <GolazoBlocks blocks={sec.blocks} />
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="mt-6 border border-formula-volt/20 bg-formula-volt/[0.04] p-4 text-sm font-medium leading-relaxed text-formula-paper md:p-5">
        {GOLAZO_WAIVER_SIGNING_BLOCK.map(line => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="mt-8 border-t border-formula-frost/10 pt-6">
        <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-mist">Required acknowledgments (form checkboxes)</h4>
        <ul className="mt-3 list-none space-y-2 p-0 text-sm text-formula-mist">
          {FIELD_RENTAL_WAIVER_ACK_CHECKBOXES.map(line => (
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
