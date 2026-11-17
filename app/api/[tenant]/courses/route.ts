import { NextResponse } from 'next/server'
import { route } from '@/lib/auth/guard'
import { listCourses, getCourse, createCourse, updateCourse, deleteCourse } from '@/lib/data/courses'

export const GET = route(async (req, { db }) => {
  const slug = new URL(req.url).searchParams.get('slug')
  if (slug) return NextResponse.json({ course: await getCourse(db, slug) })
  return NextResponse.json({ courses: await listCourses(db) })
})

export const POST = route(async (req, { db, tenant }) => {
  const id = await createCourse(db, await req.json(), tenant.config.footerAddress ?? '')
  return NextResponse.json({ success: true, id })
}, { admin: true })

export const PUT = route(async (req, { db }) => {
  const { id, ...data } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  await updateCourse(db, String(id), data)
  return NextResponse.json({ success: true })
}, { admin: true })

export const DELETE = route(async (req, { db }) => {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  await deleteCourse(db, String(id))
  return NextResponse.json({ success: true })
}, { admin: true })
