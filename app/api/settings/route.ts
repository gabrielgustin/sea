import { NextRequest, NextResponse } from 'next/server'
import { turso, initializeSchema } from '@/lib/turso-client'

export async function GET(request: NextRequest) {
  try {
    await initializeSchema()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId') || 'villada'
    const result = await turso.execute({
      sql: 'SELECT key, value FROM site_settings WHERE schoolId = ?',
      args: [schoolId]
    })
    const settings: Record<string, string> = {}
    for (const row of result.rows) {
      settings[row.key as string] = row.value as string
    }
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('[v0] GET /api/settings error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { schoolId = 'villada', ...settings } = body
    for (const [key, value] of Object.entries(settings)) {
      await turso.execute({
        sql: `INSERT INTO site_settings (key, schoolId, value) VALUES (?, ?, ?)
              ON CONFLICT(key, schoolId) DO UPDATE SET value = excluded.value`,
        args: [key, schoolId, String(value)]
      })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] POST /api/settings error:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
