import { NextRequest, NextResponse } from 'next/server'

const hasTurso = () => !!process.env.TURSO_CONNECTION_URL && !!process.env.TURSO_AUTH_TOKEN

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
        'SELECT * FROM teachers WHERE schoolId = ? ORDER BY `order` ASC',
        [schoolId]
      )
      const teachers = (result.rows || []).map((row: any) => ({ ...row, active: Boolean(row.active) }))
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
    const id = body.id || `teacher_${Date.now()}`

    if (hasTurso()) {
      const turso = await getTurso()
      await turso.execute(
        'INSERT INTO teachers (id, schoolId, name, description, image, linkedin, whatsapp, courseId, `order`, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, schoolId, body.name || '', body.description || '', body.image || '', body.linkedin || '', body.whatsapp || '', body.courseId || '', body.order ?? 0, body.active !== false ? 1 : 0]
      )
      return NextResponse.json({ success: true, id })
    }

    getStore(schoolId).push({ ...body, id })
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('[v0] POST /api/teachers error:', error)
    return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, schoolId = 'savio', ...updatedData } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    if (hasTurso()) {
      const turso = await getTurso()
      const allowed = ['name', 'description', 'image', 'linkedin', 'whatsapp', 'courseId', 'order', 'active']
      const data: Record<string, any> = { ...updatedData }
      if (typeof data.active === 'boolean') data.active = data.active ? 1 : 0
      const fields = Object.keys(data).filter(k => allowed.includes(k))
      if (fields.length === 0) return NextResponse.json({ success: true })
      const setClause = fields.map(f => ['order','active'].includes(f) ? `\`${f}\` = ?` : `${f} = ?`).join(', ')
      await turso.execute(`UPDATE teachers SET ${setClause} WHERE id = ? AND schoolId = ?`, [...fields.map(k => data[k]), id, schoolId])
      return NextResponse.json({ success: true })
    }

    const store = getStore(schoolId)
    const idx = store.findIndex(t => t.id === id)
    if (idx >= 0) store[idx] = { ...store[idx], ...updatedData }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] PUT /api/teachers error:', error)
    return NextResponse.json({ error: 'Failed to update teacher' }, { status: 500 })
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
    const idx = store.findIndex(t => t.id === id)
    if (idx >= 0) store.splice(idx, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/teachers error:', error)
    return NextResponse.json({ error: 'Failed to delete teacher' }, { status: 500 })
  }
}
