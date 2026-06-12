import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminUsers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Usuario y contraseña requeridos' }, { status: 400 })
    }

    const users = await db.select().from(adminUsers).where(eq(adminUsers.email, email.toLowerCase()))
    const user = users[0]

    if (!user) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash)

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    return NextResponse.json({ success: true, name: user.name, email: user.email, redirectUrl: '/villada/admin' })
  } catch (error) {
    console.error('[v0] Admin login error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
