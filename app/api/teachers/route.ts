import { NextRequest, NextResponse } from 'next/server'
import { turso, initializeSchema } from '@/lib/turso-client'

export async function GET(request: NextRequest) {
  try {
    await initializeSchema()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId') || 'villada'
    const result = await turso.execute({
      sql: 'SELECT * FROM teachers WHERE schoolId = ? ORDER BY "order" ASC',
      args: [schoolId]
    })
    return NextResponse.json({ teachers: result.rows || [] })
  } catch (error) {
    console.error('[v0] GET /api/teachers error:', error)
    return NextResponse.json({ error: 'Error al obtener docentes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, image, whatsapp, linkedin, courseId, order, schoolId = 'villada' } = body
    if (!name) return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
    const id = `teacher_${Date.now()}`
    await turso.execute({
      sql: `INSERT INTO teachers (id, schoolId, name, description, image, whatsapp, linkedin, courseId, "order", active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
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
    const { id, name, description, image, whatsapp, linkedin, courseId, order, active, schoolId = 'villada' } = body
    if (!id) return NextResponse.json({ error: 'El ID es requerido' }, { status: 400 })
    if (!name) return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
    await turso.execute({
      sql: `UPDATE teachers SET name=?, description=?, image=?, whatsapp=?, linkedin=?, courseId=?, "order"=?, active=?, updatedAt=CURRENT_TIMESTAMP WHERE id=? AND schoolId=?`,
      args: [name, description || null, image || null, whatsapp || null, linkedin || null, courseId || null, order || 0, active !== undefined ? active : 1, id, schoolId]
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] PUT /api/teachers error:', error)
    return NextResponse.json({ error: 'Error al actualizar docente' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, schoolId = 'villada' } = await request.json()
    if (!id) return NextResponse.json({ error: 'El ID es requerido' }, { status: 400 })
    
    // Obtener todos los cursos para actualizar el JSON de teachers
    const coursesResult = await turso.execute({
      sql: 'SELECT id, teachers FROM courses WHERE schoolId = ?',
      args: [schoolId]
    })
    
    // Actualizar el JSON de teachers en cada curso, removiendo el docente eliminado
    for (const course of coursesResult.rows || []) {
      try {
        const teachers = course.teachers ? JSON.parse(course.teachers as string) : []
        const updatedTeachers = teachers.filter((t: any) => t.id !== id)
        
        await turso.execute({
          sql: 'UPDATE courses SET teachers = ? WHERE id = ? AND schoolId = ?',
          args: [JSON.stringify(updatedTeachers), course.id, schoolId]
        })
      } catch (e) {
        console.error('[v0] Error updating course teachers JSON:', e)
      }
    }
    
    // Ahora eliminar el docente
    await turso.execute({ sql: 'DELETE FROM teachers WHERE id=? AND schoolId=?', args: [id, schoolId] })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/teachers error:', error)
    return NextResponse.json({ error: 'Error al eliminar docente' }, { status: 500 })
  }
}
