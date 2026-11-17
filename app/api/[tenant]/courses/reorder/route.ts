import { NextResponse } from 'next/server'
import { route } from '@/lib/auth/guard'
import { reorderCourses } from '@/lib/data/courses'

export const POST = route(async (req, { db }) => {
  const { orderedIds } = await req.json()
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  await reorderCourses(db, orderedIds.map(String))
  return NextResponse.json({ success: true })
}, { admin: true })
