import { redirect } from 'next/navigation'

/** Default admin landing: dashboard (exec overview + modules + feed). */
export default function AdminIndexPage() {
  redirect('/admin/dashboard')
}
