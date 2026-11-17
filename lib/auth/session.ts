import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

// Sesión en cookie httpOnly firmada con HMAC. Una cookie por cliente (nombre con el slug),
// así iniciar sesión en /savio nunca da acceso a /villada.
export type Session = { tenant: string; role: 'admin' | 'student'; sub: string; dni?: string; course?: string; exp: number }

const MAX_AGE = 60 * 60 * 24 * 7
const cookieName = (tenant: string) => `sea_${tenant}`

function secret() {
  const s = process.env.SESSION_SECRET
  if (!s || s.length < 32) throw new Error('SESSION_SECRET debe tener al menos 32 caracteres')
  return s
}
const sign = (body: string) => createHmac('sha256', secret()).update(body).digest('base64url')

export function encode(s: Omit<Session, 'exp'>): string {
  const body = Buffer.from(JSON.stringify({ ...s, exp: Date.now() + MAX_AGE * 1000 })).toString('base64url')
  return `${body}.${sign(body)}`
}

export function decode(token: string | undefined, tenant: string): Session | null {
  if (!token) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expected = sign(body)
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  try {
    const s = JSON.parse(Buffer.from(body, 'base64url').toString()) as Session
    return s.tenant === tenant && s.exp > Date.now() ? s : null
  } catch {
    return null
  }
}

export async function getSession(tenant: string): Promise<Session | null> {
  return decode((await cookies()).get(cookieName(tenant))?.value, tenant)
}

export async function setSession(s: Omit<Session, 'exp'>) {
  ;(await cookies()).set(cookieName(s.tenant), encode(s), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export async function clearSession(tenant: string) {
  ;(await cookies()).delete(cookieName(tenant))
}
