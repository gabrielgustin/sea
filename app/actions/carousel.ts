'use server'

import { pool } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getCarouselSlides() {
  try {
    const result = await pool.query(
      'SELECT * FROM carousel_slides WHERE active = 1 ORDER BY `order` ASC'
    )
    return result.rows || []
  } catch (error) {
    console.error('[v0] Error getting carousel slides:', error)
    return []
  }
}

export async function getAllCarouselSlides() {
  try {
    const result = await pool.query(
      'SELECT * FROM carousel_slides ORDER BY `order` ASC'
    )
    return result.rows || []
  } catch (error) {
    console.error('[v0] Error getting all carousel slides:', error)
    return []
  }
}

export async function createCarouselSlide(data: any) {
  try {
    const fields = Object.keys(data).filter(k => data[k] !== undefined)
    const placeholders = fields.map(() => '?').join(', ')
    const values = fields.map(k => data[k])
    
    const query = `INSERT INTO carousel_slides (${fields.join(', ')}) VALUES (${placeholders})`
    await pool.query(query, values)
    
    revalidatePath('/')
  } catch (error) {
    console.error('[v0] Error creating carousel slide:', error)
    throw error
  }
}

export async function updateCarouselSlide(id: number, data: any) {
  try {
    const fields = Object.keys(data).filter(k => data[k] !== undefined)
    const setClause = fields.map(f => `${f} = ?`).join(', ')
    const values = [...fields.map(k => data[k]), id]
    
    const query = `UPDATE carousel_slides SET ${setClause} WHERE id = ?`
    await pool.query(query, values)
    
    revalidatePath('/')
  } catch (error) {
    console.error('[v0] Error updating carousel slide:', error)
    throw error
  }
}

export async function deleteCarouselSlide(id: number) {
  try {
    await pool.query('DELETE FROM carousel_slides WHERE id = ?', [id])
    revalidatePath('/')
  } catch (error) {
    console.error('[v0] Error deleting carousel slide:', error)
    throw error
  }
}
