'use server'

import { pool } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function submitContactMessage(data: {
  nombre: string
  email: string
  telefono?: string
  mensaje: string
}) {
  try {
    await pool.query(
      `INSERT INTO contact_messages (nombre, email, telefono, mensaje) VALUES (?, ?, ?, ?)`,
      [data.nombre, data.email, data.telefono || null, data.mensaje]
    )
  } catch (error) {
    console.error('[v0] Error submitting contact message:', error)
    throw error
  }
}

export async function getContactMessages() {
  try {
    const result = await pool.query(`SELECT * FROM contact_messages ORDER BY createdAt DESC`)
    return result.rows || []
  } catch (error) {
    console.error('[v0] Error getting contact messages:', error)
    return []
  }
}

export async function markMessageRead(id: number) {
  try {
    await pool.query(`UPDATE contact_messages SET read = 1 WHERE id = ?`, [id])
    revalidatePath('/savio/admin')
  } catch (error) {
    console.error('[v0] Error marking message as read:', error)
    throw error
  }
}
