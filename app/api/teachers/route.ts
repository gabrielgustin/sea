import { pool } from '@/lib/db'

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM teachers ORDER BY `order` ASC')
    return Response.json({ teachers: result.rows || [] })
  } catch (error) {
    console.error('[API] GET teachers error:', error)
    return Response.json({ error: 'Error al obtener docentes' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, description, image, whatsapp, linkedin, courseId, order } = body

    if (!name) return Response.json({ error: 'El nombre es requerido' }, { status: 400 })

    await pool.query(
      `INSERT INTO teachers (name, description, image, whatsapp, linkedin, courseId, "order", active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [name, description || null, image || null, whatsapp || null, linkedin || null, courseId || null, order || 0]
    )

    return Response.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('[API] POST teacher error:', error)
    return Response.json({ error: 'Error al crear docente' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, name, description, image, whatsapp, linkedin, courseId, order, active } = body

    if (!id) return Response.json({ error: 'El ID es requerido' }, { status: 400 })
    if (!name) return Response.json({ error: 'El nombre es requerido' }, { status: 400 })

    await pool.query(
      `UPDATE teachers SET name = ?, description = ?, image = ?, whatsapp = ?, linkedin = ?, courseId = ?, "order" = ?, active = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [name, description || null, image || null, whatsapp || null, linkedin || null, courseId || null, order || 0, active !== undefined ? active : 1, id]
    )

    return Response.json({ success: true })
  } catch (error) {
    console.error('[API] PUT teacher error:', error)
    return Response.json({ error: 'Error al actualizar docente' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) return Response.json({ error: 'El ID es requerido' }, { status: 400 })

    await pool.query(`DELETE FROM teachers WHERE id = ?`, [id])
    return Response.json({ success: true })
  } catch (error) {
    console.error('[API] DELETE teacher error:', error)
    return Response.json({ error: 'Error al eliminar docente' }, { status: 500 })
  }
}
