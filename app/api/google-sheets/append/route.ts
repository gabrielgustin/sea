import { NextRequest, NextResponse } from 'next/server'

// Append a row to Google Sheets using the API
export async function POST(request: NextRequest) {
  try {
    const { values } = await request.json()

    if (!values || !Array.isArray(values)) {
      return NextResponse.json(
        { error: 'values array required' },
        { status: 400 }
      )
    }

    const sheetId = process.env.GOOGLE_SHEETS_ID
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY

    if (!sheetId || !apiKey) {
      return NextResponse.json(
        { error: 'Google Sheets configuration missing' },
        { status: 500 }
      )
    }

    // Use Google Sheets API v4 to append values
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Inscripciones!A:H:append?valueInputOption=USER_ENTERED&key=${apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        values: [values],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('[v0] Google Sheets API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to append to Google Sheets' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('[v0] Append to Google Sheets error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
