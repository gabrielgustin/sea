import { db } from '@/lib/db'
import { teachers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const allTeachers = await db.select().from(teachers).orderBy(teachers.order)
    return Response.json({ teachers: allTeachers })
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

    const result = await db.insert(teachers).values({
      name,
      description: description || null,
      image: image || null,
      whatsapp: whatsapp || null,
      linkedin: linkedin || null,
      courseId: courseId || null,
      order: order || 0,
      active: true,
    }).returning()

    return Response.json({ teacher: result[0] }, { status: 201 })
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

    const result = await db.update(teachers).set({
      name,
      description: description || null,
      image: image || null,
      whatsapp: whatsapp || null,
      linkedin: linkedin || null,
      courseId: courseId || null,
      order: order || 0,
      active: active !== undefined ? active : true,
      updatedAt: new Date(),
    }).where(eq(teachers.id, id)).returning()

    if (!result.length) return Response.json({ error: 'Docente no encontrado' }, { status: 404 })

    return Response.json({ teacher: result[0] })
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

    await db.delete(teachers).where(eq(teachers.id, id))
    return Response.json({ success: true })
  } catch (error) {
    console.error('[API] DELETE teacher error:', error)
    return Response.json({ error: 'Error al eliminar docente' }, { status: 500 })
  }
}
