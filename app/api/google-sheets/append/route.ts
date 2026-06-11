import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { values } = await request.json()

    if (!values || !Array.isArray(values)) {
      return NextResponse.json({ error: 'Invalid values format' }, { status: 400 })
    }

    // URL del webhook de Google Apps Script
    const webhookUrl = 'https://script.google.com/macros/s/AKfycbyiURxIAhh2iyWpwtOpsabr87KDLRvb-jJPcWRHPdx2Rn2hoi9GTUZg2Izgxf-gB2GNCA/exec'

    // Send data to Google Apps Script webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
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
