import { createClient } from '@libsql/client'

let tursoClient: any = null

function getTursoClient() {
  if (tursoClient) return tursoClient

  const connectionUrl = process.env.TURSO_CONNECTION_URL
  const authToken = process.env.TURSO_AUTH_TOKEN_RW || process.env.TURSO_AUTH_TOKEN

  if (!connectionUrl || !authToken) {
    throw new Error('Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN environment variables')
  }

  tursoClient = createClient({
    url: connectionUrl,
    authToken: authToken,
  })

  return tursoClient
}

// Turso client wrapper
export const turso = {
  execute: (sql: any, args?: any) => getTursoClient().execute(sql, args),
}

// Backwards-compat: code that uses db.query(text, params)
export const db = {
  query: async (text: string, values?: any[]) => {
    const result = await getTursoClient().execute(text, values ?? [])
    return { rows: result.rows ?? result }
  },
}

// Backwards-compat: code that uses pool.query(text, params)
export const pool = {
  query: async (text: string, values?: any[]) => {
    const result = await getTursoClient().execute(text, values ?? [])
    return { rows: result.rows ?? result }
  },
}
