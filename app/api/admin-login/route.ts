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

    // Credenciales por defecto: schoolId/schoolId para cada escuela
    const DEFAULT_ADMINS: Record<string, string> = {
      villada: 'villada',
      savio: 'savio',
    };

    // Intentar validar contra Turso; si no está disponible, usar credenciales por defecto
    const hasTurso = !!process.env.TURSO_CONNECTION_URL && !!process.env.TURSO_AUTH_TOKEN;

    if (hasTurso) {
      // Ensure admins table exists and has default data
      try {
        await turso.execute(`
          CREATE TABLE IF NOT EXISTS admins (
            id TEXT PRIMARY KEY,
            schoolId TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            active INTEGER DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        for (const [school, pass] of Object.entries(DEFAULT_ADMINS)) {
          try {
            await turso.execute(
              'INSERT INTO admins (id, schoolId, email, password) VALUES (?, ?, ?, ?)',
              [`admin-${school}`, school, school, pass]
            );
          } catch (_) {}
        }
      } catch (tableErr) {
        console.error('[v0] Error creating admins table:', tableErr);
      }

      const result = await turso.execute(
        'SELECT id, email, password FROM admins WHERE email = ? AND schoolId = ? LIMIT 1',
        [email.toLowerCase(), schoolId]
      );

      const admin = result.rows?.[0];

      if (!admin || admin.password !== password) {
        return NextResponse.json(
          { success: false, error: 'Credenciales incorrectas' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Login exitoso',
        adminId: admin.id,
        email: admin.email,
        redirectUrl: `/${schoolId}/admin`,
      });
    }

    // Fallback: validar contra credenciales por defecto
    const expectedPassword = DEFAULT_ADMINS[schoolId];
    if (!expectedPassword || email.toLowerCase() !== schoolId || password !== expectedPassword) {
      return NextResponse.json(
        { success: false, error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login exitoso (modo demo)',
      adminId: `admin-${schoolId}`,
      email: email.toLowerCase(),
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
