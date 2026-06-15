import { NextResponse } from 'next/server'
import { turso } from '@/lib/turso-client'
import bcrypt from 'bcryptjs'

// One-time endpoint to create the initial admin user for Savio.
// Call GET /api/setup to create/update the admin user credentials.
export async function GET() {
  try {
    // Ensure admin_users table exists with all required columns
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

    // Add missing columns if they don't exist (for existing tables)
    try {
      await turso.execute(`ALTER TABLE admin_users ADD COLUMN role TEXT DEFAULT 'admin'`)
    } catch {
      // Column already exists, ignore
    }

    try {
      await turso.execute(`ALTER TABLE admin_users ADD COLUMN schoolId TEXT DEFAULT 'savio'`)
    } catch {
      // Column already exists, ignore
    }

    const email = 'savio@sea-admin.local'
    const passwordHash = await bcrypt.hash('savio', 10)

    // Check if user already exists
    const checkSql = `SELECT id FROM admin_users WHERE email = '${email.replace(/'/g, "''")}'`
    const existing = await turso.execute(checkSql)

    if (existing.rows && existing.rows.length > 0) {
      // Update password in case it changed
      const updateSql = `UPDATE admin_users SET passwordHash = '${passwordHash.replace(/'/g, "''")}', name = 'Savio' WHERE email = '${email.replace(/'/g, "''")}'`
      await turso.execute(updateSql)
      return NextResponse.json({ success: true, message: 'Admin user updated. Usuario: savio, Contraseña: savio' })
    }

    // Create new user with generated ID
    const id = `admin_${Date.now()}`
    const insertSql = `INSERT INTO admin_users (id, name, email, passwordHash) VALUES ('${id}', 'Savio', '${email.replace(/'/g, "''")}', '${passwordHash.replace(/'/g, "''")}')`
    await turso.execute(insertSql)

    return NextResponse.json({ success: true, message: 'Admin user created. Usuario: savio, Contraseña: savio' })
  } catch (error: any) {
    console.error('[v0] Setup error:', error)
    return NextResponse.json({ error: String(error?.message ?? error) }, { status: 500 })
  }
}
