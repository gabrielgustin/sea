import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

/**
 * Get database URL for a specific school
 * @param schoolId - 'villada' or 'savio'
 * @returns DATABASE_URL string
 */
export function getDbUrl(schoolId: string): string {
  if (schoolId === 'villada') {
    return process.env.DATABASE_URL!
  }
  if (schoolId === 'savio') {
    return process.env.DATABASE_URL_SAVIO!
  }
  throw new Error(`Unknown school: ${schoolId}`)
}

/**
 * Get drizzle DB instance for a specific school
 * @param schoolId - 'villada' or 'savio'
 * @returns drizzle db instance
 */
export function getDb(schoolId: string) {
  const dbUrl = getDbUrl(schoolId)
  const sql = neon(dbUrl)
  return drizzle(sql, { schema })
}

/**
 * Get pool instance (for raw queries) for a specific school
 * @param schoolId - 'villada' or 'savio'
 * @returns pool object with query method
 */
export function getPool(schoolId: string) {
  const dbUrl = getDbUrl(schoolId)
  const sql = neon(dbUrl)
  return {
    query: async (text: string, values?: any[]) => {
      const result = await sql.query(text, values ?? [])
      return { rows: result.rows ?? result }
    },
  }
}
