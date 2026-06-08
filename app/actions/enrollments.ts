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
  // Guardar inscripción
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

  revalidatePath('/admin')
}

export async function getEnrollments() {
  return db.select().from(enrollments).orderBy(enrollments.createdAt)
}
