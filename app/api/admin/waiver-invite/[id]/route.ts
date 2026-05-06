import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireStaffRoles } from '@/lib/auth/require-staff-bearer'
import { deleteWaiverInviteIfNoSignedWaivers } from '@/lib/rentals/waiver-invites-server'

export const runtime = 'nodejs'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** Admin: delete roster waiver invite when it has zero linked signed waivers. */
export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireStaffRoles(req, ['admin', 'staff'])
  if (gate instanceof NextResponse) return gate

  const { id: raw } = await ctx.params
  const id = raw?.trim() ?? ''
  if (!UUID.test(id)) {
    return NextResponse.json({ error: 'Invalid invite id' }, { status: 400 })
  }
  const result = await deleteWaiverInviteIfNoSignedWaivers(id)
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 400 })
  }
  revalidatePath('/admin/rentals')
  return NextResponse.json({ ok: true })
}
