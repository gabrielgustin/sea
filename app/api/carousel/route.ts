import { NextRequest, NextResponse } from 'next/server'
import { turso, initializeSchema } from '@/lib/turso-client'

export async function GET(request: NextRequest) {
  try {
    await initializeSchema()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId') || 'villada'

    const result = await turso.execute({
      sql: 'SELECT * FROM carousel_slides WHERE active = 1 AND schoolId = ? ORDER BY "order" ASC',
      args: [schoolId]
    })

    const slides = result.rows.map((row) => ({
      id: row.id, title: row.title, description: row.description || row.subtitle,
      image: row.image || '/carousel/placeholder.png', order: row.order,
    }))

    return NextResponse.json(slides)
  } catch (error) {
    console.error('[v0] GET /api/carousel error:', error)
    return NextResponse.json({ error: 'Failed to fetch carousel' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image, schoolId = 'villada' } = body
    const id = `carousel_${Date.now()}`
    await turso.execute({
      sql: `INSERT INTO carousel_slides (schoolId, title, description, image, active, "order") VALUES (?, ?, ?, ?, 1, 0)`,
      args: [schoolId, title, description, image || '/carousel/placeholder.png']
    })
    return NextResponse.json({ id, success: true }, { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/carousel error:', error)
    return NextResponse.json({ error: 'Failed to create carousel slide' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, image, order, schoolId = 'villada' } = body
    await turso.execute({
      sql: `UPDATE carousel_slides SET title=?, description=?, image=?, "order"=? WHERE id=? AND schoolId=?`,
      args: [title, description, image, order, id, schoolId]
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] PUT /api/carousel error:', error)
    return NextResponse.json({ error: 'Failed to update carousel slide' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, schoolId = 'villada' } = await request.json()
    await turso.execute({ sql: 'DELETE FROM carousel_slides WHERE id=? AND schoolId=?', args: [id, schoolId] })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/carousel error:', error)
    return NextResponse.json({ error: 'Failed to delete carousel slide' }, { status: 500 })
  }
}
