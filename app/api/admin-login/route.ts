import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso-client';

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Admin login request received');
    const { email, password, schoolId } = await request.json();
    console.log('[v0] Parsed request:', { email, schoolId });

    if (!email || !password || !schoolId) {
      return NextResponse.json(
        { success: false, error: 'Email, password, y schoolId son requeridos' },
        { status: 400 }
      );
    }

    console.log('[v0] Querying admins table...');
    // Query the database for admin credentials
    const result = await turso.execute(
      'SELECT id, email, password FROM admins WHERE email = ? AND schoolId = ? LIMIT 1',
      [email.toLowerCase(), schoolId]
    );
    console.log('[v0] Query result:', result);

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
    console.error('[v0] Error details:', (error as Error).message);
    return NextResponse.json(
      { success: false, error: 'Error de conexión. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}
