import { redirect } from 'next/navigation'

/** Default admin landing: operating calendar first (not the module dashboard). */
export default function AdminIndexPage() {
  redirect('/admin/schedule')
}
