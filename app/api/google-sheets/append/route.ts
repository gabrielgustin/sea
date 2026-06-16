import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { schoolId, values } = await request.json()

    if (!values || !Array.isArray(values)) {
      return NextResponse.json({ error: 'Invalid values format' }, { status: 400 })
    }

    // Webhook URLs por escuela - cada una apunta a su Google Sheet
    const webhookUrls: Record<string, string> = {
      villada: 'https://script.google.com/macros/s/AKfycbwlg-BjQTtTxOP4Cx77u1uAL1jW7GY9lJ9V5VODsYtSLHM5n3NhaFKC2LDB88pydL0HRg/exec',
      savio: 'https://script.google.com/macros/s/AKfycby3lnFQs12b3GWxVpdG66Re_RRZOYhJoCI_xHg9-GT3n9BSuKqEZJ8X8t6Ca137sLAzbw/exec',
    }

    const webhookUrl = webhookUrls[schoolId]
    if (!webhookUrl) {
      return NextResponse.json({ error: `Unknown schoolId: ${schoolId}` }, { status: 400 })
    }

    console.log('[v0] Appending to Google Sheets for schoolId:', schoolId)

    // Send data to Google Apps Script webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        schoolId,
        values,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[v0] Google Sheets webhook error:', response.status, errorText)
      return NextResponse.json({ error: 'Failed to save to Google Sheets' }, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] POST /api/google-sheets/append error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
