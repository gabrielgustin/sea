import { createClient } from '@libsql/client'

const connectionUrl = process.env.TURSO_CONNECTION_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!connectionUrl || !authToken) {
  throw new Error('Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN environment variables')
}

export const turso = createClient({
  url: connectionUrl,
  authToken: authToken,
})

// Initialize database schema on first connection
export async function initializeSchema() {
  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        description TEXT,
        image TEXT,
        badge TEXT,
        slug TEXT UNIQUE,
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
      CREATE TABLE IF NOT EXISTS carousel (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image TEXT,
        active BOOLEAN DEFAULT 1,
        order INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS teachers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        image TEXT,
        linkedin TEXT,
        whatsapp TEXT,
        courseId TEXT,
        order INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('[v0] Turso schema initialized successfully')
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log('[v0] Schema already exists')
    } else {
      console.error('[v0] Error initializing Turso schema:', error)
    }
  }
}
