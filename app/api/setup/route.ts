import { NextResponse } from 'next/server'
import { turso } from '@/lib/turso-client'
import bcrypt from 'bcryptjs'

// One-time endpoint to create the initial admin user for Savio.
// Call GET /api/setup to create/update the admin user credentials.
export async function GET() {
  // Temporarily open to allow initial user creation in production
  // if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_SETUP) {
  //   return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  // }
  try {
    // Ensure admin_users table exists
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        schoolId TEXT DEFAULT 'savio',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const email = 'savio@sea-admin.local'
    const passwordHash = await bcrypt.hash('savio', 10)

    // Check if user already exists
    const existing = await turso.execute({
      sql: 'SELECT id FROM admin_users WHERE email = ? LIMIT 1',
      args: [email],
    })

    if (existing.rows && existing.rows.length > 0) {
      // Update password in case it changed
      await turso.execute({
        sql: 'UPDATE admin_users SET passwordHash = ?, name = ? WHERE email = ?',
        args: [passwordHash, 'Savio', email],
      })
      return NextResponse.json({ success: true, message: 'Admin user updated. Usuario: savio, Contraseña: savio' })
    }

    // Create new user
    const id = `admin_${Date.now()}`
    await turso.execute({
      sql: 'INSERT INTO admin_users (id, name, email, passwordHash, role, schoolId) VALUES (?, ?, ?, ?, ?, ?)',
      args: [id, 'Savio', email, passwordHash, 'admin', 'savio'],
    })

    return NextResponse.json({ success: true, message: 'Admin user created. Usuario: savio, Contraseña: savio' })
  } catch (error: any) {
    console.error('[v0] Setup error:', error)
    return NextResponse.json({ error: String(error?.message ?? error) }, { status: 500 })
  }
}
