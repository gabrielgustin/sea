import { NextRequest, NextResponse } from 'next/server'
import { turso, initializeSchema } from '@/lib/turso-client'

export async function GET(request: NextRequest) {
  try {
    await initializeSchema()

    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId') || 'savio'

    const result = await turso.execute({
      sql: 'SELECT * FROM teachers WHERE schoolId = ? ORDER BY "order" ASC',
      args: [schoolId]
    })

    const teachers = result.rows.map((t) => ({
      id: t.id,
      schoolId: t.schoolId,
      name: t.name,
      description: t.description || '',
      image: t.image || '',
      linkedin: t.linkedin || '',
      whatsapp: t.whatsapp || '',
      courseId: t.courseId || '',
      order: t.order,
      active: Boolean(t.active),
    }))

    return NextResponse.json({ teachers })
  } catch (error) {
    console.error('[v0] GET /api/teachers error:', error)
    return NextResponse.json({ error: 'Error al obtener docentes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, image, whatsapp, linkedin, courseId, order, schoolId = 'savio' } = body

    if (!name) return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })

    const id = `teacher_${Date.now()}`

    await turso.execute({
      sql: `INSERT INTO teachers (id, schoolId, name, description, image, whatsapp, linkedin, courseId, "order", active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      args: [id, schoolId, name, description || null, image || null, whatsapp || null, linkedin || null, courseId || null, order || 0]
    })

    return NextResponse.json({ success: true, id }, { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/teachers error:', error)
    return NextResponse.json({ error: 'Error al crear docente' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, image, whatsapp, linkedin, courseId, order, active, schoolId = 'savio' } = body

    if (!id) return NextResponse.json({ error: 'El ID es requerido' }, { status: 400 })
    if (!name) return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })

    await turso.execute({
      sql: `UPDATE teachers SET name = ?, description = ?, image = ?, whatsapp = ?, linkedin = ?,
            courseId = ?, "order" = ?, active = ? WHERE id = ? AND schoolId = ?`,
      args: [name, description || null, image || null, whatsapp || null, linkedin || null,
             courseId || null, order || 0, active !== undefined ? (active ? 1 : 0) : 1, id, schoolId]
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] PUT /api/teachers error:', error)
    return NextResponse.json({ error: 'Error al actualizar docente' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, schoolId = 'savio' } = body

    if (!id) return NextResponse.json({ error: 'El ID es requerido' }, { status: 400 })

    await turso.execute({
      sql: 'DELETE FROM teachers WHERE id = ? AND schoolId = ?',
      args: [id, schoolId]
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/teachers error:', error)
    return NextResponse.json({ error: 'Error al eliminar docente' }, { status: 500 })
  }
}
