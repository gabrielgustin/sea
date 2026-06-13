import { NextRequest, NextResponse } from 'next/server'
import { turso, initializeSchema } from '@/lib/turso-client'

export async function GET() {
  try {
    await initializeSchema()

    const result = await turso.execute(
      'SELECT * FROM carousel WHERE active = 1 ORDER BY order ASC'
    )

    const slides = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      image: row.image || '/carousel/placeholder.png',
      order: row.order,
    }))

    return NextResponse.json(slides)
  } catch (error) {
    console.error('[v0] GET /api/carousel error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch carousel' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image } = body

    const id = `carousel_${Date.now()}`

    await turso.execute({
      sql: `INSERT INTO carousel (id, title, description, image, active, order) 
            VALUES (?, ?, ?, ?, 1, 0)`,
      args: [id, title, description, image || '/carousel/placeholder.png']
    })

    return NextResponse.json({ id, success: true }, { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/carousel error:', error)
    return NextResponse.json(
      { error: 'Failed to create carousel slide' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, image, order } = body

    await turso.execute({
      sql: `UPDATE carousel SET title = ?, description = ?, image = ?, order = ? WHERE id = ?`,
      args: [title, description, image, order, id]
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] PUT /api/carousel error:', error)
    return NextResponse.json(
      { error: 'Failed to update carousel slide' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    await turso.execute({
      sql: 'DELETE FROM carousel WHERE id = ?',
      args: [id]
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/carousel error:', error)
    return NextResponse.json(
      { error: 'Failed to delete carousel slide' },
      { status: 500 }
    )
  }
}
