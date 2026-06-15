import { NextResponse } from 'next/server'
import { turso } from '@/lib/turso-client'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })
    }

    // Query the admin_users table
    const result = await turso.execute({
      sql: 'SELECT id, name, email, passwordHash FROM admin_users WHERE email = ?',
      args: [email],
    })

    const user = result.rows?.[0]

    if (!user) {
      return NextResponse.json({ success: false, error: 'Credenciales incorrectas' }, { status: 401 })
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.passwordHash as string)

    if (!passwordMatch) {
      return NextResponse.json({ success: false, error: 'Credenciales incorrectas' }, { status: 401 })
    }

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      } 
    })
  } catch (error: any) {
    console.error('[v0] Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Error de conexión. Intenta de nuevo.' },
      { status: 500 }
    )
  }
}
