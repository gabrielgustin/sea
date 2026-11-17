import { NextResponse } from 'next/server'
import { route } from '@/lib/auth/guard'
import { listTeachers, createTeacher, updateTeacher, deleteTeacher } from '@/lib/data/teachers'

export const GET = route(async (_req, { db }) => NextResponse.json({ teachers: await listTeachers(db) }))

export const POST = route(async (req, { db }) => NextResponse.json({ success: true, id: await createTeacher(db, await req.json()) }), { admin: true })

export const PUT = route(async (req, { db }) => {
  const { id, ...data } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  await updateTeacher(db, String(id), data)
  return NextResponse.json({ success: true })
}, { admin: true })

export const DELETE = route(async (req, { db }) => {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  await deleteTeacher(db, String(id))
  return NextResponse.json({ success: true })
}, { admin: true })
