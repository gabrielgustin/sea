import { createClient } from '@libsql/client'

let tursoClient: any = null

function getTursoClient() {
  if (tursoClient) return tursoClient

  const connectionUrl = process.env.TURSO_CONNECTION_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!connectionUrl || !authToken) {
    throw new Error('Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN environment variables')
  }

  tursoClient = createClient({
    url: connectionUrl,
    authToken: authToken,
  })

  return tursoClient
}

export const turso = {
  execute: (sql: any, args?: any) => getTursoClient().execute(sql, args),
}

// Initialize database schema on first connection
export async function initializeSchema() {
  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        schoolId TEXT NOT NULL DEFAULT 'savio',
        title TEXT NOT NULL,
        subtitle TEXT,
        description TEXT,
        image TEXT,
        badge TEXT,
        slug TEXT,
        startDate TEXT,
        enrollmentDeadline TEXT,
        modality TEXT,
        schedule TEXT,
        location TEXT,
        teacher TEXT,
        teachers TEXT,
        duration TEXT,
        price TEXT,
        requirements TEXT,
        objective TEXT,
        methodology TEXT,
        finalProject TEXT,
        whatsappGroup TEXT,
        level TEXT DEFAULT 'PRINCIPIANTE',
        modules TEXT,
        status TEXT DEFAULT 'ACTIVE',
        category TEXT,
        maxStudents INTEGER,
        showOnHome BOOLEAN DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS carousel_slides (
        id TEXT PRIMARY KEY,
        schoolId TEXT NOT NULL DEFAULT 'savio',
        title TEXT NOT NULL,
        description TEXT,
        image TEXT,
        ctaLink TEXT,
        active BOOLEAN DEFAULT 1,
        "order" INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS teachers (
        id TEXT PRIMARY KEY,
        schoolId TEXT NOT NULL DEFAULT 'savio',
        name TEXT NOT NULL,
        description TEXT,
        image TEXT,
        linkedin TEXT,
        whatsapp TEXT,
        courseId TEXT,
        "order" INTEGER DEFAULT 0,
        active INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Add schoolId column to existing tables if missing (migration)
    try {
      await turso.execute(`ALTER TABLE courses ADD COLUMN schoolId TEXT NOT NULL DEFAULT 'savio'`)
    } catch (_) {}
    try {
      await turso.execute(`ALTER TABLE carousel_slides ADD COLUMN schoolId TEXT NOT NULL DEFAULT 'savio'`)
    } catch (_) {}
    try {
      await turso.execute(`ALTER TABLE teachers ADD COLUMN schoolId TEXT NOT NULL DEFAULT 'savio'`)
    } catch (_) {}

    console.log('[v0] Turso schema initialized successfully')
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log('[v0] Schema already exists')
    } else {
      console.error('[v0] Error initializing Turso schema:', error)
    }
  }
}
