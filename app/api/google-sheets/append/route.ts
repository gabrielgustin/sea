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

    console.log('[v0] Google Sheets append request:', { schoolId, valuesCount: values.length, webhookUrl: webhookUrl.substring(0, 50) + '...' })

    // Send data to Google Apps Script webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        schoolId,
        values,
        timestamp: new Date().toISOString(),
      }),
      redirect: 'follow', // Follow redirects from Google Apps Script
    })

    const responseText = await response.text()
    console.log('[v0] Webhook response status:', response.status, 'body:', responseText.substring(0, 300))

    if (!response.ok) {
      console.error('[v0] Google Sheets webhook failed:', response.status, responseText)
      return NextResponse.json({ error: `Webhook error: ${response.status}` }, { status: response.status })
    }

    // Google Apps Script sometimes returns HTML error pages with status 200
    // Detect the "unable to open the file" error from Google
    if (responseText.includes('Sorry, unable to open') || responseText.includes('Page Not Found') || responseText.startsWith('<!DOCTYPE')) {
      console.error('[v0] Google Apps Script returned an HTML error page — script may be deleted or revoked')
      return NextResponse.json({ error: 'Google Apps Script not available. Please recreate the webhook deployment.' }, { status: 503 })
    }

    // Try to parse JSON response from Apps Script
    try {
      const json = JSON.parse(responseText)
      if (json.error) {
        console.error('[v0] Apps Script returned error:', json.error)
        return NextResponse.json({ error: json.error }, { status: 500 })
      }
    } catch (_) {
      // Not JSON — still ok if no HTML error
    }

    console.log('[v0] Google Sheets append SUCCESS for schoolId:', schoolId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] POST /api/google-sheets/append error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
