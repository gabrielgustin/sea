import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { schoolId, values } = await request.json()

    if (!values || !Array.isArray(values)) {
      return NextResponse.json({ error: 'Invalid values format' }, { status: 400 })
    }

    // Webhook URLs por escuela - cada una apunta a su Google Sheet
    const webhookUrls: Record<string, string> = {
      villada: 'https://script.google.com/macros/s/AKfycbyWEqG5pQ8xL5JhT-V2K9H3wE5a6pZ8mN4oP2qRsT9vU1xY2zA/exec', // Reemplazar con webhook de Villada
      savio: 'https://script.google.com/macros/s/AKfycbw1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t/exec', // Reemplazar con webhook de Savio
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
