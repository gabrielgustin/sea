import { createClient } from '@libsql/client'

const connectionUrl = process.env.TURSO_CONNECTION_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!connectionUrl || !authToken) {
  console.error('Error: Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN')
  process.exit(1)
}

const db = createClient({
  url: connectionUrl,
  authToken: authToken,
})

async function initializeDatabase() {
  try {
    console.log('[v0] Connecting to Turso...')

    // Create courses table
    console.log('[v0] Creating courses table...')
    await db.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        description TEXT,
        image TEXT,
        badge TEXT,
        slug TEXT UNIQUE,
        startDate TEXT,
        modality TEXT,
        schedule TEXT,
        location TEXT,
        teacher TEXT,
        duration TEXT,
        price TEXT,
        level TEXT DEFAULT 'PRINCIPIANTE',
        status TEXT DEFAULT 'ACTIVE',
        showOnHome BOOLEAN DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create carousel table
    console.log('[v0] Creating carousel table...')
    await db.execute(`
      CREATE TABLE IF NOT EXISTS carousel (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image TEXT,
        active BOOLEAN DEFAULT 1,
        \`order\` INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create teachers table
    console.log('[v0] Creating teachers table...')
    await db.execute(`
      CREATE TABLE IF NOT EXISTS teachers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        image TEXT,
        courseId TEXT,
        \`order\` INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('[v0] ✅ Tables created successfully!')

    // Add sample data
    console.log('[v0] Adding sample data...')
    
    await db.execute(`
      INSERT OR IGNORE INTO courses (id, title, subtitle, description, image, slug, startDate, modality, schedule, location, teacher, duration, price, level, status, showOnHome)
      VALUES (
        'course-001',
        'Diseño e Impresión 3D',
        'Aprende a diseñar e imprimir modelos en 3D',
        'Curso completo de diseño e impresión 3D desde cero. Aprende modelado, preparación de archivos y printing.',
        '/images/3d-design.jpg',
        'diseno-3d',
        '2024-07-01',
        'Presencial',
        'Lunes a Viernes 18:00-20:00',
        'Centro de Innovación',
        'Prof. Carlos',
        '8 semanas',
        '$500',
        'INTERMEDIO',
        'ACTIVE',
        1
      )
    `)

    await db.execute(`
      INSERT OR IGNORE INTO carousel (id, title, description, image, active, \`order\`)
      VALUES (
        'carousel-001',
        'Nuevas Formaciones',
        'Descubre nuestros cursos disponibles para este semestre',
        '/images/carousel-1.jpg',
        1,
        0
      )
    `)

    console.log('[v0] ✅ Sample data added!')

    // Verify data
    console.log('[v0] Verifying tables...')
    const tables = await db.execute(`SELECT name FROM sqlite_master WHERE type='table'`)
    console.log('[v0] Tables in Turso:')
    tables.rows.forEach(row => console.log(`  - ${row.name}`))

    const courseCount = await db.execute(`SELECT COUNT(*) as count FROM courses`)
    console.log(`[v0] Courses: ${courseCount.rows[0].count}`)

    const carouselCount = await db.execute(`SELECT COUNT(*) as count FROM carousel`)
    console.log(`[v0] Carousel slides: ${carouselCount.rows[0].count}`)

    console.log('[v0] ✅ Database initialization complete!')
  } catch (error) {
    console.error('[v0] Error:', error.message)
    process.exit(1)
  }
}

initializeDatabase()
