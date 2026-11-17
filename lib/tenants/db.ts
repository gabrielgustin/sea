import 'server-only'
import { createClient, type Client } from '@libsql/client'
import { notFound } from 'next/navigation'
import { getTenant } from './registry'
import type { Tenant } from './types'

const clients = new Map<string, Client>()

function clientFor(t: Tenant): Client {
  const key = `${t.slug}|${t.dbUrl}`
  let c = clients.get(key)
  if (!c) {
    c = createClient({ url: t.dbUrl, authToken: t.dbToken || undefined })
    clients.set(key, c)
  }
  return c
}

// Punto único de acceso a datos: la base del cliente que pide la ruta. 404 si el cliente no existe.
export async function tenantDb(slug: string): Promise<{ tenant: Tenant; db: Client }> {
  const tenant = await getTenant(slug)
  if (!tenant) notFound()
  return { tenant, db: clientFor(tenant) }
}

export { clientFor }
