import { NextRequest, NextResponse } from 'next/server'

const hasTurso = () => !!process.env.TURSO_CONNECTION_URL && !!process.env.TURSO_AUTH_TOKEN

// In-memory fallback store (resets on server restart)
const memoryStore: Record<string, any[]> = {}
function getStore(schoolId: string) {
  if (!memoryStore[schoolId]) memoryStore[schoolId] = []
  return memoryStore[schoolId]
}

async function getTurso() {
  const { turso, initializeSchema } = await import('@/lib/turso-client')
  await initializeSchema()
  return turso
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId') || 'savio'
    const slug = searchParams.get('slug')

    const mapRow = (row: any) => ({
      ...row,
      modules: row.modules ? JSON.parse(row.modules as string) : [],
      teachers: row.teachers ? JSON.parse(row.teachers as string) : [],
      commissions: row.commissions ? JSON.parse(row.commissions as string) : [],
      showOnHome: Boolean(row.showOnHome),
    })

    if (hasTurso()) {
      const turso = await getTurso()

      // Single course by slug or id
      if (slug) {
        const result = await turso.execute(
          'SELECT * FROM courses WHERE schoolId = ? AND (slug = ? OR id = ?) LIMIT 1',
          [schoolId, slug, slug]
        )
        let course = result.rows?.[0] ? mapRow(result.rows[0]) : null
        
        // Fetch associated teachers from teachers table
        if (course) {
          const teachersResult = await turso.execute(
            'SELECT id, name, description, image, whatsapp, linkedin FROM teachers WHERE courseId = ? AND active = 1 ORDER BY "order" ASC',
            [course.id]
          )
          course.teachers = (teachersResult.rows || []).map((row: any) => ({
            name: row.name,
            description: row.description,
            photo: row.image,
            whatsapp: row.whatsapp,
            linkedin: row.linkedin,
          }))
        }
        return NextResponse.json({ course })
      }

      // All courses for this school
      const result = await turso.execute(
        'SELECT * FROM courses WHERE schoolId = ? ORDER BY createdAt DESC',
        [schoolId]
      )
      
      // Fetch teachers for each course
      const courses = await Promise.all((result.rows || []).map(async (courseRow: any) => {
        const course = mapRow(courseRow)
        const teachersResult = await turso.execute(
          'SELECT id, name, description, image, whatsapp, linkedin FROM teachers WHERE courseId = ? AND active = 1 ORDER BY "order" ASC',
          [course.id]
        )
        course.teachers = (teachersResult.rows || []).map((row: any) => ({
          name: row.name,
          description: row.description,
          photo: row.image,
          whatsapp: row.whatsapp,
          linkedin: row.linkedin,
        }))
        return course
      }))
      
      return NextResponse.json({ courses })
    }

    // Fallback: in-memory
    const store = getStore(schoolId)
    if (slug) {
      const course = store.find((c: any) => c.slug === slug || c.id === slug) ?? null
      return NextResponse.json({ course })
    }
    return NextResponse.json({ courses: store })
  } catch (error) {
    console.error('[v0] GET /api/courses error:', error)
    return NextResponse.json({ courses: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const schoolId = body.schoolId || 'savio'
    const id = body.id || `course_${Date.now()}`
    const modulesJson = JSON.stringify(body.modules || [])
    const teachersJson = JSON.stringify(body.teachers || [])
    const commissionsJson = JSON.stringify(body.commissions || [])

    if (hasTurso()) {
      const turso = await getTurso()
      await turso.execute(
        `INSERT INTO courses (id, schoolId, title, subtitle, description, image, badge, slug, startDate, enrollmentDeadline, modality, schedule, location, teacher, teachers, duration, price, requirements, objective, methodology, finalProject, whatsappGroup, level, modules, showOnHome, commissions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, schoolId, body.title || '', body.subtitle || '',
          body.description || '', body.image || '', body.badge || '',
          body.slug || '', body.startDate || '', body.enrollmentDeadline || '',
          body.modality || '', body.schedule || '',
          body.location || 'ITS Savio, Valle Escondido',
          body.teacher || '', teachersJson,
          body.duration || '6 meses', body.price || '',
          body.requirements || '', body.objective || '',
          body.methodology || '', body.finalProject || '',
          body.whatsappGroup || '', body.level || 'PRINCIPIANTE',
          modulesJson, body.showOnHome ? 1 : 0, commissionsJson,
        ]
      )
      return NextResponse.json({ success: true, id })
    }

    // Fallback: in-memory
    const store = getStore(schoolId)
    store.unshift({ ...body, id, modules: body.modules || [], teachers: body.teachers || [] })
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('[v0] POST /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, schoolId = 'savio', ...updatedData } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    if (hasTurso()) {
      const turso = await getTurso()
      const allowed = ['title','subtitle','description','image','badge','slug','startDate','enrollmentDeadline','modality','schedule','location','teacher','teachers','duration','price','requirements','objective','methodology','finalProject','whatsappGroup','level','modules','showOnHome','commissions']
      const data = { ...updatedData }
      if (data.modules) data.modules = JSON.stringify(data.modules)
      if (data.teachers) data.teachers = JSON.stringify(data.teachers)
      if (data.commissions) data.commissions = JSON.stringify(data.commissions)
      if (typeof data.showOnHome === 'boolean') data.showOnHome = data.showOnHome ? 1 : 0
      const fields = Object.keys(data).filter(k => allowed.includes(k))
      if (fields.length === 0) return NextResponse.json({ success: true })
      const setClause = fields.map(f => `${f} = ?`).join(', ')
      // Update by id only — also set schoolId in case the row was created with wrong school
      const values = [...fields.map(k => data[k]), schoolId, id]
      await turso.execute(`UPDATE courses SET ${setClause}, schoolId = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`, values)
      return NextResponse.json({ success: true })
    }

    // Fallback: in-memory
    const store = getStore(schoolId)
    const idx = store.findIndex(c => c.id === id)
    if (idx >= 0) store[idx] = { ...store[idx], ...updatedData }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] PUT /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to update course', detail: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, schoolId = 'savio' } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    if (hasTurso()) {
      const turso = await getTurso()
      await turso.execute('DELETE FROM courses WHERE id = ? AND schoolId = ?', [id, schoolId])
      return NextResponse.json({ success: true })
    }

    // Fallback: in-memory
    const store = getStore(schoolId)
    const idx = store.findIndex(c => c.id === id)
    if (idx >= 0) store.splice(idx, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
