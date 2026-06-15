import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: NextRequest) {
  try {
    const { email, password, schoolId } = await request.json();
    console.log('[v0] Admin login attempt:', { email, schoolId });

    if (!email || !password || !schoolId) {
      return NextResponse.json(
        { success: false, error: 'Email, password, y schoolId son requeridos' },
        { status: 400 }
      );
    }

    const connectionUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
    console.log('[v0] Connection URL available:', !!connectionUrl);
    
    if (!connectionUrl) {
      console.error('[v0] No database URL found');
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    const sql = neon(connectionUrl);

    // Create table if it doesn't exist
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          school_id VARCHAR(255) NOT NULL,
          active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('[v0] Admins table ensured');
    } catch (err) {
      console.log('[v0] Table create error (may already exist)');
    }

    // Try to insert default admin if it doesn't exist
    try {
      await sql`
        INSERT INTO admins (email, password, school_id) 
        VALUES (${schoolId}, ${schoolId}, ${schoolId})
        ON CONFLICT (email) DO NOTHING
      `;
      console.log('[v0] Default admin ensured');
    } catch (err) {
      console.log('[v0] Admin insert error');
    }

    // Query for the admin
    const result = await sql`
      SELECT id, email, password FROM admins 
      WHERE email = ${email} AND school_id = ${schoolId}
      LIMIT 1
    `;

    const admin = result?.[0];
    console.log('[v0] Admin found:', !!admin);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    // Simple password check
    if (admin.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    // Login successful
    console.log('[v0] Admin login successful:', email);
    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      adminId: admin.id,
      email: admin.email,
      redirectUrl: `/${schoolId}/admin`,
    });
  } catch (error) {
    console.error('[v0] Admin login error:', error);
    console.error('[v0] Error message:', (error as Error).message);
    return NextResponse.json(
      { success: false, error: 'Error de conexión. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}
