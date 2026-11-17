import 'server-only'
import { connect, type Db } from './pg'

// Base de control: la lista de clientes (tenants) y cómo conectarse a la base de cada uno.
let control: Db | null = null

export function controlDb(): Db {
  if (control) return control
  const url = process.env.CONTROL_DB_URL
  if (!url) throw new Error('Falta CONTROL_DB_URL (base de control de clientes)')
  return (control = connect(url))
}
