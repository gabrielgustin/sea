import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { turso, initializeSchema } = await import('@/lib/turso-client')
    await initializeSchema()

    const tables = await turso.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    const result: Record<string, any> = { tables: tables.rows.map((r: any) => r.name) }

    for (const row of tables.rows) {
      const tableName = row.name as string
      try {
        const schema = await turso.execute(`PRAGMA table_info(${tableName})`)
        result[tableName] = schema.rows
      } catch (e: any) {
        result[tableName] = { error: e.message }
      }
    }

    // Test INSERT into carousel_slides
    try {
      const testId = `test_${Date.now()}`
      await turso.execute(
        'INSERT INTO carousel_slides (id, schoolId, title, description, image, ctaLink, active, "order") VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [testId, 'test', 'Test Title', '', '', '', 1, 0]
      )
      await turso.execute('DELETE FROM carousel_slides WHERE id = ?', [testId])
      result.carousel_insert_test = 'OK'
    } catch (e: any) {
      result.carousel_insert_test = 'FAIL: ' + e.message
    }

    // Test INSERT into teachers
    try {
      const testId = `test_${Date.now()}`
      await turso.execute(
        'INSERT INTO teachers (id, schoolId, name, description, image, linkedin, whatsapp, courseId, "order", active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [testId, 'test', 'Test Name', '', '', '', '', '', 0, 1]
      )
      await turso.execute('DELETE FROM teachers WHERE id = ?', [testId])
      result.teachers_insert_test = 'OK'
    } catch (e: any) {
      result.teachers_insert_test = 'FAIL: ' + e.message
    }

    // Test INSERT into site_settings
    try {
      await turso.execute(
        `INSERT INTO site_settings (key, schoolId, value) VALUES (?, ?, ?) ON CONFLICT(key, schoolId) DO UPDATE SET value = excluded.value`,
        ['test_key', 'test', 'test_value']
      )
      await turso.execute('DELETE FROM site_settings WHERE key = ? AND schoolId = ?', ['test_key', 'test'])
      result.settings_insert_test = 'OK'
    } catch (e: any) {
      result.settings_insert_test = 'FAIL: ' + e.message
    }

    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ fatal: e.message })
  }
}
