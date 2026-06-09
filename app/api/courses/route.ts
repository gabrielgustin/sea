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
    
    // Construir un objeto con solo los campos que tienen valores
    const updateData: any = { updatedAt: new Date() }
    
    // Solo agregar campos si tienen valores (no undefined, no null)
    if (body.title) updateData.title = body.title
    if (body.subtitle) updateData.subtitle = body.subtitle
    if (body.description) updateData.description = body.description
    if (body.badge) updateData.badge = body.badge
    if (body.status) updateData.status = body.status
    if (body.category) updateData.category = body.category
    if (body.image !== undefined) updateData.image = body.image
    if (body.price) updateData.price = body.price
    if (body.duration) updateData.duration = body.duration
    if (body.startDate) updateData.startDate = body.startDate
    if (body.enrollmentDeadline) updateData.enrollmentDeadline = body.enrollmentDeadline
    if (body.schedule) updateData.schedule = body.schedule
    if (body.location) updateData.location = body.location
    if (body.teacher) updateData.teacher = body.teacher
    if (body.modality) updateData.modality = body.modality
    if (body.slug) updateData.slug = body.slug
    if (body.level) updateData.level = body.level
    if (body.objective) updateData.objective = body.objective
    if (body.methodology) updateData.methodology = body.methodology
    if (body.finalProject) updateData.finalProject = body.finalProject
    if (body.whatsappGroup) updateData.whatsappGroup = body.whatsappGroup
    if (body.requirements) updateData.requirements = body.requirements
    if (body.maxStudents) updateData.maxStudents = body.maxStudents
    if (body.modules) updateData.modules = body.modules
    if (body.teachers) updateData.teachers = body.teachers
    
    const result = await db.update(courses).set(updateData).where(eq(courses.id, String(id)))
    
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
