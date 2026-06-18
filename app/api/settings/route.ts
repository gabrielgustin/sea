import { NextRequest, NextResponse } from 'next/server'

// site_settings table has UNIQUE(key). To support multiple schools we store
// keys prefixed with schoolId: e.g. "savio__instagramUrl", "villada__instagramUrl"
// This avoids any constraint conflicts and keeps schools fully isolated.

const hasTurso = () => !!process.env.TURSO_CONNECTION_URL && !!process.env.TURSO_AUTH_TOKEN

// In-memory fallback
const memorySettings: Record<string, Record<string, string>> = {}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId') || 'villada'
    const prefix = `${schoolId}__`

    if (hasTurso()) {
      const { turso, initializeSchema } = await import('@/lib/turso-client')
      await initializeSchema()

      const result = await turso.execute(
        `SELECT key, value FROM site_settings WHERE key LIKE ?`,
        [`${prefix}%`]
      )
      const settings: Record<string, string> = {}
      for (const row of result.rows) {
        // Strip the "schoolId__" prefix to return clean keys
        const cleanKey = (row.key as string).replace(prefix, '')
        settings[cleanKey] = row.value as string
      }
      return NextResponse.json({ settings })
    }

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
    const prefix = `${schoolId}__`

    if (hasTurso()) {
      const { turso, initializeSchema } = await import('@/lib/turso-client')
      await initializeSchema()

      for (const [key, value] of Object.entries(settings)) {
        const prefixedKey = `${prefix}${key}`
        // DELETE existing row for this prefixed key, then INSERT fresh
        await turso.execute(
          `DELETE FROM site_settings WHERE key = ?`,
          [prefixedKey]
        )
        await turso.execute(
          `INSERT INTO site_settings (key, value, schoolId) VALUES (?, ?, ?)`,
          [prefixedKey, String(value), schoolId]
        )
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
