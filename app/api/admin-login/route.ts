import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso-client';

export async function POST(request: NextRequest) {
  try {
    const { email, password, schoolId } = await request.json();

    if (!email || !password || !schoolId) {
      return NextResponse.json(
        { success: false, error: 'Email, password, y schoolId son requeridos' },
        { status: 400 }
      );
    }

    // Query the database for admin credentials
    const result = await turso.execute(
      'SELECT id, email, password FROM admins WHERE email = ? AND schoolId = ? LIMIT 1',
      [email.toLowerCase(), schoolId]
    );

    const admin = result.rows?.[0];

    if (!admin) {
      console.log('[v0] Admin not found for email:', email, 'schoolId:', schoolId);
      return NextResponse.json(
        { success: false, error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    // Simple password check (for development - use bcrypt in production)
    if (admin.password !== password) {
      console.log('[v0] Password mismatch for admin:', email);
      return NextResponse.json(
        { success: false, error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    // Login successful
    console.log('[v0] Admin login successful for:', email);
    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      adminId: admin.id,
      email: admin.email,
      redirectUrl: `/${schoolId}/admin`,
    });
  } catch (error) {
    console.error('[v0] Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Error de conexión. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}
