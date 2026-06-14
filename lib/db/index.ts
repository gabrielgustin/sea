import { createClient } from '@libsql/client'

let tursoClients: Record<string, any> = {}

function getTursoClientForSchool(schoolId: string = 'villada') {
  if (tursoClients[schoolId]) return tursoClients[schoolId]

  let connectionUrl = ''
  let authToken = ''

  if (schoolId === 'savio') {
    connectionUrl = process.env.SAVIO_TURSO_CONNECTION_URL || 'libsql://savio-gabrielgustin.aws-ap-northeast-1.turso.io'
    authToken = process.env.SAVIO_TURSO_AUTH_TOKEN_RW || process.env.SAVIO_TURSO_AUTH_TOKEN
  } else {
    // default to villada
    connectionUrl = process.env.TURSO_CONNECTION_URL || 'libsql://sea-gabrielgustin.aws-ap-northeast-1.turso.io'
    authToken = process.env.TURSO_AUTH_TOKEN_RW || process.env.TURSO_AUTH_TOKEN
  }

  if (!connectionUrl || !authToken) {
    throw new Error(`Missing credentials for ${schoolId} database`)
  }

  tursoClients[schoolId] = createClient({
    url: connectionUrl,
    authToken: authToken,
  })

  return tursoClients[schoolId]
}

// Turso client wrapper - defaults to villada
export const turso = {
  execute: (sql: any, args?: any, schoolId: string = 'villada') => 
    getTursoClientForSchool(schoolId).execute(sql, args),
}

// Backwards-compat: code that uses db.query(text, params)
export const db = {
  query: async (text: string, values?: any[], schoolId: string = 'villada') => {
    const result = await getTursoClientForSchool(schoolId).execute(text, values ?? [])
    return { rows: result.rows ?? result }
  },
}

// Backwards-compat: code that uses pool.query(text, params)
export const pool = {
  query: async (text: string, values?: any[], schoolId: string = 'villada') => {
    const result = await getTursoClientForSchool(schoolId).execute(text, values ?? [])
    return { rows: result.rows ?? result }
  },
}
