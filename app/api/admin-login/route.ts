import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Usuario y contraseña requeridos' }, { status: 400 })
    }

    // Accept both email format and plain username (e.g. 'savio')
    const emailToSearch = email.includes('@') ? email.toLowerCase() : `${email.toLowerCase()}@sea-admin.local`
    const result = await pool.query(
      'SELECT * FROM admin_users WHERE email = ? LIMIT 1',
      [emailToSearch]
    )
    const user = result.rows?.[0]

    if (!user) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash)

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    return NextResponse.json({ success: true, name: user.name, email: user.email, redirectUrl: '/savio/admin' })
  } catch (error) {
    console.error('[v0] Admin login error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
