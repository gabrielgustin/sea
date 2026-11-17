import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { route } from '@/lib/auth/guard'

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

export const POST = route(async (req, { tenant }) => {
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: 'Formato de imagen no permitido' }, { status: 400 })
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: 'Image must be under 8MB' }, { status: 400 })
  const folder = String(form.get('folder') || 'images').replace(/\.\./g, '').replace(/[^a-z0-9/-]/gi, '')
  const name = file.name.replace(/[^a-z0-9._-]/gi, '-')
  // Cada cliente sube a su propia carpeta del almacenamiento.
  const blob = await put(`${tenant.slug}/${folder}/${Date.now()}-${name}`, file, { access: 'public' })
  return NextResponse.json({ url: blob.url, success: true })
}, { admin: true })
