'use server'

import { db } from '@/lib/db'
import { enrollments, students } from '@/lib/db/schema'
import { revalidatePath } from 'next/cache'

export async function submitEnrollment(data: {
  courseId: string
  courseName: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  dni: string
  metodoPago?: string
}) {
  // Guardar inscripción en BD Neon
  await db.insert(enrollments).values({ ...data, status: 'pending' })

  // También crear o actualizar el estudiante en la tabla students
  await db.insert(students).values({
    nombre: data.nombre,
    apellido: data.apellido,
    email: data.email,
    telefono: data.telefono,
    dni: data.dni,
    courseId: data.courseId,
    courseName: data.courseName,
    status: 'pending',
    paymentStatus: 'pending',
  })

  // Guardar en Google Sheets
  try {
    const now = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
    const sheetValues = [
      now,
      data.nombre,
      data.apellido,
      data.email,
      data.telefono,
      data.dni,
      data.courseName,
      data.metodoPago || 'No especificado',
    ]

    await fetch(new URL('/api/google-sheets/append', process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000').toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: sheetValues }),
    })
  } catch (error) {
    console.error('[v0] Failed to append to Google Sheets:', error)
    // No lanzar error aquí - la inscripción ya se guardó en la BD
  }

  revalidatePath('/admin')
}

export async function getEnrollments() {
  return db.select().from(enrollments).orderBy(enrollments.createdAt)
}
