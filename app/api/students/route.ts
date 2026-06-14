import { NextRequest, NextResponse } from 'next/server'
import { turso, initializeSchema } from '@/lib/turso-client'

export async function GET(request: NextRequest) {
  try {
    await initializeSchema()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId') || 'villada'
    const result = await turso.execute({
      sql: 'SELECT * FROM students WHERE schoolId = ? ORDER BY createdAt DESC',
      args: [schoolId]
    })
    return NextResponse.json({ students: result.rows || [] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const schoolId = body.schoolId || 'villada'
    await turso.execute({
      sql: `INSERT INTO students (schoolId, nombre, apellido, email, telefono, dni, courseId, courseName, status, paymentStatus, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        schoolId,
        body.nombre ?? body.name ?? '',
        body.apellido ?? '',
        body.email ?? '',
        body.telefono ?? null,
        body.dni ?? null,
        body.courseId ?? body.curso ?? '',
        body.courseName ?? body.curso ?? '',
        body.status ?? 'pending',
        body.paymentStatus ?? 'pending',
        body.notes ?? null,
      ]
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, schoolId = 'villada', ...updatedData } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    const allowed = ['nombre','apellido','email','telefono','dni','courseId','courseName','status','paymentStatus','notes']
    const fields = Object.keys(updatedData).filter(k => allowed.includes(k) && updatedData[k] !== undefined)
    const setClause = fields.map(f => `${f} = ?`).join(', ')
    const values = [...fields.map(k => updatedData[k]), id, schoolId]
    await turso.execute({ sql: `UPDATE students SET ${setClause} WHERE id = ? AND schoolId = ?`, args: values })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, schoolId = 'villada' } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await turso.execute({ sql: 'DELETE FROM students WHERE id = ? AND schoolId = ?', args: [id, schoolId] })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 })
  }
}
