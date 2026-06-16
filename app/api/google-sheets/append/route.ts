import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { schoolId, values } = await request.json()

    if (!values || !Array.isArray(values)) {
      return NextResponse.json({ error: 'Invalid values format' }, { status: 400 })
    }

    // Webhook URLs por escuela - cada una apunta a su Google Sheet
    const webhookUrls: Record<string, string> = {
      villada: 'https://script.google.com/macros/s/AKfycby1qkF291jaQnrdOPgyQGTwe8KmwB-53ywsWXvCW-yvDMiBGMARQ7dtn4OWCnEaZSqogg/exec',
      savio: 'https://script.google.com/macros/s/AKfycbz31HHo9UjoqNspFg6yserBcT_5Q3T4N0C6s6aTCwheKlSt6tueNHzqE-kBmsGvYCmmfw/exec',
    }

    const webhookUrl = webhookUrls[schoolId]
    if (!webhookUrl) {
      return NextResponse.json({ error: `Unknown schoolId: ${schoolId}` }, { status: 400 })
    }

    console.log('[v0] Google Sheets append request:', { schoolId, valuesCount: values.length, webhookUrl: webhookUrl.substring(0, 50) + '...' })

    // Google Apps Script requires a two-step request:
    // 1. POST to the script URL (returns 302 redirect to googleusercontent.com)
    // 2. GET the redirect URL to get the actual JSON response
    // Following the redirect directly converts POST to GET which breaks the script.
    const postResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolId, values, timestamp: new Date().toISOString() }),
      redirect: 'manual', // Don't follow redirect — capture it
    })

    console.log('[v0] Apps Script POST status:', postResponse.status)

    // Get the redirect location from the 302 response
    const redirectUrl = postResponse.headers.get('location')
    if (!redirectUrl) {
      console.error('[v0] No redirect URL in Apps Script response')
      return NextResponse.json({ error: 'No redirect from Google Apps Script' }, { status: 502 })
    }

    // Follow the redirect with GET to get the actual JSON result
    const getResponse = await fetch(redirectUrl, { method: 'GET' })
    const responseText = await getResponse.text()
    console.log('[v0] Apps Script result:', responseText.substring(0, 200))

    // Detect HTML error pages
    if (responseText.startsWith('<!DOCTYPE') || responseText.includes('Sorry, unable to open')) {
      console.error('[v0] Apps Script returned HTML error page')
      return NextResponse.json({ error: 'Google Apps Script not available' }, { status: 503 })
    }

    // Parse JSON response
    try {
      const json = JSON.parse(responseText)
      if (json.error) {
        console.error('[v0] Apps Script error:', json.error)
        return NextResponse.json({ error: json.error }, { status: 500 })
      }
    } catch (_) {}

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
