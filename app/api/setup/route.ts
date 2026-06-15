import { NextResponse } from 'next/server'
import { turso } from '@/lib/turso-client'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const email = 'savio@sea-admin.local'
    const passwordHash = await bcrypt.hash('savio', 10)

    // Try simple update first - if it doesn't exist it won't error
    try {
      await turso.execute({
        sql: `UPDATE admin_users SET passwordHash = ?, name = ?, schoolId = ? WHERE email = ?`,
        args: [passwordHash, 'Savio', 'savio', email],
      })
    } catch (e) {
      console.error('[v0] Update failed:', e)
    }

    // Then insert or ignore if exists
    try {
      await turso.execute({
        sql: `INSERT OR IGNORE INTO admin_users (name, email, passwordHash, schoolId) VALUES (?, ?, ?, ?)`,
        args: ['Savio', email, passwordHash, 'savio'],
      })
    } catch (e) {
      console.error('[v0] Insert failed:', e)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user created/updated. Usuario: savio, Contraseña: savio' 
    })
  } catch (error: any) {
    console.error('[v0] Setup error:', error)
    return NextResponse.json({ error: String(error?.message ?? error) }, { status: 500 })
  }
}
