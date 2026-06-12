'use server'

import { db } from '@/lib/db'
import { students } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getStudents() {
  return db.select().from(students).orderBy(students.createdAt)
}

export async function getStudentByDni(dni: string) {
  const result = await db.select().from(students).where(eq(students.dni, dni))
  return result[0] ?? null
}

export async function createStudent(data: Omit<typeof students.$inferInsert, 'id' | 'createdAt'>) {
  const result = await db.insert(students).values(data).returning()
  revalidatePath('/villada/admin')
  return result[0]
}

export async function updateStudent(id: number, data: Partial<typeof students.$inferInsert>) {
  await db.update(students).set(data).where(eq(students.id, id))
  revalidatePath('/villada/admin')
}

export async function deleteStudent(id: number) {
  await db.delete(students).where(eq(students.id, id))
  revalidatePath('/villada/admin')
}
