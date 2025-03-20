import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { encrypt } from '@/lib/encryption';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Supabase client with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: Request) {
  try {
    console.log('Starting email send process...');
    // Parse request body
    const body = await request.json();
    const { email, type, name, registrationData } = body;

    console.log('Request body:', { email, type, name });

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      );
    }

    // For verification emails, encrypt the registration data
    let token;
    if (type === 'verification' && registrationData) {
      // Encrypt registration data
      const encryptedData = encrypt(JSON.stringify(registrationData));
      token = encodeURIComponent(encryptedData);
    } else {
      token = crypto.randomUUID();
    }

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

    console.log('Sending email via Resend...');
    try {
      let subject, content;
      if (type === 'verification') {
        subject = 'Verify your email address';
        content = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Job Tracker!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
            <p>Best regards,<br>The Job Tracker Team</p>
          </div>
        `;
      } else if (type === 'reset') {
        subject = 'Reset your password';
        content = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>Hi there,</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            <p>Best regards,<br>The Job Tracker Team</p>
          </div>
        `;
      } else {
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
      }

      // Use production email in production, test email in development
      const fromEmail = process.env.NODE_ENV === 'production'
        ? 'no_reply@shantanukhoraskar.com'  // Production: use verified domain
        : 'onboarding@resend.dev';          // Development: use Resend's test email

      const data = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: subject,
        html: content
      });

      console.log('Email sent successfully:', data);
      return NextResponse.json(
        { message: 'Email sent successfully' },
        { status: 200 }
      );
    } catch (emailError: any) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { error: `Failed to send email: ${emailError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in send-email route:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
} 