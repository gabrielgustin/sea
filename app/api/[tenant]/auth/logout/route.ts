import { NextResponse } from 'next/server'
import { route } from '@/lib/auth/guard'
import { clearSession } from '@/lib/auth/session'

export const POST = route(async (_req, { tenant }) => {
  await clearSession(tenant.slug)
  return NextResponse.json({ success: true })
})
