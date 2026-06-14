import { NextRequest, NextResponse } from 'next/server'
import { turso, initializeSchema } from '@/lib/turso-client'

function mapCourse(course: any) {
  return {
    id: course.id,
    schoolId: course.schoolId,
    title: course.title,
    subtitle: course.subtitle || '',
    description: course.description,
    image: course.image || '',
    badge: course.badge,
    startDate: course.startDate || '',
    enrollmentDeadline: course.enrollmentDeadline || '',
    modality: course.modality || course.badge,
    slug: course.slug || course.id,
    schedule: course.schedule || '',
    location: course.location || '',
    teacher: course.teacher || '',
    teachers: course.teachers ? JSON.parse(course.teachers as string) : [],
    duration: course.duration || '',
    price: course.price || '',
    requirements: course.requirements || '',
    objective: course.objective || '',
    methodology: course.methodology || '',
    finalProject: course.finalProject || '',
    whatsappGroup: course.whatsappGroup || '',
    level: course.level || 'PRINCIPIANTE',
    modules: course.modules ? JSON.parse(course.modules as string) : [],
    status: course.status,
    category: course.category,
    maxStudents: course.maxStudents,
    showOnHome: Boolean(course.showOnHome),
  }
}

export async function GET(request: NextRequest) {
  try {
    await initializeSchema()

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const schoolId = searchParams.get('schoolId') || 'savio'

    if (slug) {
      const result = await turso.execute({
        sql: 'SELECT * FROM courses WHERE slug = ? AND schoolId = ? LIMIT 1',
        args: [slug, schoolId]
      })

      if (result.rows.length === 0) {
        return NextResponse.json({ course: null }, { status: 404 })
      }

      const course = result.rows[0]
      const mapped = mapCourse(course)

      const teachersResult = await turso.execute({
        sql: 'SELECT * FROM teachers WHERE courseId = ? AND schoolId = ? ORDER BY "order" ASC',
        args: [course.id, schoolId]
      })

      if (teachersResult.rows.length > 0) {
        mapped.teachers = teachersResult.rows.map((t) => ({
          name: t.name,
          photo: t.image || '',
          description: t.description || '',
          linkedin: t.linkedin || '',
          whatsapp: t.whatsapp || '',
        }))
      }

      return NextResponse.json({ course: mapped })
    } else {
      const result = await turso.execute({
        sql: 'SELECT * FROM courses WHERE schoolId = ? ORDER BY createdAt DESC',
        args: [schoolId]
      })

      const courses = result.rows.map(mapCourse)
      return NextResponse.json(courses)
    }
  } catch (error) {
    console.error('[v0] GET /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      schoolId = 'savio',
      title, subtitle, description, image, badge, slug,
      startDate, enrollmentDeadline, modality, schedule, location,
      teacher, teachers, duration, price, requirements, objective,
      methodology, finalProject, whatsappGroup, level, modules,
      status, category, maxStudents, showOnHome
    } = body

    const id = `course_${Date.now()}`

    await turso.execute({
      sql: `INSERT INTO courses 
        (id, schoolId, title, subtitle, description, image, badge, slug, startDate, 
         enrollmentDeadline, modality, schedule, location, teacher, teachers, 
         duration, price, requirements, objective, methodology, finalProject, 
         whatsappGroup, level, modules, status, category, maxStudents, showOnHome) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, schoolId, title, subtitle, description, image, badge, slug, startDate,
        enrollmentDeadline, modality, schedule, location, teacher,
        JSON.stringify(teachers || []), duration, price, requirements,
        objective, methodology, finalProject, whatsappGroup, level,
        JSON.stringify(modules || []), status, category, maxStudents,
        showOnHome ? 1 : 0
      ]
    })

    return NextResponse.json({ id, success: true }, { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id, schoolId = 'savio',
      title, subtitle, description, image, badge, slug,
      startDate, enrollmentDeadline, modality, schedule, location,
      teacher, teachers, duration, price, requirements, objective,
      methodology, finalProject, whatsappGroup, level, modules,
      status, category, maxStudents, showOnHome
    } = body

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

    await turso.execute({
      sql: `UPDATE courses SET
        title = ?, subtitle = ?, description = ?, image = ?, badge = ?, slug = ?,
        startDate = ?, enrollmentDeadline = ?, modality = ?, schedule = ?, location = ?,
        teacher = ?, teachers = ?, duration = ?, price = ?, requirements = ?, objective = ?,
        methodology = ?, finalProject = ?, whatsappGroup = ?, level = ?, modules = ?,
        status = ?, category = ?, maxStudents = ?, showOnHome = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ? AND schoolId = ?`,
      args: [
        title, subtitle, description, image, badge, slug,
        startDate, enrollmentDeadline, modality, schedule, location,
        teacher, JSON.stringify(teachers || []), duration, price, requirements, objective,
        methodology, finalProject, whatsappGroup, level, JSON.stringify(modules || []),
        status, category, maxStudents, showOnHome ? 1 : 0,
        id, schoolId
      ]
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] PUT /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, showOnHome, schoolId = 'savio' } = body

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

    await turso.execute({
      sql: `UPDATE courses SET showOnHome = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND schoolId = ?`,
      args: [showOnHome ? 1 : 0, id, schoolId]
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] PATCH /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to patch course' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, schoolId = 'savio' } = body

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

    await turso.execute({
      sql: 'DELETE FROM courses WHERE id = ? AND schoolId = ?',
      args: [id, schoolId]
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
