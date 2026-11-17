import 'server-only'
import { notFound } from 'next/navigation'
import { connect, type Db } from './pg'
import { getTenant } from './registry'
import type { Tenant } from './types'

const clients = new Map<string, Db>()

export function clientFor(t: Tenant): Db {
  const key = `${t.slug}|${t.dbUrl}`
  let c = clients.get(key)
  if (!c) clients.set(key, (c = connect(t.dbUrl)))
  return c
}

// Punto único de acceso a datos: la base del cliente que pide la ruta. 404 si el cliente no existe.
export async function tenantDb(slug: string): Promise<{ tenant: Tenant; db: Db }> {
  const tenant = await getTenant(slug)
  if (!tenant) notFound()
  return { tenant, db: clientFor(tenant) }
}
