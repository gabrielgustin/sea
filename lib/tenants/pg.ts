import { neon } from '@neondatabase/serverless'

// Capa mínima sobre Neon (Postgres por HTTP). Sin estado ni conexiones que mantener: sirve igual en serverless.
// Escribir SQL con `?` como marcador; acá se convierte a $1, $2… (se ignoran los `?` dentro de textos entre comillas simples).
export type Row = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
export type Stmt = string | { sql: string; args?: unknown[] }
export interface Db {
  execute(stmt: Stmt): Promise<{ rows: Row[] }>
  // Todas las sentencias en una sola transacción: o se aplican todas o ninguna.
  batch(stmts: Stmt[]): Promise<void>
}

function toPg(sql: string): string {
  let n = 0
  let out = ''
  let inStr = false
  for (const ch of sql) {
    if (ch === "'") inStr = !inStr
    out += ch === '?' && !inStr ? `$${++n}` : ch
  }
  return out
}

const norm = (s: Stmt) =>
  typeof s === 'string' ? { text: toPg(s), args: [] as unknown[] } : { text: toPg(s.sql), args: s.args ?? [] }

// Fechas como texto ISO: así los datos pasan tal cual de servidor a navegador y a JSON.
const clean = (rows: Row[]): Row[] =>
  rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v instanceof Date ? v.toISOString() : v])))

export function connect(url: string): Db {
  const sql = neon(url)
  return {
    async execute(stmt) {
      const { text, args } = norm(stmt)
      return { rows: clean((await sql.query(text, args as never[])) as Row[]) }
    },
    async batch(stmts) {
      const list = stmts.map(norm)
      await sql.transaction(list.map((s) => sql.query(s.text, s.args as never[])))
    },
  }
}
