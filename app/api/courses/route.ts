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
    console.log('[v0] PUT /api/courses - id:', id)
    console.log('[v0] PUT /api/courses - title:', body.title)
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    
    // Check if course exists first
    const existing = await db.select().from(courses).where(eq(courses.id, String(id)))
    console.log('[v0] PUT /api/courses - existing course found:', existing.length > 0, 'id:', existing[0]?.id)
    
    if (existing.length === 0) {
      console.log('[v0] PUT /api/courses - course not found with id:', String(id))
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    
    const result = await db.update(courses).set({
      title: body.title,
      subtitle: body.subtitle,
      description: body.description ?? body.subtitle ?? '',
      badge: body.badge,
      status: body.status,
      category: body.category,
      image: body.image ?? null,
      price: body.price,
      duration: body.duration,
      startDate: body.startDate,
      enrollmentDeadline: body.enrollmentDeadline,
      schedule: body.schedule,
      location: body.location,
      teacher: body.teacher,
      modality: body.modality,
      slug: body.slug,
      level: body.level,
      objective: body.objective,
      methodology: body.methodology,
      finalProject: body.finalProject,
      whatsappGroup: body.whatsappGroup,
      requirements: body.requirements,
      maxStudents: body.maxStudents,
      modules: body.modules,
      teachers: body.teachers,
      updatedAt: new Date(),
    }).where(eq(courses.id, String(id)))
    
    console.log('[v0] PUT /api/courses - update completed')
    revalidatePath('/')
    revalidatePath('/catalogo-formaciones')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] PUT /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to update course', details: String(error) }, { status: 500 })
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
