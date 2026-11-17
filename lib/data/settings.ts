import type { Db } from '@/lib/tenants/pg'

export async function getSettings(db: Db): Promise<Record<string, string>> {
  const res = await db.execute('SELECT key, value FROM site_settings')
  return Object.fromEntries(res.rows.map((r) => [String(r.key), String(r.value ?? '')]))
}

export async function saveSettings(db: Db, settings: Record<string, unknown>) {
  const entries = Object.entries(settings)
  if (!entries.length) return
  await db.batch(
    entries.map(([key, value]) => ({
      sql: 'INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, "updatedAt" = now()',
      args: [key, String(value)],
    })),
  )
}
