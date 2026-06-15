import { NextResponse } from 'next/server'
import { turso } from '@/lib/turso-client'

export async function GET() {
  try {
    const result = await turso.execute(`SELECT name FROM sqlite_master WHERE type='table' AND name='admin_users'`)
    
    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ tableExists: false, message: 'Table does not exist' })
    }

    const columns = await turso.execute(`PRAGMA table_info(admin_users)`)
    return NextResponse.json({ 
      tableExists: true,
      columns: columns.rows
    })
  } catch (error: any) {
    return NextResponse.json({ error: String(error?.message ?? error) }, { status: 500 })
  }
}
