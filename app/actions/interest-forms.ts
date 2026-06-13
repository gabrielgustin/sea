'use server'

import { pool } from '@/lib/db'

export async function submitInterestForm(data: {
  courseId: string
  courseName: string
  nombre: string
  email: string
  telefono?: string
}) {
  try {
    await pool.query(
      `INSERT INTO interest_forms (courseId, courseName, nombre, email, telefono) VALUES (?, ?, ?, ?, ?)`,
      [data.courseId, data.courseName, data.nombre, data.email, data.telefono || null]
    )
  } catch (error) {
    console.error('[v0] Error submitting interest form:', error)
    throw error
  }
}

export async function getInterestForms() {
  try {
    const result = await pool.query('SELECT * FROM interest_forms ORDER BY createdAt DESC')
    return result.rows || []
  } catch (error) {
    console.error('[v0] Error getting interest forms:', error)
    return []
  }
}
