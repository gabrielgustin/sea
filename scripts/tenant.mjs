// Administración de clientes (tenants). Uso:
//   node scripts/tenant.mjs init-control
//   node scripts/tenant.mjs create <slug> --name "Nombre" --logo /logo.png --logo-alt "Logo" \
//        [--sea-logo /x.png] [--webhook URL] [--address "..."] [--admin-email a --admin-password ...] \
//        (--db-url <cadena de conexión de Neon> | --provision)
//   node scripts/tenant.mjs migrate [<slug>|--all]
//   node scripts/tenant.mjs list
//   node scripts/tenant.mjs set-admin <slug> <email> <password>
// Variables: CONTROL_DB_URL. Para --provision además NEON_ADMIN_URL (conexión del dueño del proyecto Neon).
import { randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { connect } from '../lib/tenants/pg.ts'
import { migrateTenant, CONTROL_SQL } from '../lib/tenants/schema.ts'

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
const control = connect(need(process.env.CONTROL_DB_URL, 'Falta CONTROL_DB_URL'))

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,40}$/
const RESERVED = ['api', 'admin', '_next', 'static', 'public', 'favicon']

// Crea un usuario y una base propios para el cliente (el usuario NO puede leer las demás bases).
// Sin probar contra Neon real todavía: revisar la primera vez.
async function provision(slug) {
  const adminUrl = need(process.env.NEON_ADMIN_URL, 'Falta NEON_ADMIN_URL')
  const admin = connect(adminUrl)
  const name = `t_${slug.replace(/-/g, '_')}`
  const password = randomBytes(24).toString('hex')
  await admin.execute(`CREATE ROLE ${name} LOGIN PASSWORD '${password}'`)
  await admin.execute(`GRANT ${name} TO CURRENT_USER`)
  await admin.execute(`CREATE DATABASE ${name} OWNER ${name}`)
  const u = new URL(adminUrl)
  return `postgresql://${name}:${password}@${u.host}/${name}?sslmode=require`
}

async function main() {
  if (cmd === 'init-control') {
    await control.execute(CONTROL_SQL)
    console.log('Base de control lista.')
  } else if (cmd === 'create') {
    const slug = need(pos[0], 'Falta <slug>')
    if (!SLUG_RE.test(slug) || RESERVED.includes(slug)) { console.error('Slug inválido (minúsculas, números y guiones; 2-41 caracteres).'); process.exit(1) }
    await control.execute(CONTROL_SQL)
    if ((await control.execute({ sql: 'SELECT 1 FROM tenants WHERE slug = ?', args: [slug] })).rows.length) { console.error(`El cliente "${slug}" ya existe.`); process.exit(1) }
    const name = need(flags.name, 'Falta --name')
    const dbUrl = flags.provision ? await provision(slug) : need(flags['db-url'], 'Falta --db-url o --provision')
    const config = { name, logo: flags.logo || '/logo-sea.png', logoAlt: flags['logo-alt'] || name }
    if (flags['sea-logo']) config.seaLogo = flags['sea-logo']
    if (flags.webhook) config.enrollmentWebhook = flags.webhook
    if (flags.address) config.footerAddress = flags.address
    const db = connect(dbUrl)
    const applied = await migrateTenant(db)
    if (flags['admin-email'] && flags['admin-password']) {
      await db.execute({ sql: 'INSERT INTO admins (email, name, password_hash) VALUES (?,?,?)', args: [String(flags['admin-email']).toLowerCase(), 'Administrador', await bcrypt.hash(String(flags['admin-password']), 10)] })
    }
    await control.execute({ sql: 'INSERT INTO tenants (slug, name, db_url, config) VALUES (?,?,?,?::jsonb)', args: [slug, name, dbUrl, JSON.stringify(config)] })
    console.log(`Cliente "${slug}" creado. Migraciones: ${applied.join(', ') || 'ninguna'}. Ya responde en /${slug}`)
  } else if (cmd === 'migrate') {
    const rows = flags.all || !pos[0]
      ? (await control.execute('SELECT * FROM tenants WHERE active = true')).rows
      : (await control.execute({ sql: 'SELECT * FROM tenants WHERE slug = ?', args: [pos[0]] })).rows
    for (const r of rows) console.log(r.slug, '->', (await migrateTenant(connect(r.db_url))).join(', ') || 'al día')
  } else if (cmd === 'list') {
    for (const r of (await control.execute('SELECT slug, name, active FROM tenants ORDER BY slug')).rows) console.log(`${r.slug}\t${r.name}\t${r.active ? 'activo' : 'baja'}`)
  } else if (cmd === 'set-admin') {
    const [slug, email, password] = pos
    need(slug && email && password, 'Uso: set-admin <slug> <email> <password>')
    const row = (await control.execute({ sql: 'SELECT * FROM tenants WHERE slug = ?', args: [slug] })).rows[0]
    need(row, 'Cliente no encontrado')
    await connect(row.db_url).execute({
      sql: `INSERT INTO admins (email, name, password_hash) VALUES (?,?,?) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, active = true`,
      args: [email.toLowerCase(), 'Administrador', await bcrypt.hash(password, 10)],
    })
    console.log('Administrador actualizado.')
  } else {
    console.log('Comandos: init-control | create | migrate | list | set-admin (ver cabecera del archivo)')
  }
}
main().catch((e) => { console.error(e.message || e); process.exit(1) })
