'use server'

import { db } from '@/lib/db'
import { interestForms } from '@/lib/db/schema'

export async function submitInterestForm(data: {
  courseId: string
  courseName: string
  nombre: string
  email: string
  telefono?: string
}) {
  await db.insert(interestForms).values(data)
}

export async function getInterestForms() {
  return db.select().from(interestForms).orderBy(interestForms.createdAt)
}
