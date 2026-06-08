import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const data = await db.select().from(courses).orderBy(courses.createdAt)
    const mapped = data.map((c) => ({
      id: c.id,
      title: c.title,
      subtitle: c.subtitle ?? '',
      description: c.description,
      image: c.image ?? '',
      badge: c.badge,
      startDate: c.startDate ?? '',
      enrollmentDeadline: c.enrollmentDeadline ?? '',
      modality: c.modality ?? c.badge,
      slug: c.slug ?? c.id,
      schedule: c.schedule ?? '',
      location: c.location ?? '',
      teacher: c.teacher ?? '',
      teachers: (c.teachers as any[]) ?? [],
      duration: c.duration ?? '',
      price: c.price ?? '',
      requirements: c.requirements ?? '',
      objective: c.objective ?? '',
      methodology: c.methodology ?? '',
      finalProject: c.finalProject ?? '',
      whatsappGroup: c.whatsappGroup ?? '',
      level: c.level ?? 'PRINCIPIANTE',
      modules: (c.modules as any[]) ?? [],
      status: c.status,
      category: c.category,
      maxStudents: c.maxStudents,
    }))
    return NextResponse.json({ courses: mapped })
  } catch (error) {
    console.error('[v0] GET /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const id = body.slug ?? nanoid()
    await db.insert(courses).values({
      id,
      title: body.title ?? '',
      subtitle: body.subtitle ?? '',
      description: body.description ?? body.subtitle ?? '',
      badge: body.badge ?? 'PRESENCIAL',
      status: body.status ?? 'open',
      category: body.category ?? 'general',
      image: body.image ?? null,
      price: body.price ?? null,
      duration: body.duration ?? null,
      startDate: body.startDate ?? null,
      enrollmentDeadline: body.enrollmentDeadline ?? null,
      schedule: body.schedule ?? null,
      location: body.location ?? null,
      teacher: body.teacher ?? null,
      modality: body.modality ?? null,
      slug: body.slug ?? id,
      level: body.level ?? 'PRINCIPIANTE',
      objective: body.objective ?? null,
      methodology: body.methodology ?? null,
      finalProject: body.finalProject ?? null,
      whatsappGroup: body.whatsappGroup ?? null,
      requirements: body.requirements ?? null,
      maxStudents: body.maxStudents ?? null,
      modules: body.modules ?? [],
      teachers: body.teachers ?? [],
    })
    revalidatePath('/')
    revalidatePath('/catalogo-formaciones')
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('[v0] POST /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...body } = await request.json()
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    
    const result = await db.update(courses).set({
      title: body.title ?? undefined,
      subtitle: body.subtitle ?? undefined,
      description: body.description ?? body.subtitle ?? undefined,
      badge: body.badge ?? undefined,
      status: body.status ?? undefined,
      category: body.category ?? undefined,
      image: body.image ?? null,
      price: body.price ?? undefined,
      duration: body.duration ?? undefined,
      startDate: body.startDate ?? undefined,
      enrollmentDeadline: body.enrollmentDeadline ?? undefined,
      schedule: body.schedule ?? undefined,
      location: body.location ?? undefined,
      teacher: body.teacher ?? undefined,
      modality: body.modality ?? undefined,
      slug: body.slug ?? undefined,
      level: body.level ?? undefined,
      objective: body.objective ?? undefined,
      methodology: body.methodology ?? undefined,
      finalProject: body.finalProject ?? undefined,
      whatsappGroup: body.whatsappGroup ?? undefined,
      requirements: body.requirements ?? undefined,
      maxStudents: body.maxStudents ?? undefined,
      modules: body.modules ?? undefined,
      teachers: body.teachers ?? undefined,
      updatedAt: new Date(),
    }).where(eq(courses.id, String(id)))
    
    revalidatePath('/')
    revalidatePath('/catalogo-formaciones')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] PUT /api/courses error:', error)
    const errorMsg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: 'Failed to update course: ' + errorMsg }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await db.delete(courses).where(eq(courses.id, String(id)))
    revalidatePath('/')
    revalidatePath('/catalogo-formaciones')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
