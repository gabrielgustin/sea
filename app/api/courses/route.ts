import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db/getDb'
import { db } from '@/lib/db'
import { courses, teachers } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const schoolId = searchParams.get('schoolId') || 'villada'

    let data

    if (slug) {
      data = await db.select().from(courses).where(and(eq(courses.slug, slug), eq(courses.schoolId, schoolId)))
    } else {
      data = await db.select().from(courses).where(eq(courses.schoolId, schoolId)).orderBy(courses.createdAt)
    }

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
      requirements: typeof c.requirements === 'string'
        ? c.requirements
        : (c.requirements != null ? String(c.requirements) : ''),
      objective: c.objective ?? '',
      methodology: c.methodology ?? '',
      finalProject: c.finalProject ?? '',
      whatsappGroup: c.whatsappGroup ?? '',
      level: c.level ?? 'PRINCIPIANTE',
      modules: (c.modules as any[]) ?? [],
      status: c.status,
      category: c.category,
      maxStudents: c.maxStudents,
      showOnHome: c.showOnHome ?? false,
    }))

    if (slug && mapped.length > 0) {
      const courseId = data[0].id
      try {
        const linkedTeachers = await db
          .select()
          .from(teachers)
          .where(and(eq(teachers.courseId, courseId), eq(teachers.schoolId, schoolId)))
          .orderBy(teachers.order)

        const teachersFromDB = linkedTeachers.map((t) => ({
          name: t.name,
          photo: t.image ?? '',
          description: t.description ?? '',
          linkedin: t.linkedin ?? '',
          whatsapp: t.whatsapp ?? '',
        }))

        const finalTeachers = teachersFromDB.length > 0 ? teachersFromDB : mapped[0].teachers
        return NextResponse.json({ course: { ...mapped[0], teachers: finalTeachers } })
      } catch (e) {
        console.error('[v0] Error fetching teachers:', e)
        return NextResponse.json({ course: mapped[0] })
      }
    }

    return NextResponse.json({ courses: mapped })
  } catch (error) {
    console.error('[v0] GET /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId') || 'villada'
    const pool = getPool(schoolId)

    const body = await request.json()
    const id = body.slug || nanoid()

    const requirementsVal = body.requirements != null && body.requirements !== ''
      ? JSON.stringify(body.requirements)
      : null

    const sql = `
      INSERT INTO "courses" (
        "id","schoolId","title","subtitle","description","badge","status","category",
        "image","price","duration","startDate","enrollmentDeadline",
        "schedule","location","teacher","modality","slug","level",
        "objective","methodology","finalProject","whatsappGroup",
        "requirements","maxStudents","modules","teachers"
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,
        $9,$10,$11,$12,$13,
        $14,$15,$16,$17,$18,$19,
        $20,$21,$22,$23,
        $24::jsonb,$25,$26::jsonb,$27::jsonb
      )
    `
    const params = [
      id, schoolId,
      body.title ?? '', body.subtitle ?? '',
      body.description ?? body.subtitle ?? '',
      body.badge ?? 'PRESENCIAL', body.status ?? 'open', body.category ?? 'general',
      body.image ?? null, body.price ?? null, body.duration ?? null,
      body.startDate ?? null, body.enrollmentDeadline ?? null,
      body.schedule ?? null, body.location ?? null, body.teacher ?? null,
      body.modality ?? null, body.slug ?? id, body.level ?? 'PRINCIPIANTE',
      body.objective ?? null, body.methodology ?? null,
      body.finalProject ?? null, body.whatsappGroup ?? null,
      requirementsVal, body.maxStudents ?? null,
      JSON.stringify(body.modules ?? []),
      JSON.stringify(body.teachers ?? []),
    ]

    await pool.query(sql, params)
    try { revalidatePath(`/${schoolId}`); revalidatePath(`/${schoolId}/formaciones`) } catch (_) {}
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('[v0] POST /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId') || 'villada'
    const pool = getPool(schoolId)

    const { id, ...body } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const str = (val: any): string | null =>
      typeof val === 'string' && val.trim() !== '' ? val.trim() : null

    const fields: string[] = []
    const params: any[] = []

    const addText = (col: string, val: any) => {
      const v = str(val)
      if (v !== null) { params.push(v); fields.push(`"${col}" = $${params.length}`) }
    }

    const addNullable = (col: string, val: any) => {
      params.push(str(val))
      fields.push(`"${col}" = $${params.length}`)
    }

    const addJsonb = (col: string, val: any) => {
      params.push(JSON.stringify(val))
      fields.push(`"${col}" = $${params.length}::jsonb`)
    }

    params.push(str(body.title) ?? '');                            fields.push(`"title" = $${params.length}`)
    params.push(str(body.description) ?? str(body.subtitle) ?? ''); fields.push(`"description" = $${params.length}`)
    params.push(str(body.badge) ?? 'PRESENCIAL');                   fields.push(`"badge" = $${params.length}`)
    params.push(str(body.status) ?? 'open');                        fields.push(`"status" = $${params.length}`)
    params.push(str(body.category) ?? 'general');                   fields.push(`"category" = $${params.length}`)

    addText('subtitle', body.subtitle)
    addText('price', body.price)
    addText('duration', body.duration)
    addText('startDate', body.startDate)
    addNullable('enrollmentDeadline', body.enrollmentDeadline)
    addText('schedule', body.schedule)
    addText('location', body.location)
    addText('teacher', body.teacher)
    addText('modality', body.modality)
    addText('slug', body.slug)
    addText('level', body.level)
    addText('objective', body.objective)
    addText('methodology', body.methodology)
    addText('finalProject', body.finalProject)
    addText('whatsappGroup', body.whatsappGroup)

    if (body.image !== undefined) {
      params.push(body.image === '' ? null : body.image)
      fields.push(`"image" = $${params.length}`)
    }
    if (body.maxStudents != null && body.maxStudents !== '') {
      params.push(Number(body.maxStudents))
      fields.push(`"maxStudents" = $${params.length}`)
    }
    if (body.requirements != null && body.requirements !== '') addJsonb('requirements', body.requirements)
    if (Array.isArray(body.modules)) addJsonb('modules', body.modules)
    if (Array.isArray(body.teachers)) addJsonb('teachers', body.teachers)

    params.push(new Date()); fields.push(`"updatedAt" = $${params.length}`)
    params.push(String(id))
    params.push(schoolId)
    const updateSql = `UPDATE "courses" SET ${fields.join(', ')} WHERE "id" = $${params.length - 1} AND "schoolId" = $${params.length}`

    await pool.query(updateSql, params)
    try { revalidatePath(`/${schoolId}`); revalidatePath(`/${schoolId}/formaciones`) } catch (_) {}
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] PUT /api/courses error:', error)
    const errorMsg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: 'Failed to update course: ' + errorMsg }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId') || 'villada'
    const pool = getPool(schoolId)

    const { id, showOnHome } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await pool.query(
      `UPDATE "courses" SET "showOnHome" = $1, "updatedAt" = NOW() WHERE "id" = $2 AND "schoolId" = $3`,
      [Boolean(showOnHome), String(id), schoolId]
    )
    try { revalidatePath(`/${schoolId}`); revalidatePath(`/${schoolId}/formaciones`) } catch (_) {}
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] PATCH /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId') || 'villada'

    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await db.delete(courses).where(and(eq(courses.id, String(id)), eq(courses.schoolId, schoolId)))
    try { revalidatePath(`/${schoolId}`); revalidatePath(`/${schoolId}/formaciones`) } catch (_) {}
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
