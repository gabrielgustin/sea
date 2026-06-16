import { NextRequest, NextResponse } from 'next/server'

// Real schema of site_settings:
// key (TEXT), value (TEXT), updatedAt (DATETIME), schoolId (TEXT)
// NOTE: no UNIQUE constraint on (key, schoolId) — use DELETE+INSERT or UPDATE+INSERT pattern

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
      const result = await turso.execute(
        'SELECT key, value FROM site_settings WHERE schoolId = ?',
        [schoolId]
      )
      const settings: Record<string, string> = {}
      for (const row of result.rows) {
        settings[row.key as string] = row.value as string
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

    if (hasTurso()) {
      const { turso, initializeSchema } = await import('@/lib/turso-client')
      await initializeSchema()

      for (const [key, value] of Object.entries(settings)) {
        // Check if key exists for this school
        const existing = await turso.execute(
          'SELECT key FROM site_settings WHERE key = ? AND schoolId = ?',
          [key, schoolId]
        )
        if (existing.rows.length > 0) {
          await turso.execute(
            'UPDATE site_settings SET value = ?, updatedAt = CURRENT_TIMESTAMP WHERE key = ? AND schoolId = ?',
            [String(value), key, schoolId]
          )
        } else {
          await turso.execute(
            'INSERT INTO site_settings (key, value, schoolId) VALUES (?, ?, ?)',
            [key, String(value), schoolId]
          )
        }
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
    return NextResponse.json({ error: 'Failed to save settings', detail: String(error) }, { status: 500 })
  }
}
