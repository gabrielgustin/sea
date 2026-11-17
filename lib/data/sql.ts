import type { Client, InValue } from '@libsql/client'

export type Row = Record<string, unknown>

// UPDATE solo con las columnas permitidas (lista blanca); ignora el resto del payload.
export async function updateById(
  db: Client,
  table: string,
  id: string | number,
  data: Row,
  allowed: readonly string[],
  extra = '',
) {
  const fields = Object.keys(data).filter((k) => allowed.includes(k) && data[k] !== undefined)
  if (fields.length === 0) return
  const set = fields.map((f) => `"${f}" = ?`).join(', ')
  await db.execute({
    sql: `UPDATE ${table} SET ${set}${extra} WHERE id = ?`,
    args: [...fields.map((f) => data[f] as InValue), id],
  })
}

export const bool = (v: unknown) => (v === true || v === 1 || v === '1' ? 1 : 0)
export const json = (v: unknown, fallback: unknown) => JSON.stringify(v ?? fallback)
export const parseJson = <T>(v: unknown, fallback: T): T => {
  try {
    return v ? (JSON.parse(String(v)) as T) : fallback
  } catch {
    return fallback
  }
}
