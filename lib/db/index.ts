import { createClient } from '@libsql/client'

let tursoClient: any = null

function getTursoClient() {
  if (tursoClient) return tursoClient

  const connectionUrl = process.env.TURSO_CONNECTION_URL
  // Support both TURSO_AUTH_TOKEN and TURSO_AUTH_TOKEN_RW (Vercel integration naming)
  const authToken = process.env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN_RW

  if (!connectionUrl || !authToken) {
    console.warn('[v0] Missing Turso credentials - Turso API calls will fail. Set TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN.')
    return null
  }

  tursoClient = createClient({
    url: connectionUrl,
    authToken: authToken,
  })

  return tursoClient
}

// Turso client wrapper
export const turso = {
  execute: (sql: any, args?: any) => {
    const client = getTursoClient()
    if (!client) {
      throw new Error('Turso client not initialized - missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN environment variables')
    }
    return client.execute(sql, args)
  },
}

// Backwards-compat: code that uses db.query(text, params)
export const db = {
  query: async (text: string, values?: any[]) => {
    const client = getTursoClient()
    if (!client) {
      throw new Error('Turso client not initialized - missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN environment variables')
    }
    const result = await client.execute(text, values ?? [])
    return { rows: result.rows ?? result }
  },
}

// Backwards-compat: code that uses pool.query(text, params)
export const pool = {
  query: async (text: string, values?: any[]) => {
    const client = getTursoClient()
    if (!client) {
      throw new Error('Turso client not initialized - missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN environment variables')
    }
    const result = await client.execute(text, values ?? [])
    return { rows: result.rows ?? result }
  },
}
