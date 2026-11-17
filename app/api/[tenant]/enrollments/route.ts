import { NextResponse } from 'next/server'
import { route } from '@/lib/auth/guard'
import { commissionCounts, createEnrollment, listEnrollments, CommissionFullError } from '@/lib/data/enrollments'
import { notifyEnrollment } from '@/lib/enrollment-webhook'

// Cupos por comisión: dato público (lo muestra la inscripción).
export const GET = route(async (req, { db, session }) => {
  const params = new URL(req.url).searchParams
  const courseId = params.get('courseId')
  if (!courseId) {
    if (session?.role !== 'admin') return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    return NextResponse.json({ enrollments: await listEnrollments(db) })
  }
  return NextResponse.json({ counts: await commissionCounts(db, courseId) })
})

export const POST = route(async (req, { db, tenant }) => {
  const b = await req.json()
  const required = ['courseId', 'nombre', 'apellido', 'email', 'telefono', 'dni']
  if (required.some((k) => !String(b[k] ?? '').trim())) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  try {
    const id = await createEnrollment(db, b)
    await notifyEnrollment(tenant, b) // best-effort: no falla la inscripción si Google Sheets no responde
    return NextResponse.json({ success: true, id })
  } catch (e) {
    if (e instanceof CommissionFullError) return NextResponse.json({ error: 'commission_full', message: 'Esta comisión ya no tiene lugares disponibles.' }, { status: 409 })
    throw e
  }
})
