'use server'

import { revalidatePath } from 'next/cache'
import { escapeHtml, sendAdminNotification } from '@/lib/email/send-admin-notification'
import { insertCareerApplication, type CareerPosition } from '@/lib/careers/career-applications-server'
import { careerPositionLabel } from '@/lib/careers/career-positions'
import { getSiteOrigin } from '@/lib/stripe/server'

export type CareerApplicationState = { ok: boolean; message: string }

function getString(formData: FormData, key: string): string {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

function isCareerPosition(v: string): v is CareerPosition {
  return v === 'front_desk' || v === 'coach'
}

export async function submitCareerApplication(
  _prev: CareerApplicationState | undefined,
  formData: FormData
): Promise<CareerApplicationState> {
  const positionRaw = getString(formData, 'position')
  const fullName = getString(formData, 'fullName')
  const email = getString(formData, 'email')
  const phone = getString(formData, 'phone')
  const message = getString(formData, 'message')
  const availability = getString(formData, 'availability')
  const coachingBackground = getString(formData, 'coachingBackground')

  if (!isCareerPosition(positionRaw)) {
    return { ok: false, message: 'Choose whether you are applying for front desk or coach.' }
  }
  if (fullName.length < 2) {
    return { ok: false, message: 'Enter your full name.' }
  }
  if (!email.includes('@') || !email.includes('.')) {
    return { ok: false, message: 'Enter a valid email address.' }
  }
  if (message.length < 40) {
    return { ok: false, message: 'Tell us a bit more in your message (at least a few sentences).' }
  }

  const saved = await insertCareerApplication({
    position: positionRaw,
    full_name: fullName,
    email,
    phone: phone || null,
    message,
    availability: availability || null,
    coaching_background: positionRaw === 'coach' ? coachingBackground || null : null,
  })

  if (!saved.ok) {
    return { ok: false, message: saved.message }
  }

  const roleLabel = careerPositionLabel(positionRaw)
  const adminCareersUrl = `${getSiteOrigin()}/admin/careers`
  revalidatePath('/admin/careers')

  await sendAdminNotification({
    subject: `[Formula] Career application · ${roleLabel} · ${fullName}`,
    html: `
      <p><strong>New career application</strong></p>
      <ul>
        <li><strong>Role</strong>: ${escapeHtml(roleLabel)}</li>
        <li><strong>Name</strong>: ${escapeHtml(fullName)}</li>
        <li><strong>Email</strong>: ${escapeHtml(email)}</li>
        <li><strong>Phone</strong>: ${escapeHtml(phone || '—')}</li>
        <li><strong>Availability</strong>: ${escapeHtml(availability || '—')}</li>
        ${
          positionRaw === 'coach'
            ? `<li><strong>Coaching background</strong>: ${escapeHtml(coachingBackground || '—')}</li>`
            : ''
        }
        <li><strong>Message</strong>: ${escapeHtml(message)}</li>
        <li><strong>Record id</strong>: ${escapeHtml(saved.id)}</li>
      </ul>
      <p>Admin: <a href="${escapeHtml(adminCareersUrl)}">Career applications</a></p>
    `,
    text: `Career application\n${roleLabel}\n${fullName} <${email}>\n${message.slice(0, 500)}`,
  })

  return {
    ok: true,
    message: 'Thanks — we received your application. Our team will reach out by email if there is a fit.',
  }
}
