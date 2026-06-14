'use server'

import { pool } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getStudents() {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY createdAt DESC')
    return result.rows || []
  } catch (error) {
    console.error('[v0] Error getting students:', error)
    return []
  }
}

export async function getStudentByDni(dni: string) {
  try {
    const result = await pool.query('SELECT * FROM students WHERE dni = ? LIMIT 1', [dni])
    return result.rows?.[0] ?? null
  } catch (error) {
    console.error('[v0] Error getting student by DNI:', error)
    return null
  }
}

export async function createStudent(data: any) {
  try {
    const fields = Object.keys(data).filter(k => data[k] !== undefined)
    const placeholders = fields.map(() => '?').join(', ')
    const values = fields.map(k => data[k])
    
    const query = `INSERT INTO students (${fields.join(', ')}) VALUES (${placeholders})`
    const result = await pool.query(query, values)
    
    revalidatePath('/savio/admin')
    return result.rows?.[0] || data
  } catch (error) {
    console.error('[v0] Error creating student:', error)
    throw error
  }
}

export async function updateStudent(id: number, data: any) {
  try {
    const fields = Object.keys(data).filter(k => data[k] !== undefined)
    const setClause = fields.map(f => `${f} = ?`).join(', ')
    const values = [...fields.map(k => data[k]), id]
    
    const query = `UPDATE students SET ${setClause} WHERE id = ?`
    await pool.query(query, values)
    
    revalidatePath('/savio/admin')
  } catch (error) {
    console.error('[v0] Error updating student:', error)
    throw error
  }
}

export async function deleteStudent(id: number) {
  try {
    await pool.query('DELETE FROM students WHERE id = ?', [id])
    revalidatePath('/savio/admin')
  } catch (error) {
    console.error('[v0] Error deleting student:', error)
    throw error
  }
}
