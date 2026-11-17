// Copia los datos de UN cliente desde la base única antigua (con columna schoolId) a su base propia.
// No modifica ni borra nada en la base antigua. Es repetible: lo ya copiado no se duplica.
// Uso: LEGACY_DB_URL=... LEGACY_DB_TOKEN=... CONTROL_DB_URL=... node scripts/import-legacy.mjs <slug> [--apply] [--include-shared]
//   sin --apply: solo cuenta lo que copiaría (ensayo).
//   --include-shared: copia también contact_messages, interest_forms y job_applications (en la base antigua no tenían
//   schoolId, eran compartidas por todos los clientes); usarlo en UN solo cliente para no duplicarlas.
import { createClient } from '@libsql/client'
import bcrypt from 'bcryptjs'
import { migrateTenant } from '../lib/tenants/schema.ts'

const slug = process.argv[2]
const apply = process.argv.includes('--apply')
const shared = process.argv.includes('--include-shared')
if (!slug || slug.startsWith('--')) { console.error('Uso: import-legacy.mjs <slug> [--apply] [--include-shared]'); process.exit(1) }
const must = (n) => process.env[n] || (console.error(`Falta ${n}`), process.exit(1))

const legacy = createClient({ url: must('LEGACY_DB_URL'), authToken: process.env.LEGACY_DB_TOKEN || undefined })
const control = createClient({ url: must('CONTROL_DB_URL'), authToken: process.env.CONTROL_DB_TOKEN || undefined })
const t = (await control.execute({ sql: 'SELECT * FROM tenants WHERE slug = ?', args: [slug] })).rows[0]
if (!t) { console.error(`El cliente "${slug}" no está registrado. Crealo antes con tenant.mjs create.`); process.exit(1) }
const dest = createClient({ url: String(t.db_url), authToken: t.db_token ? String(t.db_token) : undefined })
await migrateTenant(dest)

const cols = async (db, table) => (await db.execute(`PRAGMA table_info(${table})`)).rows.map((r) => String(r.name))
const exists = async (db, table) => (await cols(db, table)).length > 0
const INT_PK = new Set(['carousel_slides', 'teachers', 'enrollments', 'students', 'contact_messages', 'interest_forms', 'job_applications'])

async function copy(table, where, args, transform) {
  if (!(await exists(legacy, table))) return console.log(`${table}: no existe en la base antigua`)
  // Tablas con id autonumérico: si el destino ya tiene filas, no se copia de nuevo (evita duplicados al repetir).
  if (INT_PK.has(table) && Number((await dest.execute(`SELECT COUNT(*) AS n FROM ${table}`)).rows[0].n) > 0) {
    return console.log(`${table}: el destino ya tiene datos, se omite`)
  }
  const src = await legacy.execute({ sql: `SELECT * FROM ${table} ${where}`, args })
  const dcols = await cols(dest, table)
  let n = 0
  for (const raw of src.rows) {
    const row = transform ? transform({ ...raw }) : { ...raw }
    if (!row) continue
    delete row.schoolId
    if (INT_PK.has(table) && row.id !== undefined && !/^\d+$/.test(String(row.id))) delete row.id
    const keys = Object.keys(row).filter((k) => dcols.includes(k) && row[k] !== undefined)
    if (apply) await dest.execute({ sql: `INSERT OR IGNORE INTO ${table} (${keys.map((k) => `"${k}"`).join(',')}) VALUES (${keys.map(() => '?').join(',')})`, args: keys.map((k) => row[k]) })
    n++
  }
  console.log(`${table}: ${n} filas ${apply ? 'copiadas' : '(ensayo)'}`)
}

const W = 'WHERE schoolId = ?'
for (const table of ['courses', 'carousel_slides', 'teachers', 'enrollments', 'students']) await copy(table, W, [slug])

// site_settings: las claves viejas venían con prefijo "<slug>__".
const prefix = `${slug}__`
await copy('site_settings', 'WHERE schoolId = ? OR key LIKE ?', [slug, `${prefix}%`], (r) => {
  r.key = String(r.key).startsWith(prefix) ? String(r.key).slice(prefix.length) : r.key
  return r
})

// Administradores: admin_users ya trae hash bcrypt; admins traía la contraseña en texto plano (se hashea al copiar).
async function copyAdmins() {
  let n = 0
  if (await exists(legacy, 'admin_users')) {
    for (const r of (await legacy.execute({ sql: 'SELECT * FROM admin_users WHERE schoolId = ?', args: [slug] })).rows) {
      if (apply) await dest.execute({ sql: 'INSERT OR IGNORE INTO admins (email, name, password_hash) VALUES (?,?,?)', args: [String(r.email).toLowerCase(), r.name ?? null, String(r.passwordHash)] })
      n++
    }
  }
  if (await exists(legacy, 'admins')) {
    for (const r of (await legacy.execute({ sql: 'SELECT * FROM admins WHERE schoolId = ?', args: [slug] })).rows) {
      if (apply) await dest.execute({ sql: 'INSERT OR IGNORE INTO admins (email, name, password_hash) VALUES (?,?,?)', args: [String(r.email).toLowerCase(), null, await bcrypt.hash(String(r.password), 10)] })
      n++
    }
  }
  console.log(`admins: ${n} ${apply ? 'copiados' : '(ensayo)'}  -> cambiá sus contraseñas con: node scripts/tenant.mjs set-admin ${slug} <email> <nueva>`)
}
await copyAdmins()

if (shared) for (const table of ['contact_messages', 'interest_forms', 'job_applications']) await copy(table, '', [])
else console.log('contact_messages / interest_forms / job_applications: omitidas (eran compartidas; usá --include-shared en un solo cliente)')

console.log(apply ? 'Listo.' : 'Ensayo terminado. Repetí con --apply para copiar de verdad.')
