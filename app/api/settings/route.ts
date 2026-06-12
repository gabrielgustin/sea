import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db/getDb'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const schoolId = searchParams.get('schoolId') || 'villada'
    const pool = getPool(schoolId)
    
    const result = await pool.query(
      'SELECT key, value FROM school_settings WHERE schoolId = $1 ORDER BY key',
      [schoolId]
    )
    const settings: Record<string, string> = {}
    for (const row of result.rows) {
      settings[row.key] = row.value
    }
    return NextResponse.json({ settings, schoolId })
  } catch (error) {
    console.error('[v0] GET /api/settings error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const schoolId = searchParams.get('schoolId') || 'villada'
    const body = await request.json()
    const pool = getPool(schoolId)

    for (const [key, value] of Object.entries(body)) {
      await pool.query(
        `INSERT INTO school_settings (schoolId, key, value, "updatedAt") VALUES ($1, $2, $3, NOW())
         ON CONFLICT (schoolId, key) DO UPDATE SET value = $3, "updatedAt" = NOW()`,
        [schoolId, key, String(value)]
      )
    }

    return NextResponse.json({ success: true, schoolId })
  } catch (error) {
    console.error('[v0] POST /api/settings error:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
