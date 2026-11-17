import type { Client } from '@libsql/client'
import { updateById, bool, type Row } from './sql'

// courseId se guarda como arreglo JSON de ids de curso, p. ej. ["5","7"].
export function normalizeCourseIds(courseId: unknown): string | null {
  if (!courseId) return null
  let ids: string[] = []
  if (Array.isArray(courseId)) ids = courseId.map(String)
  else {
    try {
      const p = JSON.parse(String(courseId))
      ids = Array.isArray(p) ? p.map(String) : [String(p)]
    } catch {
      ids = [String(courseId)]
    }
  }
  ids = ids.map((s) => s.trim()).filter(Boolean)
  return ids.length ? JSON.stringify(ids) : null
}

export const courseIdsOf = (v: unknown): string[] => {
  const n = normalizeCourseIds(v)
  return n ? (JSON.parse(n) as string[]) : []
}

export async function listTeachers(db: Client) {
  const res = await db.execute('SELECT * FROM teachers ORDER BY "order" ASC, id ASC')
  return res.rows.map((r) => {
    const courseIds = courseIdsOf(r.courseId)
    return { ...r, id: String(r.id), active: Boolean(r.active), courseId: courseIds.length ? JSON.stringify(courseIds) : null, courseIds }
  })
}

const FIELDS = ['name', 'description', 'image', 'whatsapp', 'linkedin', 'instagram', 'tiktok', 'youtube', 'courseId', 'order', 'active'] as const

export async function createTeacher(db: Client, b: Row) {
  const res = await db.execute({
    sql: 'INSERT INTO teachers (name, description, image, whatsapp, linkedin, instagram, tiktok, youtube, courseId, "order", active) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    args: [
      String(b.name || ''), String(b.description || ''), String(b.image || ''), String(b.whatsapp || ''),
      String(b.linkedin || ''), String(b.instagram || ''), String(b.tiktok || ''), String(b.youtube || ''),
      normalizeCourseIds(b.courseId), Number(b.order ?? 0), b.active === false ? 0 : 1,
    ],
  })
  return String(res.lastInsertRowid)
}

export async function updateTeacher(db: Client, id: string, b: Row) {
  const data: Row = { ...b }
  if ('active' in data) data.active = bool(data.active)
  if ('courseId' in data) data.courseId = normalizeCourseIds(data.courseId)
  await updateById(db, 'teachers', id, data, FIELDS, ', updatedAt = CURRENT_TIMESTAMP')
}

export const deleteTeacher = (db: Client, id: string) => db.execute({ sql: 'DELETE FROM teachers WHERE id = ?', args: [id] })
