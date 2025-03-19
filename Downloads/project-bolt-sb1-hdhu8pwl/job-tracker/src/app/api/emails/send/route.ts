import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { to, subject, body, applicationId } = await request.json()

    // Send email using Resend
    const { data, error: resendError } = await resend.emails.send({
      from: 'Job Application Tracker <applications@yourdomain.com>',
      to: [to],
      subject,
      text: body,
    })

    if (resendError) {
      throw resendError
    }

    // Update the application status in the database
    const { error: dbError } = await supabase
      .from('emails')
      .insert([
        {
          application_id: applicationId,
          subject,
          body,
          sent_at: new Date().toISOString(),
          status: 'Sent',
        },
      ])

    if (dbError) {
      throw dbError
    }

    return NextResponse.json({ success: true, messageId: data?.id })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
} 