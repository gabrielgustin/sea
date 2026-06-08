import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { students } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const data = await db.select().from(students).orderBy(students.createdAt)
    return NextResponse.json({ students: data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await db.insert(students).values({
      nombre: body.nombre ?? body.name ?? '',
      apellido: body.apellido ?? '',
      email: body.email ?? '',
      telefono: body.telefono,
      dni: body.dni,
      courseId: body.courseId ?? body.curso ?? '',
      courseName: body.courseName ?? body.curso ?? '',
      status: body.status ?? 'pending',
      paymentStatus: body.paymentStatus ?? 'pending',
      notes: body.notes,
    }).returning()
    return NextResponse.json({ success: true, student: result[0] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updatedData } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await db.update(students).set(updatedData).where(eq(students.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await db.delete(students).where(eq(students.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 })
  }
}
