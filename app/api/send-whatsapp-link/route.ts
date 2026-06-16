import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, courseName, commissionName, whatsappLink } = await req.json()

    if (!email || !whatsappLink) {
      return NextResponse.json({ error: 'Missing email or whatsappLink' }, { status: 400 })
    }

    console.log('[v0] Sending WhatsApp link email to:', email)

    // For now, just log the email (in production, use SendGrid, Resend, or similar)
    // This endpoint can be enhanced to actually send emails
    console.log('[v0] WhatsApp Link Email Details:', {
      recipient: email,
      course: courseName,
      commission: commissionName,
      link: whatsappLink,
    })

    // TODO: Integrate with actual email service (SendGrid, Resend, etc.)
    // For now, we'll return success and the frontend can handle copying the link
    // or the user can manually share it

    return NextResponse.json({
      success: true,
      message: `Link enviado a ${email}`,
      whatsappLink: whatsappLink, // Return link in case frontend wants to use it
    })
  } catch (error) {
    console.error('[v0] Error sending WhatsApp link:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
