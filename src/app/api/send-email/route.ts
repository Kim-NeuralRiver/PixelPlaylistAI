import { NextRequest, NextResponse } from 'next/server';
import { generateEmail, sendEmail } from '@/lib/mailer/mailgun';
import { welcomeEmailTemplate } from '@/lib/mailer/templates/welcome-email';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.API_KEY;
    const requestKey = request.headers.get('x-api-key');
    
    if (requestKey !== apiKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { to, name, url } = body;

    if (!to || !name || !url) {
      return NextResponse.json(
        { error: 'Missing required fields: to, name, or url' }, 
        { status: 400 }
      );
    }

    const template = welcomeEmailTemplate(name, url);
    const emailData = generateEmail('Welcome to Our App!', template);

    await sendEmail(to, emailData);

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
    
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' }, 
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method GET Not Allowed' }, 
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}