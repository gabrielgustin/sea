'use server'

import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { nanoid } from 'nanoid'

export async function getCourses() {
  return db.select().from(courses).orderBy(courses.createdAt)
}

export async function getCourseBySlug(slug: string) {
  // slug coincide con el id en la DB
  const result = await db.select().from(courses).where(eq(courses.id, slug))
  return result[0] ?? null
}

export async function getCourseById(id: string) {
  const result = await db.select().from(courses).where(eq(courses.id, id))
  return result[0] ?? null
}

export async function createCourse(data: Omit<typeof courses.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  const id = nanoid()
  await db.insert(courses).values({ ...data, id })
  revalidatePath('/')
  revalidatePath('/catalogo-formaciones')
  return id
}

export async function updateCourse(id: string, data: Partial<typeof courses.$inferInsert>) {
  await db.update(courses).set({ ...data, updatedAt: new Date() }).where(eq(courses.id, id))
  revalidatePath('/')
  revalidatePath('/catalogo-formaciones')
  revalidatePath(`/cursos/${id}`)
}

export async function deleteCourse(id: string) {
  await db.delete(courses).where(eq(courses.id, id))
  revalidatePath('/')
  revalidatePath('/catalogo-formaciones')
}
