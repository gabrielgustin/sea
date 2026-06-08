import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// One-time endpoint to create the initial admin user.
// Call GET /api/setup once, then this endpoint does nothing further.
export async function GET() {
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_SETUP) {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name: 'Admin',
        email: 'admin@sea-admin.local',
        password: 'admin',
      },
    })
    return NextResponse.json({ success: true, message: 'Admin user created. Email: admin@sea-admin.local, Password: admin' })
  } catch (err: any) {
    // If user already exists that's fine
    if (err?.message?.includes('already') || err?.status === 422) {
      return NextResponse.json({ success: true, message: 'Admin user already exists.' })
    }
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 })
  }
}
