import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { carouselSlides } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const data = await db.select().from(carouselSlides).where(eq(carouselSlides.active, true)).orderBy(asc(carouselSlides.order))
    return NextResponse.json({ slides: data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await db.insert(carouselSlides).values({
      title: body.title,
      subtitle: body.subtitle ?? body.description,
      image: body.image ?? '/carousel/placeholder.png',
      badge: body.badge,
      ctaText: body.ctaText,
      ctaLink: body.ctaLink ?? (body.redirectSlug ? `/cursos/${body.redirectSlug}` : undefined),
      order: body.order ?? 0,
      active: body.active ?? true,
    }).returning()
    revalidatePath('/')
    return NextResponse.json({ success: true, slide: result[0] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    
    // Filter only updatable fields
    const updateData: any = {}
    const allowedFields = ['title', 'subtitle', 'image', 'badge', 'ctaText', 'ctaLink', 'order', 'active']
    for (const field of allowedFields) {
      if (field in data) {
        updateData[field] = data[field]
      }
    }
    
    const result = await db.update(carouselSlides).set(updateData).where(eq(carouselSlides.id, Number(id))).returning()
    revalidatePath('/')
    return NextResponse.json({ success: true, slide: result[0] })
  } catch (error) {
    console.error('PUT /api/carousel error:', error)
    return NextResponse.json({ error: 'Failed to update slide', details: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await db.delete(carouselSlides).where(eq(carouselSlides.id, id))
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 })
  }
}
