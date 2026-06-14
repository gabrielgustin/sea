import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'images'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 8MB' }, { status: 400 })
    }

    const filename = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const blob = await put(filename, file, { access: 'public' })

    return NextResponse.json({ url: blob.url, success: true })
  } catch (error) {
    console.error('[v0] Image upload error:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
