import type { Client } from '@libsql/client'
import { updateById, bool, type Row } from './sql'

const FIELDS = ['title', 'subtitle', 'description', 'image', 'ctaText', 'ctaLink', 'slideDuration', 'slideModality', 'slideStart', 'slideBadge', 'active', 'order'] as const

export async function listSlides(db: Client, opts: { activeOnly?: boolean } = {}) {
  const res = await db.execute(`SELECT * FROM carousel_slides ${opts.activeOnly ? 'WHERE active = 1' : ''} ORDER BY "order" ASC, id ASC`)
  return res.rows.map((r) => ({
    ...r,
    id: String(r.id),
    active: Boolean(r.active),
    description: r.subtitle || r.description || '',
    slideDuration: r.slideDuration || '',
    slideModality: r.slideModality || '',
    slideStart: r.slideStart || '',
    slideBadge: r.slideBadge || '',
  }))
}

export async function createSlide(db: Client, b: Row) {
  const res = await db.execute({
    sql: 'INSERT INTO carousel_slides (title, description, image, ctaLink, slideDuration, slideModality, slideStart, slideBadge, active, "order") VALUES (?,?,?,?,?,?,?,?,?,?)',
    args: [
      String(b.title || ''), String(b.description || b.subtitle || ''), String(b.image || ''), String(b.ctaLink || ''),
      String(b.slideDuration || ''), String(b.slideModality || ''), String(b.slideStart || ''), String(b.slideBadge || ''),
      b.active === false ? 0 : 1, Number(b.order ?? 0),
    ],
  })
  return String(res.lastInsertRowid)
}

export async function updateSlide(db: Client, id: string, b: Row) {
  const data: Row = { ...b }
  if (data.description !== undefined && data.subtitle === undefined) data.subtitle = data.description
  delete data.description
  if ('active' in data) data.active = bool(data.active)
  await updateById(db, 'carousel_slides', id, data, FIELDS)
}

export const deleteSlide = (db: Client, id: string) => db.execute({ sql: 'DELETE FROM carousel_slides WHERE id = ?', args: [id] })
