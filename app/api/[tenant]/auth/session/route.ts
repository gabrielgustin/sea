import { NextResponse } from 'next/server'
import { route } from '@/lib/auth/guard'

export const GET = route(async (_req, { session }) =>
  NextResponse.json({ role: session?.role ?? null, dni: session?.dni, course: session?.course }),
)
