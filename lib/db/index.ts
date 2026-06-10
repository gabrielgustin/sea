import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle(sql, { schema })

// Backwards-compat: code that uses pool.query(text, params)
// Uses sql.query() which is the correct API for parameterized calls in @neondatabase/serverless
export const pool = {
  query: async (text: string, values?: any[]) => {
    const result = await sql.query(text, values ?? [])
    return { rows: result.rows ?? result }
  },
}
