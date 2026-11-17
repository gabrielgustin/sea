import 'server-only'
import { NextResponse } from 'next/server'
import { getTenant } from '@/lib/tenants/registry'
import { clientFor } from '@/lib/tenants/db'
import { getSession, type Session } from './session'
import type { Client } from '@libsql/client'
import type { Tenant } from '@/lib/tenants/types'

type Ctx = { tenant: Tenant; db: Client; session: Session | null }
type Params = { params: Promise<{ tenant: string }> }

// Envoltorio de las rutas /api/[tenant]/...: resuelve el cliente, su base y su sesión.
// `admin: true` exige sesión de administrador de ESE cliente (401 si no).
export function route(
  handler: (req: Request, ctx: Ctx) => Promise<Response>,
  opts: { admin?: boolean } = {},
) {
  return async (req: Request, { params }: Params): Promise<Response> => {
    try {
      const { tenant: slug } = await params
      const tenant = await getTenant(slug)
      if (!tenant) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
      const session = await getSession(slug)
      if (opts.admin && session?.role !== 'admin') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }
      return await handler(req, { tenant, db: clientFor(tenant), session })
    } catch (error) {
      console.error('[api]', req.method, new URL(req.url).pathname, error)
      return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
  }
}
