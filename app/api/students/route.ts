import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY createdAt DESC')
    return NextResponse.json({ students: result.rows || [] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    await pool.query(
      `INSERT INTO students (nombre, apellido, email, telefono, dni, courseId, courseName, status, paymentStatus, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.nombre ?? body.name ?? '',
        body.apellido ?? '',
        body.email ?? '',
        body.telefono,
        body.dni,
        body.courseId ?? body.curso ?? '',
        body.courseName ?? body.curso ?? '',
        body.status ?? 'pending',
        body.paymentStatus ?? 'pending',
        body.notes,
      ]
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updatedData } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    
    const fields = Object.keys(updatedData).filter(k => updatedData[k] !== undefined)
    const setClause = fields.map(f => `${f} = ?`).join(', ')
    const values = [...fields.map(k => updatedData[k]), id]
    
    await pool.query(`UPDATE students SET ${setClause} WHERE id = ?`, values)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    
    await pool.query(`DELETE FROM students WHERE id = ?`, [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 })
  }
}
