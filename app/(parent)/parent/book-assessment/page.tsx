import { redirect } from 'next/navigation'

/** Legacy URL: assessment booking is public at `/book-assessment`. */
export default function ParentBookAssessmentRedirectPage() {
  redirect('/book-assessment')
}
