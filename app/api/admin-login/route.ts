import { NextRequest, NextResponse } from 'next/server'
import { turso, initializeSchema } from '@/lib/turso-client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, schoolId = 'villada' } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Usuario y contraseña requeridos' }, { status: 400 })
    }

    await initializeSchema()

    const result = await turso.execute({
      sql: 'SELECT * FROM admin_users WHERE email = ? AND schoolId = ? LIMIT 1',
      args: [email.toLowerCase(), schoolId]
    })
    const user = result.rows?.[0]

    if (!user) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash as string)

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      name: user.name,
      email: user.email,
      redirectUrl: `/${schoolId}/admin`
    })
  } catch (error) {
    console.error('[v0] Admin login error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
