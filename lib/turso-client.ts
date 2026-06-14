import { createClient } from '@libsql/client'

let tursoClient: any = null

function getTursoClient() {
  if (tursoClient) return tursoClient

  const connectionUrl = process.env.TURSO_CONNECTION_URL
  const authToken = process.env.TURSO_AUTH_TOKEN_RW || process.env.TURSO_AUTH_TOKEN

  console.log('[v0] getTursoClient: TURSO_CONNECTION_URL =', connectionUrl ? '✓' : '✗')
  console.log('[v0] getTursoClient: TURSO_AUTH_TOKEN_RW =', process.env.TURSO_AUTH_TOKEN_RW ? '✓' : '✗')
  console.log('[v0] getTursoClient: TURSO_AUTH_TOKEN =', process.env.TURSO_AUTH_TOKEN ? '✓' : '✗')

  if (!connectionUrl || !authToken) {
    throw new Error('Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN environment variables')
  }

  tursoClient = createClient({ url: connectionUrl, authToken })
  return tursoClient
}

export const turso = {
  execute: (sql: any, args?: any) => getTursoClient().execute(sql, args),
}

// Initialize database schema - all tables have schoolId column
export async function initializeSchema() {
  try {
    const client = getTursoClient()

    await client.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        schoolId TEXT NOT NULL DEFAULT 'villada',
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

    await client.execute(`
      CREATE TABLE IF NOT EXISTS carousel (
        id TEXT PRIMARY KEY,
        schoolId TEXT NOT NULL DEFAULT 'villada',
        title TEXT NOT NULL,
        description TEXT,
        image TEXT,
        active BOOLEAN DEFAULT 1,
        "order" INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.execute(`
      CREATE TABLE IF NOT EXISTS teachers (
        id TEXT PRIMARY KEY,
        schoolId TEXT NOT NULL DEFAULT 'villada',
        name TEXT NOT NULL,
        description TEXT,
        image TEXT,
        linkedin TEXT,
        whatsapp TEXT,
        courseId TEXT,
        "order" INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.execute(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        schoolId TEXT NOT NULL DEFAULT 'villada',
        nombre TEXT NOT NULL,
        apellido TEXT,
        email TEXT,
        telefono TEXT,
        dni TEXT,
        courseId TEXT,
        courseName TEXT,
        status TEXT DEFAULT 'pending',
        paymentStatus TEXT DEFAULT 'pending',
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT NOT NULL,
        schoolId TEXT NOT NULL DEFAULT 'villada',
        value TEXT NOT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (key, schoolId)
      )
    `)

    await client.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        schoolId TEXT NOT NULL DEFAULT 'villada',
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        passwordHash TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(email, schoolId)
      )
    `)

    await client.execute(`
      CREATE TABLE IF NOT EXISTS carousel_slides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        schoolId TEXT NOT NULL DEFAULT 'villada',
        title TEXT NOT NULL,
        description TEXT,
        image TEXT,
        active INTEGER DEFAULT 1,
        "order" INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Migrate existing data to have schoolId = 'villada' if missing
    await client.execute(`UPDATE courses SET schoolId = 'villada' WHERE schoolId IS NULL OR schoolId = ''`)
    await client.execute(`UPDATE carousel SET schoolId = 'villada' WHERE schoolId IS NULL OR schoolId = ''`)
    await client.execute(`UPDATE teachers SET schoolId = 'villada' WHERE schoolId IS NULL OR schoolId = ''`)
    await client.execute(`UPDATE students SET schoolId = 'villada' WHERE schoolId IS NULL OR schoolId = ''`)
    await client.execute(`UPDATE carousel_slides SET schoolId = 'villada' WHERE schoolId IS NULL OR schoolId = ''`)

    console.log('[v0] Schema initialized successfully')
  } catch (error: any) {
    console.error('[v0] Error initializing schema:', error.message)
  }
}
