import { NextResponse } from 'next/server'
import { route } from '@/lib/auth/guard'
import { listSlides, createSlide, updateSlide, deleteSlide } from '@/lib/data/carousel'

export const GET = route(async (_req, { db }) => NextResponse.json({ slides: await listSlides(db) }))

export const POST = route(async (req, { db }) => NextResponse.json({ success: true, id: await createSlide(db, await req.json()) }), { admin: true })

export const PUT = route(async (req, { db }) => {
  const { id, ...data } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  await updateSlide(db, String(id), data)
  return NextResponse.json({ success: true })
}, { admin: true })

export const DELETE = route(async (req, { db }) => {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  await deleteSlide(db, String(id))
  return NextResponse.json({ success: true })
}, { admin: true })
