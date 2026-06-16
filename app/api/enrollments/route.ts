import { NextRequest, NextResponse } from 'next/server'

const hasTurso = () => !!process.env.TURSO_CONNECTION_URL && !!process.env.TURSO_AUTH_TOKEN

async function getTurso() {
  const { turso, initializeSchema } = await import('@/lib/turso-client')
  await initializeSchema()
  return turso
}

// GET /api/enrollments?courseId=X&schoolId=Y
// Returns enrollment counts per commissionId for a course
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const schoolId = searchParams.get('schoolId') || 'savio'

    if (!courseId) {
      return NextResponse.json({ error: 'courseId required' }, { status: 400 })
    }

    if (!hasTurso()) {
      return NextResponse.json({ counts: {} })
    }

    const turso = await getTurso()
    const result = await turso.execute(
      `SELECT commissionId, COUNT(*) as count FROM enrollments WHERE courseId = ? AND schoolId = ? GROUP BY commissionId`,
      [courseId, schoolId]
    )

    const counts: Record<string, number> = {}
    for (const row of result.rows || []) {
      const cid = row.commissionId as string
      if (cid) counts[cid] = Number(row.count)
    }

    return NextResponse.json({ counts })
  } catch (error) {
    console.error('[v0] GET /api/enrollments error:', error)
    return NextResponse.json({ counts: {} })
  }
}

// POST /api/enrollments — save a new enrollment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      schoolId = 'savio',
      courseId,
      courseName,
      commissionId,
      commissionName,
      nombre,
      apellido,
      email,
      telefono,
      dni,
      metodoPago = 'No especificado',
    } = body

    if (!courseId || !nombre || !email || !dni) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!hasTurso()) {
      return NextResponse.json({ success: true, id: `mem_${Date.now()}` })
    }

    const turso = await getTurso()

    // Check commission capacity before inserting
    if (commissionId) {
      // Get current count for this commission
      const countResult = await turso.execute(
        `SELECT COUNT(*) as count FROM enrollments WHERE courseId = ? AND schoolId = ? AND commissionId = ?`,
        [courseId, schoolId, commissionId]
      )
      const currentCount = Number(countResult.rows?.[0]?.count ?? 0)

      // Get max capacity from course commissions
      const courseResult = await turso.execute(
        `SELECT commissions FROM courses WHERE id = ? AND schoolId = ?`,
        [courseId, schoolId]
      )
      if (courseResult.rows?.[0]?.commissions) {
        const commissions = JSON.parse(courseResult.rows[0].commissions as string) as Array<{ id: string; maxCapacity: number }>
        const commission = commissions.find(c => c.id === commissionId)
        if (commission && currentCount >= commission.maxCapacity) {
          return NextResponse.json({ error: 'commission_full', message: 'Esta comisión ya no tiene lugares disponibles.' }, { status: 409 })
        }
      }
    }

    const insertResult = await turso.execute(
      `INSERT INTO enrollments (schoolId, courseId, courseName, commissionId, commissionName, nombre, apellido, email, telefono, dni, metodoPago, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [schoolId, courseId, courseName, commissionId || null, commissionName || null, nombre, apellido, email, telefono, dni, metodoPago]
    )

    const newId = insertResult.lastInsertRowid?.toString() ?? `enr_${Date.now()}`
    return NextResponse.json({ success: true, id: newId })
  } catch (error) {
    console.error('[v0] POST /api/enrollments error:', error)
    return NextResponse.json({ error: 'Failed to save enrollment' }, { status: 500 })
  }
}
