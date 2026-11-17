'use server'

import { tenantDb } from '@/lib/tenants/db'

const clip = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max) || null

export async function submitJobApplication(
  tenant: string,
  d: {
    nombre: string; apellido: string; email: string; telefono?: string; dni?: string
    titulo?: string; especialidad?: string; experiencia?: string; motivacion?: string
  },
) {
  if (!clip(d.nombre, 200) || !clip(d.email, 200)) throw new Error('Faltan datos obligatorios')
  const { db } = await tenantDb(tenant)
  await db.execute({
    sql: `INSERT INTO job_applications (nombre, apellido, email, telefono, dni, titulo, especialidad, experiencia, motivacion, status)
          VALUES (?,?,?,?,?,?,?,?,?, 'pending')`,
    args: [clip(d.nombre, 200), clip(d.apellido, 200), clip(d.email, 200), clip(d.telefono, 50), clip(d.dni, 20), clip(d.titulo, 200), clip(d.especialidad, 200), clip(d.experiencia, 5000), clip(d.motivacion, 5000)],
  })
}
