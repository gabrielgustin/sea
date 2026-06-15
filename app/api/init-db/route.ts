import { initializeSchema } from '@/lib/turso-client';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await initializeSchema();
    return Response.json({ 
      success: true, 
      message: 'Database schema initialized successfully' 
    });
  } catch (error: any) {
    console.error('[v0] Error initializing database:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
