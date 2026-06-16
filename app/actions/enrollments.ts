'use server'

import { revalidatePath } from 'next/cache'
import { turso } from '@/lib/turso-client'

export async function submitEnrollment(data: {
  schoolId: string
  courseId: string
  courseName: string
  commissionId?: string
  commissionName?: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  dni: string
  metodoPago?: string
}) {
  try {
    console.log('[v0] Submitting enrollment:', { courseId: data.courseId, email: data.email, commission: data.commissionName })

    // 1. Check capacity and insert enrollment into Turso directly
    try {
      // Get current enrollment count for this commission
      const countResult = await turso.execute(
        `SELECT COUNT(*) as count FROM enrollments WHERE schoolId = ? AND courseId = ? AND commissionId = ?`,
        [data.schoolId, data.courseId, data.commissionId || 'default']
      )
      const currentCount = (countResult.rows[0] as any)?.count ?? 0
      
      // Get max capacity from course
      const courseResult = await turso.execute(
        `SELECT commissions FROM courses WHERE id = ?`,
        [data.courseId]
      )
      const course = courseResult.rows[0] as any
      const commissions = course?.commissions ? JSON.parse(course.commissions) : []
      const commission = commissions.find((c: any) => c.id === data.commissionId)
      const maxCapacity = commission?.maxCapacity ?? 999

      if (currentCount >= maxCapacity) {
        throw new Error('Commission is full')
      }

      // Insert enrollment
      console.log('[v0] Inserting enrollment into Turso:', { currentCount, maxCapacity })
      await turso.execute(
        `INSERT INTO enrollments (schoolId, courseId, courseName, commissionId, commissionName, nombre, apellido, email, telefono, dni, metodoPago) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.schoolId,
          data.courseId,
          data.courseName,
          data.commissionId || 'default',
          data.commissionName || 'Sin comisión',
          data.nombre,
          data.apellido,
          data.email,
          data.telefono,
          data.dni,
          data.metodoPago || 'No especificado',
        ]
      )
      console.log('[v0] Enrollment saved to Turso successfully')
    } catch (tursoError) {
      console.error('[v0] Turso enrollment error:', tursoError)
      throw tursoError
    }

    // 2. Send to Google Sheets (async, non-blocking)
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
        data.commissionName || 'Sin comisión',
        data.metodoPago || 'No especificado',
      ]

      console.log('[v0] Sending to Google Sheets:', { schoolId: data.schoolId, values: sheetValues })

      const gsResponse = await fetch(
        process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/api/google-sheets/append`
          : 'http://localhost:3000/api/google-sheets/append',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schoolId: data.schoolId,
            values: sheetValues,
          }),
        }
      )

      const gsData = await gsResponse.json()
      console.log('[v0] Google Sheets response:', gsResponse.status, gsData)

      if (!gsResponse.ok) {
        console.error('[v0] Google Sheets error:', gsData)
      }
    } catch (gsError) {
      console.error('[v0] Failed to send to Google Sheets:', gsError)
      // Don't throw — enrollment is already saved
    }

    revalidatePath(`/${data.schoolId}/admin`)
  } catch (error) {
    console.error('[v0] Error submitting enrollment:', error)
    throw error
  }
}

export async function getEnrollments(schoolId = 'savio') {
  try {
    const result = await turso.execute(
      `SELECT * FROM enrollments WHERE schoolId = ? ORDER BY createdAt DESC`,
      [schoolId]
    )
    return (result.rows || []).map((row: any) => ({
      ...row,
      createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
    }))
  } catch (error) {
    console.error('[v0] Error getting enrollments:', error)
    return []
  }
}
