import { createClient } from '@libsql/client'

let tursoClient: any = null

function getTursoClient() {
  if (tursoClient) return tursoClient

  const connectionUrl = process.env.TURSO_CONNECTION_URL
  const authToken = process.env.TURSO_AUTH_TOKEN_RW || process.env.TURSO_AUTH_TOKEN

  if (!connectionUrl || !authToken) {
    throw new Error('Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN environment variables')
  }

  tursoClient = createClient({ url: connectionUrl, authToken })
  return tursoClient
}

export const turso = {
  execute: async (query: { sql: string; args?: any[] } | string, args?: any[]) => {
    try {
      const client = getTursoClient()
      if (typeof query === 'string') {
        return await client.execute({ sql: query, args: args ?? [] })
      }
      return await client.execute(query)
    } catch (error: any) {
      console.error('[v0] Turso query error:', error.message)
      return { rows: [] }
    }
  },
}

let schemaInitialized = false

export async function initializeSchema() {
  if (schemaInitialized) return
  try {
    const client = getTursoClient()

    // Add schoolId column to existing tables if it doesn't exist yet
    const addSchoolIdIfMissing = async (table: string) => {
      try {
        await client.execute(`ALTER TABLE ${table} ADD COLUMN schoolId TEXT NOT NULL DEFAULT 'villada'`)
        // Set all existing rows to 'villada'
        await client.execute(`UPDATE ${table} SET schoolId = 'villada' WHERE schoolId IS NULL OR schoolId = ''`)
        console.log(`[v0] Added schoolId to ${table}`)
      } catch {
        // Column already exists, that's fine
      }
    }

    await addSchoolIdIfMissing('courses')
    await addSchoolIdIfMissing('carousel_slides')
    await addSchoolIdIfMissing('teachers')
    await addSchoolIdIfMissing('students')
    await addSchoolIdIfMissing('site_settings')
    await addSchoolIdIfMissing('admin_users')

    // Create tables that may not exist yet for multi-school support
    await client.execute(`
      CREATE TABLE IF NOT EXISTS admin_users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        schoolId TEXT NOT NULL DEFAULT 'villada',
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        passwordHash TEXT NOT NULL,
        active INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    schemaInitialized = true
    console.log('[v0] Schema initialized successfully')
  } catch (error: any) {
    console.error('[v0] Error initializing schema:', error.message)
  }
}
