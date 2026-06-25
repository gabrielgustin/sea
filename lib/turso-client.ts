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
        commissions TEXT DEFAULT '[]',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        schoolId TEXT NOT NULL DEFAULT 'savio',
        courseId TEXT NOT NULL,
        courseName TEXT NOT NULL,
        commissionId TEXT,
        commissionName TEXT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        email TEXT NOT NULL,
        telefono TEXT NOT NULL,
        dni TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
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
        slideDuration TEXT,
        slideModality TEXT,
        slideStart TEXT,
        slideBadge TEXT,
        active BOOLEAN DEFAULT 1,
        "order" INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL,
        value TEXT,
        schoolId TEXT NOT NULL DEFAULT 'savio',
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(key, schoolId)
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
      await turso.execute(`ALTER TABLE courses ADD COLUMN commissions TEXT DEFAULT '[]'`)
    } catch (_) {}
    try {
      await turso.execute(`ALTER TABLE carousel_slides ADD COLUMN description TEXT`)
    } catch (_) {}
    try {
      await turso.execute(`ALTER TABLE carousel_slides ADD COLUMN slideDuration TEXT`)
    } catch (_) {}
    try {
      await turso.execute(`ALTER TABLE carousel_slides ADD COLUMN slideModality TEXT`)
    } catch (_) {}
    try {
      await turso.execute(`ALTER TABLE carousel_slides ADD COLUMN slideStart TEXT`)
    } catch (_) {}
    try {
      await turso.execute(`ALTER TABLE carousel_slides ADD COLUMN slideBadge TEXT`)
    } catch (_) {}
    try {
      await turso.execute(`ALTER TABLE teachers ADD COLUMN schoolId TEXT NOT NULL DEFAULT 'savio'`)
    } catch (_) {}
    try {
      await turso.execute(`ALTER TABLE courses ADD COLUMN sortOrder INTEGER DEFAULT 0`)
    } catch (_) {}

    // Fix UNIQUE(slug) → UNIQUE(slug, schoolId) so savio and villada can share slug names.
    // SQLite does not support DROP CONSTRAINT, so we recreate the table.
    try {
      // First check if courses_old exists (failed migration cleanup)
      try {
        const oldExists = await turso.execute(`SELECT COUNT(*) as cnt FROM courses_old`)
        if (oldExists.rows && oldExists.rows.length > 0) {
          console.log('[v0] Found courses_old from failed migration, restoring...')
          // Restore from backup
          const oldData = await turso.execute(`SELECT * FROM courses_old`)
          for (const row of oldData.rows || []) {
            try {
              await turso.execute(
                `INSERT INTO courses (id, schoolId, title, subtitle, description, image, badge, slug, startDate, enrollmentDeadline, modality, schedule, location, teacher, teachers, duration, price, requirements, objective, methodology, finalProject, whatsappGroup, level, modules, status, category, maxStudents, showOnHome, commissions, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [row.id, row.schoolId, row.title, row.subtitle, row.description, row.image, row.badge, row.slug, row.startDate, row.enrollmentDeadline, row.modality, row.schedule, row.location, row.teacher, row.teachers, row.duration, row.price, row.requirements, row.objective, row.methodology, row.finalProject, row.whatsappGroup, row.level, row.modules, row.status, row.category, row.maxStudents, row.showOnHome, row.commissions, row.createdAt, row.updatedAt]
              )
            } catch (insertErr) {
              console.error('[v0] Error restoring row:', row.id, insertErr)
            }
          }
          await turso.execute(`DROP TABLE courses_old`)
          console.log('[v0] Restored courses from backup')
        }
      } catch (_) {}
      
      // Now check if migration is needed
      const info = await turso.execute(`PRAGMA index_list(courses)`)
      const hasCompositeSlug = (info.rows || []).some((r: any) =>
        String(r.name || '').toLowerCase().includes('slug') && String(r.name || '').toLowerCase().includes('school')
      )
      if (!hasCompositeSlug) {
        // Check if the old unique index on slug alone exists
        const oldIdx = (info.rows || []).find((r: any) =>
          String(r.name || '').toLowerCase().includes('slug')
        )
        if (oldIdx) {
          console.log('[v0] Starting courses table migration: UNIQUE(slug) → UNIQUE(slug, schoolId)')
          // Save all data before recreating
          const courseData = await turso.execute(`SELECT * FROM courses`)
          const recordCount = (courseData.rows || []).length
          
          // Rename old table
          await turso.execute(`ALTER TABLE courses RENAME TO courses_old`)
          
          // Create new table with correct constraint
          await turso.execute(`
            CREATE TABLE courses (
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
              commissions TEXT DEFAULT '[]',
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              UNIQUE(slug, schoolId)
            )
          `)
          
          // Copy data row by row
          let successCount = 0
          for (const row of courseData.rows || []) {
            try {
              await turso.execute(
                `INSERT INTO courses (id, schoolId, title, subtitle, description, image, badge, slug, startDate, enrollmentDeadline, modality, schedule, location, teacher, teachers, duration, price, requirements, objective, methodology, finalProject, whatsappGroup, level, modules, status, category, maxStudents, showOnHome, commissions, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [row.id, row.schoolId, row.title, row.subtitle, row.description, row.image, row.badge, row.slug, row.startDate, row.enrollmentDeadline, row.modality, row.schedule, row.location, row.teacher, row.teachers, row.duration, row.price, row.requirements, row.objective, row.methodology, row.finalProject, row.whatsappGroup, row.level, row.modules, row.status, row.category, row.maxStudents, row.showOnHome, row.commissions, row.createdAt, row.updatedAt]
              )
              successCount++
            } catch (copyErr) {
              console.error('[v0] Failed to copy course row:', row.id, copyErr)
            }
          }
          
          await turso.execute(`DROP TABLE courses_old`)
          console.log(`[v0] Migrated ${successCount}/${recordCount} courses: UNIQUE(slug) → UNIQUE(slug, schoolId)`)
        }
      }
    } catch (migErr) {
      console.error('[v0] courses slug migration error:', migErr)
    }

    console.log('[v0] Turso schema initialized successfully')
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log('[v0] Schema already exists')
    } else {
      console.error('[v0] Error initializing Turso schema:', error)
    }
  }
}
