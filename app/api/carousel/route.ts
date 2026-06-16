import { NextRequest, NextResponse } from 'next/server'

const hasTurso = () => !!process.env.TURSO_CONNECTION_URL && !!process.env.TURSO_AUTH_TOKEN

const memoryStore: Record<string, any[]> = {}
function getStore(schoolId: string) {
  if (!memoryStore[schoolId]) {
    memoryStore[schoolId] = []
  }
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
        'SELECT * FROM carousel_slides WHERE schoolId = ? ORDER BY `order` ASC',
        [schoolId]
      )
      const slides = (result.rows || []).map((row: any) => ({ ...row, active: Boolean(row.active) }))
      return NextResponse.json({ slides })
    }

    return NextResponse.json({ slides: getStore(schoolId) })
  } catch (error) {
    console.error('[v0] GET /api/carousel error:', error)
    return NextResponse.json({ slides: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const schoolId = body.schoolId || 'savio'
    const id = body.id || `slide_${Date.now()}`

    if (hasTurso()) {
      const turso = await getTurso()
      await turso.execute(
        'INSERT INTO carousel_slides (id, schoolId, title, description, image, ctaLink, active, `order`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, schoolId, body.title || '', body.description || '', body.image || '', body.ctaLink || '', body.active !== false ? 1 : 0, body.order ?? 0]
      )
      return NextResponse.json({ success: true, id })
    }

    getStore(schoolId).push({ ...body, id })
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('[v0] POST /api/carousel error:', error)
    return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, schoolId = 'savio', ...updatedData } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    if (hasTurso()) {
      const turso = await getTurso()
      const allowed = ['title', 'description', 'image', 'ctaLink', 'active', 'order']
      const data: Record<string, any> = { ...updatedData }
      if (typeof data.active === 'boolean') data.active = data.active ? 1 : 0
      const fields = Object.keys(data).filter(k => allowed.includes(k))
      if (fields.length === 0) return NextResponse.json({ success: true })
      const setClause = fields.map(f => f === 'order' ? '`order` = ?' : `${f} = ?`).join(', ')
      await turso.execute(`UPDATE carousel_slides SET ${setClause} WHERE id = ? AND schoolId = ?`, [...fields.map(k => data[k]), id, schoolId])
      return NextResponse.json({ success: true })
    }

    const store = getStore(schoolId)
    const idx = store.findIndex(s => s.id === id)
    if (idx >= 0) store[idx] = { ...store[idx], ...updatedData }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] PUT /api/carousel error:', error)
    return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, schoolId = 'savio' } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    if (hasTurso()) {
      const turso = await getTurso()
      await turso.execute('DELETE FROM carousel_slides WHERE id = ? AND schoolId = ?', [id, schoolId])
      return NextResponse.json({ success: true })
    }

    const store = getStore(schoolId)
    const idx = store.findIndex(s => s.id === id)
    if (idx >= 0) store.splice(idx, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/carousel error:', error)
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 })
  }
}
