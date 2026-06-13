'use server'

import { pool } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { nanoid } from 'nanoid'

export async function getCourses() {
  try {
    const result = await pool.query('SELECT * FROM courses ORDER BY createdAt DESC')
    return result.rows || []
  } catch (error) {
    console.error('[v0] Error getting courses:', error)
    return []
  }
}

export async function getCourseBySlug(slug: string) {
  try {
    const result = await pool.query('SELECT * FROM courses WHERE slug = ? LIMIT 1', [slug])
    return result.rows?.[0] ?? null
  } catch (error) {
    console.error('[v0] Error getting course by slug:', error)
    return null
  }
}

export async function getCourseById(id: string) {
  try {
    const result = await pool.query('SELECT * FROM courses WHERE id = ? LIMIT 1', [id])
    return result.rows?.[0] ?? null
  } catch (error) {
    console.error('[v0] Error getting course by id:', error)
    return null
  }
}

export async function createCourse(data: any) {
  try {
    const id = nanoid()
    const fields = ['id', ...Object.keys(data).filter(k => data[k] !== undefined)]
    const values = [id, ...fields.slice(1).map(k => data[k])]
    const placeholders = fields.map(() => '?').join(', ')
    
    const query = `INSERT INTO courses (${fields.join(', ')}) VALUES (${placeholders})`
    await pool.query(query, values)
    
    revalidatePath('/')
    revalidatePath('/villada/catalogo-formaciones')
    return id
  } catch (error) {
    console.error('[v0] Error creating course:', error)
    throw error
  }
}

export async function updateCourse(id: string, data: any) {
  try {
    const fields = Object.keys(data).filter(k => data[k] !== undefined)
    const setClause = fields.map(f => `${f} = ?`).join(', ')
    const values = [...fields.map(k => data[k]), id]
    
    const query = `UPDATE courses SET ${setClause}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`
    await pool.query(query, values)
    
    revalidatePath('/')
    revalidatePath('/villada/catalogo-formaciones')
    revalidatePath(`/villada/cursos/${id}`)
  } catch (error) {
    console.error('[v0] Error updating course:', error)
    throw error
  }
}

export async function deleteCourse(id: string) {
  try {
    await pool.query('DELETE FROM courses WHERE id = ?', [id])
    
    revalidatePath('/')
    revalidatePath('/villada/catalogo-formaciones')
  } catch (error) {
    console.error('[v0] Error deleting course:', error)
    throw error
  }
}
