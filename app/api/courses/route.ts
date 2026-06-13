import { NextRequest, NextResponse } from 'next/server'
import { turso, initializeSchema } from '@/lib/turso-client'

export async function GET(request: NextRequest) {
  try {
    // Initialize schema on first request
    await initializeSchema()

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (slug) {
      // Get specific course by slug
      const result = await turso.execute({
        sql: 'SELECT * FROM courses WHERE slug = ? LIMIT 1',
        args: [slug]
      })

      if (result.rows.length === 0) {
        return NextResponse.json({ course: null }, { status: 404 })
      }

      const course = result.rows[0]
      const mapped = {
        id: course.id,
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
        teachers: course.teachers ? JSON.parse(course.teachers) : [],
        duration: course.duration || '',
        price: course.price || '',
        requirements: course.requirements || '',
        objective: course.objective || '',
        methodology: course.methodology || '',
        finalProject: course.finalProject || '',
        whatsappGroup: course.whatsappGroup || '',
        level: course.level || 'PRINCIPIANTE',
        modules: course.modules ? JSON.parse(course.modules) : [],
        status: course.status,
        category: course.category,
        maxStudents: course.maxStudents,
        showOnHome: Boolean(course.showOnHome),
      }

      // Get linked teachers
      const teachersResult = await turso.execute({
        sql: 'SELECT * FROM teachers WHERE courseId = ? ORDER BY order ASC',
        args: [course.id]
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
      // Get all courses ordered by createdAt
      const result = await turso.execute('SELECT * FROM courses ORDER BY createdAt DESC')

      const courses = result.rows.map((c) => ({
        id: c.id,
        title: c.title,
        subtitle: c.subtitle || '',
        description: c.description,
        image: c.image || '',
        badge: c.badge,
        startDate: c.startDate || '',
        enrollmentDeadline: c.enrollmentDeadline || '',
        modality: c.modality || c.badge,
        slug: c.slug || c.id,
        schedule: c.schedule || '',
        location: c.location || '',
        teacher: c.teacher || '',
        teachers: c.teachers ? JSON.parse(c.teachers) : [],
        duration: c.duration || '',
        price: c.price || '',
        requirements: c.requirements || '',
        objective: c.objective || '',
        methodology: c.methodology || '',
        finalProject: c.finalProject || '',
        whatsappGroup: c.whatsappGroup || '',
        level: c.level || 'PRINCIPIANTE',
        modules: c.modules ? JSON.parse(c.modules) : [],
        status: c.status,
        category: c.category,
        maxStudents: c.maxStudents,
        showOnHome: Boolean(c.showOnHome),
      }))

      return NextResponse.json(courses)
    }
  } catch (error) {
    console.error('[v0] GET /api/courses error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title, subtitle, description, image, badge, slug,
      startDate, enrollmentDeadline, modality, schedule, location,
      teacher, teachers, duration, price, requirements, objective,
      methodology, finalProject, whatsappGroup, level, modules,
      status, category, maxStudents, showOnHome
    } = body

    const id = `course_${Date.now()}`

    await turso.execute({
      sql: `INSERT INTO courses 
        (id, title, subtitle, description, image, badge, slug, startDate, 
         enrollmentDeadline, modality, schedule, location, teacher, teachers, 
         duration, price, requirements, objective, methodology, finalProject, 
         whatsappGroup, level, modules, status, category, maxStudents, showOnHome) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, title, subtitle, description, image, badge, slug, startDate,
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
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}
