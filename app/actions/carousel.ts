'use server'

import { db } from '@/lib/db'
import { carouselSlides } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getCarouselSlides() {
  return db.select().from(carouselSlides).where(eq(carouselSlides.active, true)).orderBy(asc(carouselSlides.order))
}

export async function getAllCarouselSlides() {
  return db.select().from(carouselSlides).orderBy(asc(carouselSlides.order))
}

export async function createCarouselSlide(data: Omit<typeof carouselSlides.$inferInsert, 'id' | 'createdAt'>) {
  await db.insert(carouselSlides).values(data)
  revalidatePath('/')
}

export async function updateCarouselSlide(id: number, data: Partial<typeof carouselSlides.$inferInsert>) {
  await db.update(carouselSlides).set(data).where(eq(carouselSlides.id, id))
  revalidatePath('/')
}

export async function deleteCarouselSlide(id: number) {
  await db.delete(carouselSlides).where(eq(carouselSlides.id, id))
  revalidatePath('/')
}
