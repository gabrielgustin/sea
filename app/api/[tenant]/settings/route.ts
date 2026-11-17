import { NextResponse } from 'next/server'
import { route } from '@/lib/auth/guard'
import { getSettings, saveSettings } from '@/lib/data/settings'

export const GET = route(async (_req, { db }) => NextResponse.json({ settings: await getSettings(db) }))

export const POST = route(async (req, { db }) => {
  const { schoolId: _ignored, ...settings } = await req.json()
  await saveSettings(db, settings)
  return NextResponse.json({ success: true })
}, { admin: true })
