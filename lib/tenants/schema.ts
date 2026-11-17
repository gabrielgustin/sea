import type { Client } from '@libsql/client'

// Migraciones versionadas del esquema de CADA cliente. Solo se agregan al final; nunca se editan las ya aplicadas.
// Cada base de cliente guarda en `_migrations` cuáles aplicó, así `migrateTenant` es seguro de repetir.
export const MIGRATIONS: { id: string; sql: string[] }[] = [
  {
    id: '001_base',
    sql: [
      `CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT, description TEXT, image TEXT, badge TEXT,
        slug TEXT UNIQUE,
        startDate TEXT, enrollmentDeadline TEXT, modality TEXT, schedule TEXT, location TEXT,
        teacher TEXT, teachers TEXT, duration TEXT, price TEXT, requirements TEXT, objective TEXT,
        methodology TEXT, finalProject TEXT, whatsappGroup TEXT,
        level TEXT DEFAULT 'PRINCIPIANTE', modules TEXT, status TEXT DEFAULT 'ACTIVE', category TEXT,
        maxStudents INTEGER, showOnHome INTEGER DEFAULT 0, commissions TEXT DEFAULT '[]',
        sortOrder INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS carousel_slides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL, subtitle TEXT, description TEXT, image TEXT, badge TEXT,
        ctaText TEXT, ctaLink TEXT,
        slideDuration TEXT, slideModality TEXT, slideStart TEXT, slideBadge TEXT,
        active INTEGER DEFAULT 1, "order" INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, description TEXT, image TEXT,
        whatsapp TEXT, linkedin TEXT, instagram TEXT, tiktok TEXT, youtube TEXT,
        courseId TEXT, "order" INTEGER DEFAULT 0, active INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY, value TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        courseId TEXT NOT NULL, courseName TEXT NOT NULL, commissionId TEXT, commissionName TEXT,
        nombre TEXT NOT NULL, apellido TEXT NOT NULL, email TEXT NOT NULL, telefono TEXT NOT NULL, dni TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(courseId, commissionId)`,
      `CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT, apellido TEXT, email TEXT, telefono TEXT, dni TEXT,
        courseId TEXT, courseName TEXT, status TEXT DEFAULT 'pending', paymentStatus TEXT DEFAULT 'pending', notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE INDEX IF NOT EXISTS idx_students_dni ON students(dni)`,
      `CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT, email TEXT, telefono TEXT, mensaje TEXT, read INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS interest_forms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        courseId TEXT, courseName TEXT, nombre TEXT, email TEXT, telefono TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS job_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT, apellido TEXT, email TEXT, telefono TEXT, dni TEXT, titulo TEXT,
        especialidad TEXT, experiencia TEXT, motivacion TEXT, status TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      // password_hash: bcrypt. Nunca texto plano.
      `CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE, name TEXT, password_hash TEXT NOT NULL, active INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
    ],
  },
]

export async function migrateTenant(db: Client): Promise<string[]> {
  await db.execute(`CREATE TABLE IF NOT EXISTS _migrations (id TEXT PRIMARY KEY, appliedAt DATETIME DEFAULT CURRENT_TIMESTAMP)`)
  const done = new Set((await db.execute('SELECT id FROM _migrations')).rows.map((r) => String(r.id)))
  const applied: string[] = []
  for (const m of MIGRATIONS) {
    if (done.has(m.id)) continue
    await db.batch([...m.sql.map((sql) => ({ sql, args: [] })), { sql: 'INSERT INTO _migrations (id) VALUES (?)', args: [m.id] }], 'write')
    applied.push(m.id)
  }
  return applied
}
