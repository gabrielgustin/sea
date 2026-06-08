import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const data = await db.select().from(courses).orderBy(courses.createdAt)
    // Map DB rows to the Course interface shape expected by the frontend
    const mapped = data.map((c) => ({
      id: c.id,
      title: c.title,
      subtitle: c.description,
      description: c.description,
      image: c.image ?? '',
      badge: c.badge,
      startDate: c.startDate ?? '',
      modality: c.badge,
      slug: c.id,
      schedule: c.schedule ?? '',
      location: c.location ?? '',
      teacher: Array.isArray(c.teachers) ? (c.teachers as any[])[0]?.name ?? '' : '',
      teachers: c.teachers as any[] | undefined,
      duration: c.duration ?? '',
      price: c.price ?? '',
      requirements: '',
      objective: '',
      modules: c.modules as any[] ?? [],
      methodology: '',
      finalProject: '',
      level: undefined,
      status: c.status,
      category: c.category,
      maxStudents: c.maxStudents,
    }))
    return NextResponse.json({ courses: mapped })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const id = body.slug ?? nanoid()
    await db.insert(courses).values({
      id,
      title: body.title,
      description: body.description ?? body.subtitle ?? '',
      badge: body.badge ?? 'PRESENCIAL',
      status: body.status ?? 'open',
      category: body.category ?? 'general',
      image: body.image,
      price: body.price,
      duration: body.duration,
      startDate: body.startDate,
      schedule: body.schedule,
      location: body.location,
      maxStudents: body.maxStudents,
      modules: body.modules,
      teachers: body.teachers,
    })
    revalidatePath('/')
    revalidatePath('/catalogo-formaciones')
    return NextResponse.json({ success: true, id })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await db.update(courses).set({ ...data, updatedAt: new Date() }).where(eq(courses.id, String(id)))
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await db.delete(courses).where(eq(courses.id, String(id)))
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
