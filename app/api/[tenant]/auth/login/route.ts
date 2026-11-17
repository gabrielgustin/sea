import { NextResponse } from 'next/server'
import { route } from '@/lib/auth/guard'
import { setSession } from '@/lib/auth/session'
import { hashPassword, verifyPassword } from '@/lib/auth/password'

// Hash válido para gastar el mismo tiempo cuando el usuario no existe (no revela qué emails existen).
const DUMMY = hashPassword('dummy-password')

// Límite simple de intentos por IP+cliente. shortcut: en memoria por instancia; pasar a tabla/Redis si hay abuso real.
const attempts = new Map<string, { n: number; reset: number }>()
function tooMany(key: string) {
  const now = Date.now()
  const a = attempts.get(key)
  if (!a || a.reset < now) { attempts.set(key, { n: 1, reset: now + 15 * 60_000 }); return false }
  a.n += 1
  return a.n > 10
}

export const POST = route(async (req, { db, tenant }) => {
  const { role, username, password } = await req.json()
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
  if (tooMany(`${tenant.slug}|${ip}`)) return NextResponse.json({ success: false, error: 'Demasiados intentos. Probá en unos minutos.' }, { status: 429 })
  const user = String(username ?? '').trim().toLowerCase()
  const pass = String(password ?? '')
  if (!user || !pass) return NextResponse.json({ success: false, error: 'Usuario y contraseña requeridos' }, { status: 400 })

  if (role === 'student') {
    // Mismo criterio que antes: el DNI es usuario y contraseña. Ahora se valida en el servidor y no se expone la lista de alumnos.
    if (user !== pass.toLowerCase()) return NextResponse.json({ success: false, error: 'El usuario y la contraseña deben ser el mismo (tu DNI)' }, { status: 401 })
    const res = await db.execute({ sql: 'SELECT id, "courseName" FROM students WHERE dni = ? LIMIT 1', args: [user] })
    const s = res.rows[0]
    if (!s) return NextResponse.json({ success: false, error: 'DNI no encontrado en el sistema' }, { status: 401 })
    await setSession({ tenant: tenant.slug, role: 'student', sub: String(s.id), dni: user, course: String(s.courseName ?? '') })
    return NextResponse.json({ success: true, role: 'student', dni: user, course: s.courseName ?? '' })
  }

  const res = await db.execute({ sql: 'SELECT id, password_hash FROM admins WHERE email = ? AND active = true LIMIT 1', args: [user] })
  const a = res.rows[0]
  const ok = await verifyPassword(pass, a ? String(a.password_hash) : await DUMMY)
  if (!a || !ok) return NextResponse.json({ success: false, error: 'Credenciales incorrectas' }, { status: 401 })
  await setSession({ tenant: tenant.slug, role: 'admin', sub: String(a.id) })
  return NextResponse.json({ success: true, role: 'admin', redirectUrl: `/${tenant.slug}/admin` })
})
