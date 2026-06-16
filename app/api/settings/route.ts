import { NextRequest, NextResponse } from 'next/server'

const hasTurso = () => !!process.env.TURSO_CONNECTION_URL && !!process.env.TURSO_AUTH_TOKEN

// In-memory fallback
const memorySettings: Record<string, Record<string, string>> = {}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId') || 'villada'

    if (hasTurso()) {
      const { turso, initializeSchema } = await import('@/lib/turso-client')
      await initializeSchema()
      const result = await turso.execute({
        sql: 'SELECT key, value FROM site_settings WHERE schoolId = ?',
        args: [schoolId]
      })
      const settings: Record<string, string> = {}
      for (const row of result.rows) {
        settings[row.key as string] = row.value as string
      }
      return NextResponse.json({ settings })
    }

    // Fallback: return in-memory settings (empty = use client defaults)
    return NextResponse.json({ settings: memorySettings[schoolId] || {} })
  } catch (error) {
    console.error('[v0] GET /api/settings error:', error)
    return NextResponse.json({ settings: {} })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { schoolId = 'villada', ...settings } = body

    if (hasTurso()) {
      const { turso, initializeSchema } = await import('@/lib/turso-client')
      await initializeSchema()
      for (const [key, value] of Object.entries(settings)) {
        await turso.execute({
          sql: `INSERT INTO site_settings (key, schoolId, value) VALUES (?, ?, ?)
                ON CONFLICT(key, schoolId) DO UPDATE SET value = excluded.value`,
          args: [key, schoolId, String(value)]
        })
      }
      return NextResponse.json({ success: true })
    }

    // Fallback: in-memory
    if (!memorySettings[schoolId]) memorySettings[schoolId] = {}
    for (const [key, value] of Object.entries(settings)) {
      memorySettings[schoolId][key] = String(value)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] POST /api/settings error:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
