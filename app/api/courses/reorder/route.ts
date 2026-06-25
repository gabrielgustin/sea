import { NextRequest, NextResponse } from 'next/server'
import { turso, initializeSchema } from '@/lib/turso-client'

let schemaInitialized = false

async function ensureSchema() {
  if (!schemaInitialized) {
    await initializeSchema()
    schemaInitialized = true
  }
}

// POST /api/courses/reorder — receives { schoolId, orderedIds: string[] }
export async function POST(req: NextRequest) {
  try {
    await ensureSchema()
    const { schoolId, orderedIds } = await req.json()

    if (!schoolId || !Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Update sortOrder for each course in the new order
    for (let i = 0; i < orderedIds.length; i++) {
      await turso.execute(
        `UPDATE courses SET sortOrder = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND schoolId = ?`,
        [i, orderedIds[i], schoolId]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[v0] POST /api/courses/reorder error:', error)
    return NextResponse.json({ error: 'Failed to reorder courses' }, { status: 500 })
  }
}
