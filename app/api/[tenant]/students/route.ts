import { NextResponse } from 'next/server'
import { route } from '@/lib/auth/guard'
import { updateById } from '@/lib/data/sql'

const FIELDS = ['nombre', 'apellido', 'email', 'telefono', 'dni', 'courseId', 'courseName', 'status', 'paymentStatus', 'notes'] as const

// Los datos de alumnos son personales: todo el recurso es solo para administradores.
export const GET = route(async (_req, { db }) => {
  const res = await db.execute('SELECT * FROM students ORDER BY "createdAt" DESC')
  return NextResponse.json({ students: res.rows })
}, { admin: true })

export const POST = route(async (req, { db }) => {
  const b = await req.json()
  await db.execute({
    sql: 'INSERT INTO students (nombre, apellido, email, telefono, dni, "courseId", "courseName", status, "paymentStatus", notes) VALUES (?,?,?,?,?,?,?,?,?,?)',
    args: [
      b.nombre ?? b.name ?? '', b.apellido ?? '', b.email ?? '', b.telefono ?? null, b.dni ?? null,
      b.courseId ?? b.curso ?? '', b.courseName ?? b.curso ?? '', b.status ?? 'pending', b.paymentStatus ?? 'pending', b.notes ?? null,
    ],
  })
  return NextResponse.json({ success: true })
}, { admin: true })

export const PUT = route(async (req, { db }) => {
  const { id, ...data } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  await updateById(db, 'students', id, data, FIELDS)
  return NextResponse.json({ success: true })
}, { admin: true })

export const DELETE = route(async (req, { db }) => {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  await db.execute({ sql: 'DELETE FROM students WHERE id = ?', args: [id] })
  return NextResponse.json({ success: true })
}, { admin: true })
