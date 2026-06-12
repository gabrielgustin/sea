import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { teachers } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId') || 'villada'
    
    const allTeachers = await db.select().from(teachers).where(eq(teachers.schoolId, schoolId)).orderBy(teachers.order)
    return NextResponse.json({ teachers: allTeachers })
  } catch (error) {
    console.error('[API] GET teachers error:', error)
    return NextResponse.json({ error: 'Error al obtener docentes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId') || 'villada'
    
    const body = await request.json()
    const { name, description, image, whatsapp, linkedin, courseId, order } = body

    if (!name) return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })

    const result = await db.insert(teachers).values({
      schoolId,
      name,
      description: description || null,
      image: image || null,
      whatsapp: whatsapp || null,
      linkedin: linkedin || null,
      courseId: courseId || null,
      order: order || 0,
      active: true,
    }).returning()

    return NextResponse.json({ teacher: result[0] }, { status: 201 })
  } catch (error) {
    console.error('[API] POST teacher error:', error)
    return NextResponse.json({ error: 'Error al crear docente' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId') || 'villada'
    
    const body = await request.json()
    const { id, name, description, image, whatsapp, linkedin, courseId, order, active } = body

    if (!id) return NextResponse.json({ error: 'El ID es requerido' }, { status: 400 })
    if (!name) return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })

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
    }).where(and(eq(teachers.id, id), eq(teachers.schoolId, schoolId))).returning()

    if (!result.length) return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 })

    return NextResponse.json({ teacher: result[0] })
  } catch (error) {
    console.error('[API] PUT teacher error:', error)
    return NextResponse.json({ error: 'Error al actualizar docente' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId') || 'villada'
    
    const body = await request.json()
    const { id } = body

    if (!id) return NextResponse.json({ error: 'El ID es requerido' }, { status: 400 })

    await db.delete(teachers).where(and(eq(teachers.id, id), eq(teachers.schoolId, schoolId)))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] DELETE teacher error:', error)
    return NextResponse.json({ error: 'Error al eliminar docente' }, { status: 500 })
  }
}

