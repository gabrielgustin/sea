import 'server-only'
import type { Tenant } from '@/lib/tenants/types'

// Envía la inscripción a la planilla de Google del cliente (si tiene una configurada). Nunca lanza.
export async function notifyEnrollment(
  tenant: Tenant,
  e: { nombre: string; apellido: string; email: string; telefono: string; dni: string; courseName: string; commissionName?: string | null },
) {
  const url = tenant.config.enrollmentWebhook
  if (!url) return
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        timestamp: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
        nombre: e.nombre, apellido: e.apellido, email: e.email, telefono: e.telefono, dni: e.dni,
        curso: e.courseName, comision: e.commissionName || 'Sin comisión',
      }),
    })
  } catch (err) {
    console.error('[enrollment-webhook]', tenant.slug, err)
  }
}
