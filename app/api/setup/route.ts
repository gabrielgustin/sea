import { NextResponse } from 'next/server'
import { turso } from '@/lib/turso-client'
import bcrypt from 'bcryptjs'

// One-time endpoint to create the initial admin user for Savio.
// Call GET /api/setup to create/update the admin user credentials.
export async function GET() {
  try {
    const email = 'savio@sea-admin.local'
    const passwordHash = await bcrypt.hash('savio', 10)

    // Check if user already exists
    const checkSql = `SELECT id FROM admin_users WHERE email = '${email.replace(/'/g, "''")}'`
    const existing = await turso.execute(checkSql)

    if (existing.rows && existing.rows.length > 0) {
      // Update password in case it changed
      const updateSql = `UPDATE admin_users SET passwordHash = '${passwordHash.replace(/'/g, "''")}', name = 'Savio', schoolId = 'savio' WHERE email = '${email.replace(/'/g, "''")}'`
      await turso.execute(updateSql)
      return NextResponse.json({ success: true, message: 'Admin user updated. Usuario: savio, Contraseña: savio' })
    }

    // Create new user - let id auto-increment since it's INTEGER PRIMARY KEY
    const insertSql = `INSERT INTO admin_users (name, email, passwordHash, schoolId) VALUES ('Savio', '${email.replace(/'/g, "''")}', '${passwordHash.replace(/'/g, "''")}', 'savio')`
    await turso.execute(insertSql)

    return NextResponse.json({ success: true, message: 'Admin user created. Usuario: savio, Contraseña: savio' })
  } catch (error: any) {
    console.error('[v0] Setup error:', error)
    return NextResponse.json({ error: String(error?.message ?? error) }, { status: 500 })
  }
}
