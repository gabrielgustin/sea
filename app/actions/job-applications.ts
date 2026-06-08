'use server'

import { db } from '@/lib/db'
import { jobApplications } from '@/lib/db/schema'
import { revalidatePath } from 'next/cache'

export async function submitJobApplication(data: {
  nombre: string
  apellido: string
  email: string
  telefono?: string
  dni?: string
  titulo?: string
  especialidad?: string
  experiencia?: string
  motivacion?: string
}) {
  await db.insert(jobApplications).values({ ...data, status: 'pending' })
  revalidatePath('/admin')
}

export async function getJobApplications() {
  return db.select().from(jobApplications).orderBy(jobApplications.createdAt)
}
