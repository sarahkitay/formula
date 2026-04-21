'use server'

import { escapeHtml, sendAdminNotification } from '@/lib/email/send-admin-notification'
import { EVENT_BUDGET_RANGES, EVENT_REQUEST_TYPES, EVENT_SPACE_PRESETS } from '@/lib/marketing/event-request-config'

export type EventRequestState = { ok: boolean; message: string }

const INITIAL: EventRequestState = { ok: false, message: '' }

function getString(formData: FormData, key: string): string {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

function labelFor<T extends { value: string; label: string }>(list: readonly T[], value: string): string {
  return list.find((x) => x.value === value)?.label ?? value
}

export async function submitEventRequest(_prev: EventRequestState | undefined, formData: FormData): Promise<EventRequestState> {
  const eventType = getString(formData, 'eventType')
  const budgetRange = getString(formData, 'budgetRange')
  const spacePreset = getString(formData, 'spacePreset')
  const guestCountRaw = getString(formData, 'guestCount')
  const spaceCountRaw = getString(formData, 'spaceCount')
  const contactName = getString(formData, 'contactName')
  const contactEmail = getString(formData, 'contactEmail')
  const contactPhone = getString(formData, 'contactPhone')
  const preferredDates = getString(formData, 'preferredDates')
  const notes = getString(formData, 'notes')

  if (!EVENT_REQUEST_TYPES.some((t) => t.value === eventType)) {
    return { ok: false, message: 'Choose an event type.' }
  }
  if (!EVENT_BUDGET_RANGES.some((b) => b.value === budgetRange)) {
    return { ok: false, message: 'Choose a budget range.' }
  }
  if (!EVENT_SPACE_PRESETS.some((s) => s.value === spacePreset)) {
    return { ok: false, message: 'Choose how you want to use the space.' }
  }

  const guests = parseInt(guestCountRaw, 10)
  const spaceCount = parseInt(spaceCountRaw, 10)
  if (!Number.isFinite(guests) || guests < 1 || guests > 5000) {
    return { ok: false, message: 'Enter a realistic headcount (1–5000).' }
  }
  if (!Number.isFinite(spaceCount) || spaceCount < 1 || spaceCount > 20) {
    return { ok: false, message: 'Enter how many fields or areas (1–20), or 1 if full facility.' }
  }

  if (contactName.length < 2 || !contactEmail.includes('@')) {
    return { ok: false, message: 'Name and a valid email are required.' }
  }

  const typeLabel = labelFor(EVENT_REQUEST_TYPES, eventType)
  const budgetLabel = labelFor(EVENT_BUDGET_RANGES, budgetRange)
  const spaceLabel = labelFor(EVENT_SPACE_PRESETS, spacePreset)

  await sendAdminNotification({
    subject: `[Formula] Event request · ${typeLabel}`,
    html: `
      <p><strong>New event inquiry</strong></p>
      <ul>
        <li><strong>Type</strong>: ${escapeHtml(typeLabel)}</li>
        <li><strong>Headcount</strong>: ${escapeHtml(String(guests))}</li>
        <li><strong>Budget</strong>: ${escapeHtml(budgetLabel)}</li>
        <li><strong>Areas count</strong>: ${escapeHtml(String(spaceCount))}</li>
        <li><strong>Space</strong>: ${escapeHtml(spaceLabel)}</li>
        <li><strong>Dates / timing</strong>: ${escapeHtml(preferredDates || '—')}</li>
        <li><strong>Contact</strong>: ${escapeHtml(contactName)} · ${escapeHtml(contactEmail)}${contactPhone ? ` · ${escapeHtml(contactPhone)}` : ''}</li>
        <li><strong>Notes</strong>: ${escapeHtml(notes || '—')}</li>
      </ul>
    `,
    text: `Event request\n${typeLabel}\n${contactName} <${contactEmail}>`,
  })

  return { ok: true, message: 'Thanks — our team will follow up by email.' }
}
