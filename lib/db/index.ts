import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle(sql, { schema })

// Backwards-compat: code that used `pool.query(sql, params)` now delegates to neon()
export const pool = {
  query: async (text: string, values?: any[]) => {
    const rows = await sql(text, values as any)
    return { rows }
  },
}
