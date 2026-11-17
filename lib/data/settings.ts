import type { Client } from '@libsql/client'

export async function getSettings(db: Client): Promise<Record<string, string>> {
  const res = await db.execute('SELECT key, value FROM site_settings')
  return Object.fromEntries(res.rows.map((r) => [String(r.key), String(r.value ?? '')]))
}

export async function saveSettings(db: Client, settings: Record<string, unknown>) {
  await db.batch(
    Object.entries(settings).map(([key, value]) => ({
      sql: 'INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = CURRENT_TIMESTAMP',
      args: [key, String(value)],
    })),
    'write',
  )
}
