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
}) {
  try {
    console.log('[v0] SERVER ACTION: submitEnrollment called with:', {
      schoolId: data.schoolId,
      courseId: data.courseId,
      courseName: data.courseName,
      nombre: data.nombre,
      email: data.email,
      commission: data.commissionName,
    });

    // 1. Check capacity and insert enrollment into Turso directly
    try {
      console.log('[v0] STEP 1: Checking capacity and inserting to Turso...');
      // Get current enrollment count for this commission
      const countResult = await turso.execute(
        `SELECT COUNT(*) as count FROM enrollments WHERE schoolId = ? AND courseId = ? AND commissionId = ?`,
        [data.schoolId, data.courseId, data.commissionId || 'default']
      )
      const currentCount = (countResult.rows[0] as any)?.count ?? 0
      console.log('[v0] Current enrollment count:', currentCount);
      
      // Get max capacity from course
      const courseResult = await turso.execute(
        `SELECT commissions FROM courses WHERE id = ?`,
        [data.courseId]
      )
      const course = courseResult.rows[0] as any
      const commissions = course?.commissions ? JSON.parse(course.commissions) : []
      const commission = commissions.find((c: any) => c.id === data.commissionId)
      const maxCapacity = commission?.maxCapacity ?? 999
      console.log('[v0] Max capacity:', maxCapacity);

      if (currentCount >= maxCapacity) {
        console.error('[v0] Commission is full!');
        throw new Error('Commission is full')
      }

      // Insert enrollment
      console.log('[v0] Inserting enrollment into Turso...');
      await turso.execute(
        `INSERT INTO enrollments (schoolId, courseId, courseName, commissionId, commissionName, nombre, apellido, email, telefono, dni) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        ]
      )
      console.log('[v0] ✓ Enrollment saved to Turso successfully');
    } catch (tursoError) {
      console.error('[v0] ✗ Turso enrollment error:', tursoError)
      throw tursoError
    }

    // 2. Send to Google Sheets — direct POST with redirect:follow (same pattern as working project)
    try {
      console.log('[v0] STEP 2: Sending to Google Sheets...');
      const webhookUrls: Record<string, string> = {
        savio:   'https://script.google.com/macros/s/AKfycbwlXGof6GY00Husss84Skv5cYj2xS7lvYj_BQFXH7IWzSyhSpoxaVHsDdpSBZsFHLqkKg/exec',
        villada: 'https://script.google.com/macros/s/AKfycbwAAagIsSVYGZjwQCv4x-YIhymHQZ4OIoxi4jhPQKxpdYq8yQKBHoy_vLcboKjojvUn8w/exec',
      }
      const webhookUrl = webhookUrls[data.schoolId]

      if (!webhookUrl) {
        console.error('[v0] ✗ No webhook URL found for schoolId:', data.schoolId)
      } else {
        console.log('[v0] Found webhook URL for schoolId:', data.schoolId);
        const now = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
        const payload = {
          timestamp: now,
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          telefono: data.telefono,
          dni: data.dni,
          curso: data.courseName,
          comision: data.commissionName || 'Sin comisión',
        }

        console.log('[v0] Posting to Apps Script with payload:', JSON.stringify(payload));

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          redirect: 'follow',
        })

        const responseText = await response.text()
        console.log('[v0] ✓ Apps Script response status:', response.status);
        console.log('[v0] Apps Script response body:', responseText.substring(0, 300));
      }
    } catch (gsError) {
      console.error('[v0] ✗ Failed to send to Google Sheets:', gsError)
      // Don't throw — enrollment is already saved in Turso
    }

    console.log('[v0] ✓✓✓ ENROLLMENT COMPLETE ✓✓✓');
    revalidatePath(`/${data.schoolId}/admin`)
  } catch (error) {
    console.error('[v0] ✗✗✗ ERROR submitting enrollment:', error)
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
