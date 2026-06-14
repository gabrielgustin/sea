// Re-export from turso-client for backwards compatibility
export { turso } from '@/lib/turso-client'

// pool/db shims - kept for any legacy code that still uses pool.query()
import { turso } from '@/lib/turso-client'

export const pool = {
  query: async (text: string, values?: any[]) => {
    const result = await turso.execute({ sql: text, args: values ?? [] })
    return { rows: result.rows ?? [] }
  },
}

export const db = pool
