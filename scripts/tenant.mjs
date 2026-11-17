// Administración de clientes (tenants). Uso:
//   node scripts/tenant.mjs init-control
//   node scripts/tenant.mjs create <slug> --name "Nombre" --logo /logo.png --logo-alt "Logo" \
//        [--sea-logo /x.png] [--webhook URL] [--admin-email a@b.com --admin-password ...] \
//        (--db-url URL [--db-token T] | --provision)
//   node scripts/tenant.mjs migrate [<slug>|--all]
//   node scripts/tenant.mjs list
//   node scripts/tenant.mjs set-admin <slug> <email> <password>
// Variables: CONTROL_DB_URL, CONTROL_DB_TOKEN; para --provision: TURSO_ORG, TURSO_API_TOKEN, TURSO_GROUP.
import { createClient } from '@libsql/client'
import bcrypt from 'bcryptjs'
import { migrateTenant } from '../lib/tenants/schema.ts'

const [cmd, ...rest] = process.argv.slice(2)
const flags = {}
const pos = []
for (let i = 0; i < rest.length; i++) {
  if (rest[i].startsWith('--')) {
    const k = rest[i].slice(2)
    const next = rest[i + 1]
    if (!next || next.startsWith('--')) flags[k] = true
    else { flags[k] = next; i++ }
  } else pos.push(rest[i])
}

const need = (v, msg) => { if (!v) { console.error(msg); process.exit(1) } return v }
const control = createClient({ url: need(process.env.CONTROL_DB_URL, 'Falta CONTROL_DB_URL'), authToken: process.env.CONTROL_DB_TOKEN || undefined })

const CONTROL_SQL = `CREATE TABLE IF NOT EXISTS tenants (
  slug TEXT PRIMARY KEY, name TEXT NOT NULL, db_url TEXT NOT NULL, db_token TEXT,
  config TEXT NOT NULL DEFAULT '{}', active INTEGER NOT NULL DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,40}$/
const RESERVED = ['api', 'admin', '_next', 'static', 'public', 'favicon']

async function turso(path, method = 'GET', body) {
  const res = await fetch(`https://api.turso.tech/v1${path}`, {
    method,
    headers: { Authorization: `Bearer ${process.env.TURSO_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`Turso API ${res.status}: ${await res.text()}`)
  return res.json()
}

async function provision(slug) {
  const org = need(process.env.TURSO_ORG, 'Falta TURSO_ORG'); need(process.env.TURSO_API_TOKEN, 'Falta TURSO_API_TOKEN')
  const name = `sea-${slug}`
  const { database } = await turso(`/organizations/${org}/databases`, 'POST', { name, group: process.env.TURSO_GROUP || 'default' })
  const { jwt } = await turso(`/organizations/${org}/databases/${name}/auth/tokens`, 'POST')
  return { url: `libsql://${database.Hostname}`, token: jwt }
}

async function tenantClient(row) {
  return createClient({ url: row.db_url, authToken: row.db_token || undefined })
}

async function main() {
  if (cmd === 'init-control') {
    await control.execute(CONTROL_SQL)
    console.log('Base de control lista.')
  } else if (cmd === 'create') {
    const slug = need(pos[0], 'Falta <slug>')
    if (!SLUG_RE.test(slug) || RESERVED.includes(slug)) { console.error('Slug inválido (minúsculas, números y guiones; 2-41 caracteres).'); process.exit(1) }
    await control.execute(CONTROL_SQL)
    const exists = (await control.execute({ sql: 'SELECT 1 FROM tenants WHERE slug = ?', args: [slug] })).rows.length
    if (exists) { console.error(`El cliente "${slug}" ya existe.`); process.exit(1) }
    const name = need(flags.name, 'Falta --name')
    let dbUrl = flags['db-url'], dbToken = flags['db-token'] || null
    if (flags.provision) ({ url: dbUrl, token: dbToken } = await provision(slug))
    need(dbUrl, 'Falta --db-url o --provision')
    const config = { name, logo: flags.logo || '/logo-sea.png', logoAlt: flags['logo-alt'] || name }
    if (flags['sea-logo']) config.seaLogo = flags['sea-logo']
    if (flags.webhook) config.enrollmentWebhook = flags.webhook
    if (flags.address) config.footerAddress = flags.address
    const db = createClient({ url: dbUrl, authToken: dbToken || undefined })
    const applied = await migrateTenant(db)
    if (flags['admin-email'] && flags['admin-password']) {
      await db.execute({ sql: 'INSERT INTO admins (email, name, password_hash) VALUES (?,?,?)', args: [String(flags['admin-email']).toLowerCase(), 'Administrador', await bcrypt.hash(String(flags['admin-password']), 10)] })
    }
    await control.execute({ sql: 'INSERT INTO tenants (slug, name, db_url, db_token, config) VALUES (?,?,?,?,?)', args: [slug, name, dbUrl, dbToken, JSON.stringify(config)] })
    console.log(`Cliente "${slug}" creado. Migraciones: ${applied.join(', ') || 'ninguna'}. Ya responde en /${slug}`)
  } else if (cmd === 'migrate') {
    const rows = flags.all || !pos[0]
      ? (await control.execute('SELECT * FROM tenants WHERE active = 1')).rows
      : (await control.execute({ sql: 'SELECT * FROM tenants WHERE slug = ?', args: [pos[0]] })).rows
    for (const r of rows) console.log(r.slug, '->', (await migrateTenant(await tenantClient(r))).join(', ') || 'al día')
  } else if (cmd === 'list') {
    for (const r of (await control.execute('SELECT slug, name, db_url, active FROM tenants ORDER BY slug')).rows) console.log(`${r.slug}\t${r.name}\t${r.db_url}\t${r.active ? 'activo' : 'baja'}`)
  } else if (cmd === 'set-admin') {
    const [slug, email, password] = pos
    need(slug && email && password, 'Uso: set-admin <slug> <email> <password>')
    const row = (await control.execute({ sql: 'SELECT * FROM tenants WHERE slug = ?', args: [slug] })).rows[0]
    need(row, 'Cliente no encontrado')
    const db = await tenantClient(row)
    await db.execute({ sql: `INSERT INTO admins (email, name, password_hash) VALUES (?,?,?) ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, active = 1`, args: [email.toLowerCase(), 'Administrador', await bcrypt.hash(password, 10)] })
    console.log('Administrador actualizado.')
  } else {
    console.log('Comandos: init-control | create | migrate | list | set-admin (ver cabecera del archivo)')
  }
}
main().catch((e) => { console.error(e.message || e); process.exit(1) })
