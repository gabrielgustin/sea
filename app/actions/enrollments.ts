'use server'

import { pool } from '@/lib/db'
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
  try {
    // Guardar inscripción
    await pool.query(
      `INSERT INTO enrollments (courseId, courseName, nombre, apellido, email, telefono, dni, metodoPago, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [data.courseId, data.courseName, data.nombre, data.apellido, data.email, data.telefono, data.dni, data.metodoPago || 'No especificado']
    )

    // También crear o actualizar el estudiante
    await pool.query(
      `INSERT INTO students (nombre, apellido, email, telefono, dni, courseId, courseName, status, paymentStatus) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
      [data.nombre, data.apellido, data.email, data.telefono, data.dni, data.courseId, data.courseName]
    )

    // Guardar en Google Sheets si está configurado
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

      await fetch(
        new URL(
          '/api/google-sheets/append',
          process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
        ).toString(),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: sheetValues }),
        }
      )
    } catch (error) {
      console.error('[v0] Failed to append to Google Sheets:', error)
    }

    revalidatePath('/savio/admin')
  } catch (error) {
    console.error('[v0] Error submitting enrollment:', error)
    throw error
  }
}

export async function getEnrollments() {
  try {
    const result = await pool.query('SELECT * FROM enrollments ORDER BY createdAt DESC')
    return result.rows || []
  } catch (error) {
    console.error('[v0] Error getting enrollments:', error)
    return []
  }
}
