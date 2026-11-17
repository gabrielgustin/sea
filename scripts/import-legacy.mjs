// Copia los datos de UN cliente desde la base única antigua (Turso, con columna schoolId) a su base propia en Neon.
// No modifica ni borra nada en la base antigua. Es repetible: lo ya copiado no se duplica.
// Uso: LEGACY_DB_URL=libsql://... LEGACY_DB_TOKEN=... CONTROL_DB_URL=... node scripts/import-legacy.mjs <slug> [--apply] [--include-shared]
//   sin --apply: solo cuenta lo que copiaría (ensayo).
//   --include-shared: copia también contact_messages, interest_forms y job_applications (en la base antigua no tenían
//   schoolId, eran compartidas por todos los clientes); usarlo en UN solo cliente para no duplicarlas.
import { createClient } from '@libsql/client'
import bcrypt from 'bcryptjs'
import { connect } from '../lib/tenants/pg.ts'
import { migrateTenant } from '../lib/tenants/schema.ts'

const slug = process.argv[2]
const apply = process.argv.includes('--apply')
const shared = process.argv.includes('--include-shared')
if (!slug || slug.startsWith('--')) { console.error('Uso: import-legacy.mjs <slug> [--apply] [--include-shared]'); process.exit(1) }
const must = (n) => process.env[n] || (console.error(`Falta ${n}`), process.exit(1))

const legacy = createClient({ url: must('LEGACY_DB_URL'), authToken: process.env.LEGACY_DB_TOKEN || undefined })
const control = connect(must('CONTROL_DB_URL'))
const t = (await control.execute({ sql: 'SELECT * FROM tenants WHERE slug = ?', args: [slug] })).rows[0]
if (!t) { console.error(`El cliente "${slug}" no está registrado. Crealo antes con tenant.mjs create.`); process.exit(1) }
const dest = connect(t.db_url)
await migrateTenant(dest)

const legacyExists = async (table) => (await legacy.execute(`PRAGMA table_info(${table})`)).rows.length > 0
const destCols = async (table) =>
  Object.fromEntries((await dest.execute({ sql: `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = ?`, args: [table] })).rows.map((r) => [r.column_name, r.data_type]))
// Tablas con id autonumérico: sin natural key para detectar repetidos.
const AUTO_ID = new Set(['carousel_slides', 'teachers', 'enrollments', 'students', 'contact_messages', 'interest_forms', 'job_applications'])
const KEY = { courses: 'id', site_settings: 'key', admins: 'email' }

// Convierte lo que venía de SQLite al tipo de la columna de Postgres.
const coerce = (v, type) => {
  if (v === null || v === undefined) return null
  if (type === 'boolean') return v === true || Number(v) === 1 || v === 'true'
  if (type === 'integer' || type === 'bigint') return Number(v)
  return typeof v === 'bigint' ? String(v) : v
}

async function copy(table, where, args, transform) {
  if (!(await legacyExists(table))) return console.log(`${table}: no existe en la base antigua`)
  if (AUTO_ID.has(table) && Number((await dest.execute(`SELECT COUNT(*) AS n FROM ${table}`)).rows[0].n) > 0) {
    return console.log(`${table}: el destino ya tiene datos, se omite`)
  }
  const types = await destCols(table)
  const src = await legacy.execute({ sql: `SELECT * FROM ${table} ${where}`, args })
  const stmts = []
  for (const raw of src.rows) {
    const row = transform ? transform({ ...raw }) : { ...raw }
    if (!row) continue
    if (AUTO_ID.has(table) && row.id !== undefined && !/^\d+$/.test(String(row.id))) delete row.id
    const keys = Object.keys(row).filter((k) => types[k] && row[k] !== undefined)
    const conflict = KEY[table] ? `ON CONFLICT ("${KEY[table]}") DO NOTHING` : 'ON CONFLICT DO NOTHING'
    stmts.push({ sql: `INSERT INTO ${table} (${keys.map((k) => `"${k}"`).join(',')}) VALUES (${keys.map(() => '?').join(',')}) ${conflict}`, args: keys.map((k) => coerce(row[k], types[k])) })
  }
  // Una transacción por tabla: se copia completa o no se copia.
  if (apply && stmts.length) await dest.batch(stmts)
  if (apply && AUTO_ID.has(table) && 'id' in types) {
    await dest.execute(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM ${table}), 1))`)
  }
  console.log(`${table}: ${stmts.length} filas ${apply ? 'copiadas' : '(ensayo)'}`)
}

const W = 'WHERE schoolId = ?'
for (const table of ['courses', 'carousel_slides', 'teachers', 'students']) await copy(table, W, [slug])
// Las inscripciones antiguas no tenían schoolId: se atribuyen al cliente por el curso al que pertenecen.
await copy('enrollments', 'WHERE courseId IN (SELECT id FROM courses WHERE schoolId = ?)', [slug])

// site_settings: las claves viejas venían con prefijo "<slug>__".
const prefix = `${slug}__`
// El sitio viejo solo leía las claves CON prefijo; las sin prefijo son restos. Se copian primero las con prefijo
// para que, si una clave aparece en ambas formas, gane la que realmente mostraba el sitio.
await copy('site_settings', 'WHERE schoolId = ? OR key LIKE ? ORDER BY (key LIKE ?) DESC', [slug, `${prefix}%`, `${prefix}%`], (r) => {
  r.key = String(r.key).startsWith(prefix) ? String(r.key).slice(prefix.length) : r.key
  return r
})

// Administradores: admin_users ya trae hash bcrypt; admins traía la contraseña en texto plano (se hashea al copiar).
async function copyAdmins() {
  const stmts = []
  const add = (email, name, hash) => stmts.push({ sql: 'INSERT INTO admins (email, name, password_hash) VALUES (?,?,?) ON CONFLICT (email) DO NOTHING', args: [String(email).toLowerCase(), name, hash] })
  if (await legacyExists('admin_users')) {
    for (const r of (await legacy.execute({ sql: 'SELECT * FROM admin_users WHERE schoolId = ?', args: [slug] })).rows) add(r.email, r.name ?? null, String(r.passwordHash))
  }
  if (await legacyExists('admins')) {
    for (const r of (await legacy.execute({ sql: 'SELECT * FROM admins WHERE schoolId = ?', args: [slug] })).rows) add(r.email, null, await bcrypt.hash(String(r.password), 10))
  }
  if (apply && stmts.length) await dest.batch(stmts)
  console.log(`admins: ${stmts.length} ${apply ? 'copiados' : '(ensayo)'}  -> cambiá sus contraseñas con: node scripts/tenant.mjs set-admin ${slug} <email> <nueva>`)
}
await copyAdmins()

if (shared) for (const table of ['contact_messages', 'interest_forms', 'job_applications']) await copy(table, '', [])
else console.log('contact_messages / interest_forms / job_applications: omitidas (eran compartidas; usá --include-shared en un solo cliente)')

console.log(apply ? 'Listo.' : 'Ensayo terminado. Repetí con --apply para copiar de verdad.')
