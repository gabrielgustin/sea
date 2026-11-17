import 'server-only'
import { createClient, type Client } from '@libsql/client'

// Base de control: la lista de clientes (tenants) y cómo conectarse a la base de cada uno.
let control: Client | null = null

export function controlDb(): Client {
  if (control) return control
  const url = process.env.CONTROL_DB_URL
  if (!url) throw new Error('Falta CONTROL_DB_URL (base de control de clientes)')
  control = createClient({ url, authToken: process.env.CONTROL_DB_TOKEN || undefined })
  return control
}

export async function ensureControlSchema(db: Client = controlDb()) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tenants (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      db_url TEXT NOT NULL,
      db_token TEXT,
      config TEXT NOT NULL DEFAULT '{}',
      active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
}
