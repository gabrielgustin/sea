import 'server-only'
import { cache } from 'react'
import { controlDb } from './control'
import type { Tenant, PublicTenant } from './types'

// Slug válido: letras minúsculas, números y guiones. Evita choques con rutas como /api o /_next.
const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,40}$/
const RESERVED = new Set(['api', 'admin', '_next', 'static', 'public', 'favicon'])

export function isValidSlug(slug: string) {
  return SLUG_RE.test(slug) && !RESERVED.has(slug)
}

// shortcut: caché en memoria 30 s por instancia; subir a revalidación por tag si hay cientos de clientes.
const TTL_MS = 30_000
const mem = new Map<string, { at: number; tenant: Tenant | null }>()

function rowToTenant(r: Record<string, any>): Tenant { // eslint-disable-line @typescript-eslint/no-explicit-any
  return {
    slug: String(r.slug),
    name: String(r.name),
    dbUrl: String(r.db_url),
    config: typeof r.config === 'string' ? JSON.parse(r.config || '{}') : (r.config ?? {}),
    active: Boolean(r.active),
  }
}

async function load(slug: string): Promise<Tenant | null> {
  const hit = mem.get(slug)
  if (hit && Date.now() - hit.at < TTL_MS) return hit.tenant
  const res = await controlDb().execute({ sql: 'SELECT * FROM tenants WHERE slug = ? LIMIT 1', args: [slug] })
  const tenant = res.rows[0] ? rowToTenant(res.rows[0]) : null
  mem.set(slug, { at: Date.now(), tenant })
  return tenant
}

// cache() de React: una sola consulta por request aunque la llamen layout y página.
export const getTenant = cache(async (slug: string): Promise<Tenant | null> => {
  if (!isValidSlug(slug)) return null
  const t = await load(slug)
  return t && t.active ? t : null
})

export async function listTenants(): Promise<Tenant[]> {
  const res = await controlDb().execute('SELECT * FROM tenants WHERE active = true ORDER BY slug')
  return res.rows.map(rowToTenant)
}

export function toPublic(t: Tenant): PublicTenant {
  const { enrollmentWebhook: _omit, ...config } = t.config
  return { slug: t.slug, name: t.name, config }
}
