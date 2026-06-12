'use server'

import { db } from '@/lib/db'
import { contactMessages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function submitContactMessage(data: {
  nombre: string
  email: string
  telefono?: string
  mensaje: string
}) {
  await db.insert(contactMessages).values(data)
}

export async function getContactMessages() {
  return db.select().from(contactMessages).orderBy(contactMessages.createdAt)
}

export async function markMessageRead(id: number) {
  await db.update(contactMessages).set({ read: true }).where(eq(contactMessages.id, id))
  revalidatePath('/villada/admin')
}
