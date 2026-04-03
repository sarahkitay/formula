import { redirect } from 'next/navigation'

/** Legacy route - consolidated structured rentals */
export default function FieldRentalsRedirectPage() {
  redirect('/admin/rentals')
}
