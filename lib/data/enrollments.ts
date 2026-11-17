import type { Client } from '@libsql/client'
import { parseJson } from './sql'

export type EnrollmentInput = {
  courseId: string; courseName: string; commissionId?: string | null; commissionName?: string | null
  nombre: string; apellido: string; email: string; telefono: string; dni: string
}

export async function commissionCounts(db: Client, courseId: string) {
  const res = await db.execute({
    sql: 'SELECT commissionId, COUNT(*) AS count FROM enrollments WHERE courseId = ? GROUP BY commissionId',
    args: [courseId],
  })
  const counts: Record<string, number> = {}
  for (const r of res.rows) if (r.commissionId) counts[String(r.commissionId)] = Number(r.count)
  return counts
}

export class CommissionFullError extends Error {}

export async function createEnrollment(db: Client, e: EnrollmentInput) {
  if (e.commissionId) {
    const [count, course] = await Promise.all([
      db.execute({ sql: 'SELECT COUNT(*) AS c FROM enrollments WHERE courseId = ? AND commissionId = ?', args: [e.courseId, e.commissionId] }),
      db.execute({ sql: 'SELECT commissions FROM courses WHERE id = ?', args: [e.courseId] }),
    ])
    const commissions = parseJson<{ id: string; maxCapacity: number }[]>(course.rows[0]?.commissions, [])
    const max = commissions.find((c) => c.id === e.commissionId)?.maxCapacity
    if (max !== undefined && Number(count.rows[0]?.c ?? 0) >= max) throw new CommissionFullError()
  }
  const res = await db.execute({
    sql: `INSERT INTO enrollments (courseId, courseName, commissionId, commissionName, nombre, apellido, email, telefono, dni, status)
          VALUES (?,?,?,?,?,?,?,?,?, 'pending')`,
    args: [e.courseId, e.courseName, e.commissionId || null, e.commissionName || null, e.nombre, e.apellido, e.email, e.telefono, e.dni],
  })
  return String(res.lastInsertRowid)
}

export async function listEnrollments(db: Client) {
  return (await db.execute('SELECT * FROM enrollments ORDER BY createdAt DESC')).rows
}
