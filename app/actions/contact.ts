'use server'

import { tenantDb } from '@/lib/tenants/db'

const clip = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max)

export async function submitContactMessage(
  tenant: string,
  data: { nombre: string; email: string; telefono?: string; mensaje: string },
) {
  const nombre = clip(data.nombre, 200), email = clip(data.email, 200), mensaje = clip(data.mensaje, 5000)
  if (!nombre || !email || !mensaje) throw new Error('Faltan datos obligatorios')
  const { db } = await tenantDb(tenant)
  await db.execute({
    sql: 'INSERT INTO contact_messages (nombre, email, telefono, mensaje) VALUES (?, ?, ?, ?)',
    args: [nombre, email, clip(data.telefono, 50) || null, mensaje],
  })
}
