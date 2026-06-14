import { NextResponse } from 'next/server'
import { turso, initializeSchema } from '@/lib/turso-client'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    await initializeSchema()
    
    const hashedPassword = await bcrypt.hash('admin', 10)
    
    // Actualizar admin para villada
    await turso.execute({
      sql: 'UPDATE admin_users SET email = ?, passwordHash = ?, name = ? WHERE schoolId = ?',
      args: ['sea', hashedPassword, 'SEA Admin', 'villada']
    })
    
    return NextResponse.json({
      success: true,
      message: 'Admin actualizado exitosamente',
      email: 'sea',
      password: 'admin',
      url: 'https://www.portalsea.com.ar/villada/admin'
    })
  } catch (error) {
    console.error('[v0] Error setup admin:', error)
    return NextResponse.json({ error: 'Error al actualizar admin' }, { status: 500 })
  }
}
