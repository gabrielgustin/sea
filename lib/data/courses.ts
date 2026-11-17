import type { Client, InValue } from '@libsql/client'
import { updateById, bool, json, parseJson, type Row } from './sql'
import { courseIdsOf } from './teachers'

const FIELDS = [
  'title', 'subtitle', 'description', 'image', 'badge', 'slug', 'startDate', 'enrollmentDeadline', 'modality',
  'schedule', 'location', 'teacher', 'teachers', 'duration', 'price', 'requirements', 'objective', 'methodology',
  'finalProject', 'whatsappGroup', 'level', 'modules', 'showOnHome', 'commissions',
] as const

type TeacherCard = { name: unknown; description: unknown; photo: unknown; whatsapp: unknown; linkedin: unknown; instagram: unknown; tiktok: unknown; youtube: unknown }

const mapCourse = (r: Row, teachers: TeacherCard[]) => ({
  ...r,
  modules: parseJson(r.modules, []),
  commissions: parseJson(r.commissions, []),
  showOnHome: Boolean(r.showOnHome),
  teachers,
})

// Una sola consulta de docentes para todos los cursos (antes era una por curso).
async function teachersByCourse(db: Client): Promise<Map<string, TeacherCard[]>> {
  const res = await db.execute('SELECT * FROM teachers WHERE active = 1 ORDER BY "order" ASC, id ASC')
  const map = new Map<string, TeacherCard[]>()
  for (const t of res.rows) {
    const card: TeacherCard = {
      name: t.name, description: t.description, photo: t.image, whatsapp: t.whatsapp,
      linkedin: t.linkedin, instagram: t.instagram, tiktok: t.tiktok, youtube: t.youtube,
    }
    for (const cid of courseIdsOf(t.courseId)) map.set(cid, [...(map.get(cid) ?? []), card])
  }
  return map
}

export async function listCourses(db: Client, opts: { homeOnly?: boolean } = {}) {
  const [res, byCourse] = await Promise.all([
    db.execute(`SELECT * FROM courses ${opts.homeOnly ? 'WHERE showOnHome = 1' : ''} ORDER BY sortOrder ASC, createdAt DESC`),
    teachersByCourse(db),
  ])
  return res.rows.map((r) => mapCourse(r, byCourse.get(String(r.id)) ?? []))
}

export async function getCourse(db: Client, slugOrId: string) {
  const res = await db.execute({ sql: 'SELECT * FROM courses WHERE slug = ? OR id = ? LIMIT 1', args: [slugOrId, slugOrId] })
  if (!res.rows[0]) return null
  return mapCourse(res.rows[0], (await teachersByCourse(db)).get(String(res.rows[0].id)) ?? [])
}

export async function createCourse(db: Client, b: Row, defaultLocation = '') {
  const id = String(b.id || `course_${Date.now()}`)
  await db.execute({
    sql: `INSERT INTO courses (id, title, subtitle, description, image, badge, slug, startDate, enrollmentDeadline, modality, schedule, location, teacher, teachers, duration, price, requirements, objective, methodology, finalProject, whatsappGroup, level, modules, showOnHome, commissions)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [
      id, b.title || '', b.subtitle || '', b.description || '', b.image || '', b.badge || '',
      b.slug || id, b.startDate || '', b.enrollmentDeadline || '', b.modality || '', b.schedule || '',
      b.location || defaultLocation, b.teacher || '', json(b.teachers, []), b.duration || '6 meses', b.price || '',
      b.requirements || '', b.objective || '', b.methodology || '', b.finalProject || '', b.whatsappGroup || '',
      b.level || 'PRINCIPIANTE', json(b.modules, []), bool(b.showOnHome), json(b.commissions, []),
    ] as InValue[],
  })
  return id
}

export async function updateCourse(db: Client, id: string, b: Row) {
  const data: Row = { ...b }
  for (const k of ['modules', 'teachers', 'commissions']) if (data[k] !== undefined) data[k] = JSON.stringify(data[k])
  if (data.showOnHome !== undefined) data.showOnHome = bool(data.showOnHome)
  await updateById(db, 'courses', id, data, FIELDS, ', updatedAt = CURRENT_TIMESTAMP')
}

export const deleteCourse = (db: Client, id: string) => db.execute({ sql: 'DELETE FROM courses WHERE id = ?', args: [id] })

export async function reorderCourses(db: Client, orderedIds: string[]) {
  await db.batch(
    orderedIds.map((id, i) => ({ sql: 'UPDATE courses SET sortOrder = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', args: [i, id] })),
    'write',
  )
}
