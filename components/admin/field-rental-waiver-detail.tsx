'use client'

import Link from 'next/link'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { FieldRentalAgreementFull } from '@/lib/rentals/field-rental-agreements-server'
import { formatRentalTypeForDisplay } from '@/lib/rentals/field-rental-waiver-labels'

function formatSubmitted(iso: string | null) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

function safePdfFileStem(name: string): string {
  const cleaned = name.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 48)
  return cleaned.length > 0 ? cleaned : 'participant'
}

function row(label: string, value: string | null | undefined) {
  const display = value != null && String(value).trim() !== '' ? String(value) : '—'
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[minmax(0,200px)_1fr] sm:gap-6">
      <dt className="font-mono text-[10px] uppercase tracking-wide text-formula-mist">{label}</dt>
      <dd className="text-sm text-formula-paper">{display}</dd>
    </div>
  )
}

async function downloadWaiverPdf(a: FieldRentalAgreementFull): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'letter' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 14
  const maxTextW = pageW - 2 * margin
  let y = margin

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > pageH - 14) {
      doc.addPage()
      y = margin
    }
  }

  const addLines = (lines: string[], fontSize = 10, lineMm = 5) => {
    doc.setFontSize(fontSize)
    for (const line of lines) {
      ensureSpace(lineMm)
      doc.text(line, margin, y)
      y += lineMm
    }
  }

  const paragraph = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    ensureSpace(6)
    doc.text(`${label}:`, margin, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    const wrapped = doc.splitTextToSize(value, maxTextW) as string[]
    addLines(wrapped, 10, 5)
    y += 2
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('Field Rental Agreement — Signed waiver', margin, y)
  y += 10
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)

  paragraph('Submitted', formatSubmitted(a.submitted_at))
  paragraph('Agreement ID', a.id)
  paragraph('Source', a.source)
  paragraph('Rental type', formatRentalTypeForDisplay(a.rental_type))
  paragraph('Participant', a.participant_name)
  paragraph('Email', a.participant_email)
  paragraph('Phone', a.participant_phone ?? '—')
  paragraph('Date of birth', a.participant_dob)
  paragraph('Participant count', a.participant_count != null ? String(a.participant_count) : '—')
  paragraph('Parent / guardian', a.parent_guardian_name ?? '—')
  paragraph('Organization / team', a.organization_name ?? '—')
  paragraph('Printed signer name', a.signature_name)
  paragraph('Notes', a.notes ?? '—')
  paragraph('Facility use agreement accepted', a.agreement_accepted ? 'Yes' : 'No')
  paragraph('Risk / indemnity accepted', a.risk_accepted ? 'Yes' : 'No')
  paragraph('Rules / cancellation accepted', a.rules_accepted ? 'Yes' : 'No')
  paragraph('Stripe checkout session', a.stripe_checkout_session_id ?? '—')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  ensureSpace(8)
  doc.text('Digital signature', margin, y)
  y += 7
  doc.setFont('helvetica', 'normal')

  await new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        const wMm = maxTextW
        const hMm = (img.naturalHeight / img.naturalWidth) * wMm
        ensureSpace(hMm + 6)
        doc.addImage(a.signature_data_url, 'PNG', margin, y, wMm, hMm)
        y += hMm + 6
        resolve()
      } catch (err) {
        reject(err)
      }
    }
    img.onerror = () => reject(new Error('signature image load failed'))
    img.src = a.signature_data_url
  })

  doc.save(`field-rental-waiver-${safePdfFileStem(a.participant_name)}-${a.id.slice(0, 8)}.pdf`)
}

export function FieldRentalWaiverDetail({ agreement }: { agreement: FieldRentalAgreementFull }) {
  const [pdfBusy, setPdfBusy] = useState(false)

  const onDownloadPdf = useCallback(async () => {
    setPdfBusy(true)
    try {
      await downloadWaiverPdf(agreement)
    } catch (e) {
      console.error(e)
      window.alert(
        'Could not build the PDF file. Use your browser Print dialog (Ctrl/Cmd+P) and choose “Save as PDF” instead.'
      )
    } finally {
      setPdfBusy(false)
    }
  }, [agreement])

  return (
    <div className="space-y-8">
      <div className="waiver-no-print flex flex-wrap items-center gap-3">
        <Link
          href="/admin/rentals"
          className="inline-flex h-9 items-center font-mono text-[11px] uppercase tracking-wide text-formula-mist hover:text-formula-paper"
        >
          ← Rentals
        </Link>
        <Button size="md" variant="primary" onClick={onDownloadPdf} disabled={pdfBusy}>
          {pdfBusy ? 'Building PDF…' : 'Download PDF'}
        </Button>
        <Button size="md" variant="secondary" type="button" onClick={() => window.print()}>
          Print / Save as PDF
        </Button>
      </div>

      <article className="border border-formula-frost/12 bg-formula-paper/[0.03] p-6 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_.04)] md:p-8">
        <header className="border-b border-formula-frost/12 pb-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-formula-mist">Field rental</p>
          <h1 className="mt-2 font-mono text-lg font-semibold tracking-tight text-formula-paper md:text-xl">
            Signed waiver — full record
          </h1>
          <p className="mt-2 font-mono text-[11px] text-formula-mist">Submitted {formatSubmitted(agreement.submitted_at)}</p>
        </header>

        <dl className="mt-6 divide-y divide-formula-frost/10 border-t border-formula-frost/12">
          {row('Agreement ID', agreement.id)}
          {row('Source', agreement.source)}
          {row('Rental type', formatRentalTypeForDisplay(agreement.rental_type))}
          {row('Participant name', agreement.participant_name)}
          {row('Email', agreement.participant_email)}
          {row('Phone', agreement.participant_phone)}
          {row('Date of birth', agreement.participant_dob)}
          {row('Participant count', agreement.participant_count != null ? String(agreement.participant_count) : null)}
          {row('Parent / guardian', agreement.parent_guardian_name)}
          {row('Team / organization', agreement.organization_name)}
          {row('Printed signer name', agreement.signature_name)}
          {row('Notes', agreement.notes)}
          {row('Stripe checkout session', agreement.stripe_checkout_session_id)}
        </dl>

        <div className="mt-8 border-t border-formula-frost/12 pt-6">
          <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-mist">Acknowledgments</h2>
          <ul className="mt-3 list-none space-y-2 p-0 text-sm text-formula-paper">
            <li className="flex gap-2">
              <span className="text-formula-volt">{agreement.agreement_accepted ? '✓' : '—'}</span>
              Facility use agreement and waiver terms accepted
            </li>
            <li className="flex gap-2">
              <span className="text-formula-volt">{agreement.risk_accepted ? '✓' : '—'}</span>
              Risk assumption and indemnification accepted
            </li>
            <li className="flex gap-2">
              <span className="text-formula-volt">{agreement.rules_accepted ? '✓' : '—'}</span>
              Facility rules and cancellation policy accepted
            </li>
          </ul>
        </div>

        <div className="mt-8 border-t border-formula-frost/12 pt-6">
          <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-mist">Digital signature</h2>
          <div className="mt-4 overflow-hidden rounded border border-formula-frost/16 bg-black/40 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- data URL from stored waiver */}
            <img
              src={agreement.signature_data_url}
              alt={`Signature for ${agreement.signature_name}`}
              className="mx-auto max-h-48 w-full max-w-3xl object-contain"
            />
          </div>
        </div>
      </article>
    </div>
  )
}
