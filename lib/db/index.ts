import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool, types } from 'pg'
import * as schema from './schema'

// Tell pg to parse JSONB (oid 3802) and JSON (oid 114) back as plain JS objects
types.setTypeParser(114,  (val: string) => JSON.parse(val))
types.setTypeParser(3802, (val: string) => JSON.parse(val))

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })
