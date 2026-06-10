import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'El archivo debe ser una imagen' }, { status: 400 })
    }

    // Sanitizar nombre: quitar espacios y caracteres especiales
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const safeName = `teachers/${Date.now()}.${ext}`

    const blob = await put(safeName, file, {
      access: 'public',
      contentType: file.type,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('[API] Upload teacher image error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: `Error al subir: ${message}` }, { status: 500 })
  }
}
