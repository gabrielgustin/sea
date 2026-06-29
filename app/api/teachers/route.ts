import { NextRequest, NextResponse } from 'next/server'

// Real schema of teachers:
// id (INTEGER PK autoincrement), name (TEXT), description (TEXT), image (TEXT),
// whatsapp (TEXT), linkedin (TEXT), courseId (TEXT), order (INTEGER),
// active (INTEGER), createdAt (DATETIME), updatedAt (DATETIME), schoolId (TEXT)

const hasTurso = () => !!process.env.TURSO_CONNECTION_URL && !!process.env.TURSO_AUTH_TOKEN

// Normalize courseId input to a JSON array string, or null if empty
function normalizeCourseId(courseId: any): string | null {
  if (!courseId) return null
  if (Array.isArray(courseId)) {
    const ids = courseId.map(String).filter(Boolean)
    return ids.length > 0 ? JSON.stringify(ids) : null
  }
  try {
    const parsed = JSON.parse(courseId)
    if (Array.isArray(parsed)) {
      const ids = parsed.map(String).filter(Boolean)
      return ids.length > 0 ? JSON.stringify(ids) : null
    }
  } catch {}
  const single = String(courseId).trim()
  return single ? JSON.stringify([single]) : null
}

const memoryStore: Record<string, any[]> = {}
function getStore(schoolId: string) {
  if (!memoryStore[schoolId]) memoryStore[schoolId] = []
  return memoryStore[schoolId]
}

async function getTurso() {
  const { turso, initializeSchema } = await import('@/lib/turso-client')
  await initializeSchema()
  return turso
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId') || 'savio'

    if (hasTurso()) {
      const turso = await getTurso()
      const result = await turso.execute(
        'SELECT * FROM teachers WHERE schoolId = ? ORDER BY "order" ASC',
        [schoolId]
      )
      const teachers = (result.rows || []).map((row: any) => {
        // Normalize courseId: stored as JSON array string or single id string
        let courseIds: string[] = []
        if (row.courseId) {
          try {
            const parsed = JSON.parse(row.courseId)
            courseIds = Array.isArray(parsed) ? parsed.map(String) : [String(parsed)]
          } catch {
            // Legacy single id value
            courseIds = [String(row.courseId)]
          }
        }
        return {
          ...row,
          id: String(row.id),
          active: Boolean(row.active),
          courseId: courseIds.length > 0 ? JSON.stringify(courseIds) : null,
          courseIds,
        }
      })
      return NextResponse.json({ teachers })
    }

    return NextResponse.json({ teachers: getStore(schoolId) })
  } catch (error) {
    console.error('[v0] GET /api/teachers error:', error)
    return NextResponse.json({ teachers: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const schoolId = body.schoolId || 'savio'
    // id is INTEGER autoincrement — do NOT pass it

    if (hasTurso()) {
      const turso = await getTurso()
      const result = await turso.execute(
        'INSERT INTO teachers (schoolId, name, description, image, whatsapp, linkedin, courseId, "order", active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          schoolId,
          body.name || '',
          body.description || '',
          body.image || '',
          body.whatsapp || '',
          body.linkedin || '',
          normalizeCourseId(body.courseId),
          body.order ?? 0,
          body.active !== false ? 1 : 0,
        ]
      )
      const newId = result.lastInsertRowid?.toString() || String(Date.now())
      return NextResponse.json({ success: true, id: newId })
    }

    const id = `teacher_${Date.now()}`
    getStore(schoolId).push({ ...body, id })
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('[v0] POST /api/teachers error:', error)
    return NextResponse.json({ error: 'Failed to create teacher', detail: String(error) }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, schoolId = 'savio', ...updatedData } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    if (hasTurso()) {
      const turso = await getTurso()
      const allowed = ['name', 'description', 'image', 'whatsapp', 'linkedin', 'courseId', 'order', 'active']
      const data: Record<string, any> = { ...updatedData }
      if (typeof data.active === 'boolean') data.active = data.active ? 1 : 0
      if ('courseId' in data) data.courseId = normalizeCourseId(data.courseId)
      const fields = Object.keys(data).filter(k => allowed.includes(k))
      if (fields.length === 0) return NextResponse.json({ success: true })
      const setClause = fields.map(f => `"${f}" = ?`).join(', ')
      await turso.execute(
        `UPDATE teachers SET ${setClause}, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND schoolId = ?`,
        [...fields.map(k => data[k]), id, schoolId]
      )
      return NextResponse.json({ success: true })
    }

    const store = getStore(schoolId)
    const idx = store.findIndex(t => String(t.id) === String(id))
    if (idx >= 0) store[idx] = { ...store[idx], ...updatedData }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] PUT /api/teachers error:', error)
    return NextResponse.json({ error: 'Failed to update teacher', detail: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, schoolId = 'savio' } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    if (hasTurso()) {
      const turso = await getTurso()
      await turso.execute('DELETE FROM teachers WHERE id = ? AND schoolId = ?', [id, schoolId])
      return NextResponse.json({ success: true })
    }

    const store = getStore(schoolId)
    const idx = store.findIndex(t => String(t.id) === String(id))
    if (idx >= 0) store.splice(idx, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/teachers error:', error)
    return NextResponse.json({ error: 'Failed to delete teacher', detail: String(error) }, { status: 500 })
  }
}
