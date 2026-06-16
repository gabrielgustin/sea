'use server'

import { revalidatePath } from 'next/cache'

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
    // Persist enrollment via API route (handles capacity check + Turso insert)
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'

    const enrollResponse = await fetch(`${baseUrl}/api/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schoolId: data.schoolId,
        courseId: data.courseId,
        courseName: data.courseName,
        commissionId: data.commissionId,
        commissionName: data.commissionName,
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono,
        dni: data.dni,
        metodoPago: data.metodoPago || 'No especificado',
      }),
    })

    if (!enrollResponse.ok) {
      const errorData = await enrollResponse.json()
      throw new Error(errorData.error || 'Failed to save enrollment')
    }

    // Send to Google Sheets
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

      const gsResponse = await fetch(`${baseUrl}/api/google-sheets/append`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: data.schoolId,
          values: sheetValues,
        }),
      })

      if (!gsResponse.ok) {
        const gsError = await gsResponse.json()
        console.error('[v0] Google Sheets error:', gsError)
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
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/enrollments?schoolId=${schoolId}`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return data.enrollments || []
  } catch (error) {
    console.error('[v0] Error getting enrollments:', error)
    return []
  }
}
