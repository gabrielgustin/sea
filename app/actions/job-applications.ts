'use server'

import { pool } from '@/lib/db'
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
  try {
    await pool.query(
      `INSERT INTO job_applications (nombre, apellido, email, telefono, dni, titulo, especialidad, experiencia, motivacion, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [data.nombre, data.apellido, data.email, data.telefono || null, data.dni || null, data.titulo || null, data.especialidad || null, data.experiencia || null, data.motivacion || null]
    )
    revalidatePath('/villada/admin')
  } catch (error) {
    console.error('[v0] Error submitting job application:', error)
    throw error
  }
}

export async function getJobApplications() {
  try {
    const result = await pool.query('SELECT * FROM job_applications ORDER BY createdAt DESC')
    return result.rows || []
  } catch (error) {
    console.error('[v0] Error getting job applications:', error)
    return []
  }
}
