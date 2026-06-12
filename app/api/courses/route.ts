import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { db } from '@/lib/db'
import { courses, teachers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    let data
    
    if (slug) {
      // Búsqueda por slug específico
      data = await db.select().from(courses).where(eq(courses.slug, slug))
    } else {
      // Traer todos los cursos ordenados
      data = await db.select().from(courses).orderBy(courses.createdAt)
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

    // Si búsqueda por slug, buscar también el docente vinculado en tabla teachers
    if (slug && mapped.length > 0) {
      const courseId = data[0].id
      
      try {
        // Buscar docentes vinculados a este curso (courseId ahora es TEXT)
        const linkedTeachers = await db
          .select()
          .from(teachers)
          .where(eq(teachers.courseId, courseId))
          .orderBy(teachers.order)

        // Mapear docentes a formato esperado
        const teachersFromDB = linkedTeachers.map((t) => ({
          name: t.name,
          photo: t.image ?? '',
          description: t.description ?? '',
          linkedin: t.linkedin ?? '',
          whatsapp: t.whatsapp ?? '',
        }))

        // Si hay docentes en la BD, usarlos; si no, usar los del JSONB legacy
        const finalTeachers = teachersFromDB.length > 0
          ? teachersFromDB
          : mapped[0].teachers

        return NextResponse.json({ course: { ...mapped[0], teachers: finalTeachers } })
      } catch (e) {
        console.error('[v0] Error fetching teachers:', e)
        // En caso de error, devolver el curso sin docentes de la BD
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
    const body = await request.json()
    const id = body.slug || nanoid()

    // requirements is JSONB — always JSON.stringify so plain text becomes a valid JSON string
    const requirementsVal = body.requirements != null && body.requirements !== ''
      ? JSON.stringify(body.requirements)
      : null

    const sql = `
      INSERT INTO "courses" (
        "id","title","subtitle","description","badge","status","category",
        "image","price","duration","startDate","enrollmentDeadline",
        "schedule","location","teacher","modality","slug","level",
        "objective","methodology","finalProject","whatsappGroup",
        "requirements","maxStudents","modules","teachers"
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,$12,
        $13,$14,$15,$16,$17,$18,
        $19,$20,$21,$22,
        $23::jsonb,$24,$25::jsonb,$26::jsonb
      )
    `
    const params = [
      id,
      body.title ?? '',
      body.subtitle ?? '',
      body.description ?? body.subtitle ?? '',
      body.badge ?? 'PRESENCIAL',
      body.status ?? 'open',
      body.category ?? 'general',
      body.image ?? null,
      body.price ?? null,
      body.duration ?? null,
      body.startDate ?? null,
      body.enrollmentDeadline ?? null,
      body.schedule ?? null,
      body.location ?? null,
      body.teacher ?? null,
      body.modality ?? null,
      body.slug ?? id,
      body.level ?? 'PRINCIPIANTE',
      body.objective ?? null,
      body.methodology ?? null,
      body.finalProject ?? null,
      body.whatsappGroup ?? null,
      requirementsVal,
      body.maxStudents ?? null,
      JSON.stringify(body.modules ?? []),
      JSON.stringify(body.teachers ?? []),
    ]

    await pool.query(sql, params)
    try {
      revalidatePath('/')
      revalidatePath('/villada/formaciones')
    } catch (_) {}
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

    const str = (val: any): string | null =>
      typeof val === 'string' && val.trim() !== '' ? val.trim() : null

    const fields: string[] = []
    const params: any[] = []

    const addText = (col: string, val: any) => {
      const v = str(val)
      if (v !== null) { params.push(v); fields.push(`"${col}" = $${params.length}`) }
    }

    const addNullable = (col: string, val: any) => {
      // Permite guardar null (borrar el campo) además de valores string vacíos
      params.push(str(val))
      fields.push(`"${col}" = $${params.length}`)
    }

    const addJsonb = (col: string, val: any) => {
      const serialized = typeof val === 'string'
        ? JSON.stringify(val)
        : JSON.stringify(val)
      params.push(serialized)
      fields.push(`"${col}" = $${params.length}::jsonb`)
    }

    // Required NOT NULL fields — always include
    params.push(str(body.title) ?? '');       fields.push(`"title" = $${params.length}`)
    params.push(str(body.description) ?? str(body.subtitle) ?? ''); fields.push(`"description" = $${params.length}`)
    params.push(str(body.badge) ?? 'PRESENCIAL'); fields.push(`"badge" = $${params.length}`)
    params.push(str(body.status) ?? 'open');    fields.push(`"status" = $${params.length}`)
    params.push(str(body.category) ?? 'general'); fields.push(`"category" = $${params.length}`)

    // Optional plain text fields
    addText('subtitle',            body.subtitle)
    addText('price',               body.price)
    addText('duration',            body.duration)
    addText('startDate',           body.startDate)
    // enrollmentDeadline: use addNullable so an empty string clears it too
    addNullable('enrollmentDeadline', body.enrollmentDeadline)
    addText('schedule',            body.schedule)
    addText('location',            body.location)
    addText('teacher',             body.teacher)
    addText('modality',            body.modality)
    addText('slug',                body.slug)
    addText('level',               body.level)
    addText('objective',           body.objective)
    addText('methodology',         body.methodology)
    addText('finalProject',        body.finalProject)
    addText('whatsappGroup',       body.whatsappGroup)

    // image: allow null (remove image)
    if (body.image !== undefined) {
      params.push(body.image === '' ? null : body.image)
      fields.push(`"image" = $${params.length}`)
    }

    // maxStudents: integer
    if (body.maxStudents != null && body.maxStudents !== '') {
      params.push(Number(body.maxStudents))
      fields.push(`"maxStudents" = $${params.length}`)
    }

    // JSONB columns
    if (body.requirements != null && body.requirements !== '') {
      addJsonb('requirements', body.requirements)
    }
    if (Array.isArray(body.modules)) {
      addJsonb('modules', body.modules)
    }
    if (Array.isArray(body.teachers)) {
      addJsonb('teachers', body.teachers)
    }

    // updatedAt
    params.push(new Date())
    fields.push(`"updatedAt" = $${params.length}`)

    // WHERE id
    params.push(String(id))
    const updateSql = `UPDATE "courses" SET ${fields.join(', ')} WHERE "id" = $${params.length}`

    await pool.query(updateSql, params)

    try {
      revalidatePath('/')
      revalidatePath('/villada/formaciones')
    } catch (_) {
      // revalidatePath puede fallar en ciertos entornos; no es crítico
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] PUT /api/courses error:', error)
    const errorMsg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: 'Failed to update course: ' + errorMsg }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, showOnHome } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await pool.query(
      `UPDATE "courses" SET "showOnHome" = $1, "updatedAt" = NOW() WHERE "id" = $2`,
      [Boolean(showOnHome), String(id)]
    )

    try {
      revalidatePath('/')
      revalidatePath('/formaciones')
    } catch (_) {}
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] PATCH /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await db.delete(courses).where(eq(courses.id, String(id)))
    try {
      revalidatePath('/')
      revalidatePath('/villada/formaciones')
    } catch (_) {}
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
