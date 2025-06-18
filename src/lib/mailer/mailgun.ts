import { NextRequest, NextResponse } from 'next/server';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import Mailgen from 'mailgen';

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

    // Mailgen instantiation goes inside the function
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'PixelPlaylistAI',
        link: process.env.NEXTAUTH_URL || 'https://pixelplaylistai.vercel.app',
      },
    });

    // Create email template
    const template = {
      body: {
        name,
        intro: 'Welcome to PixelPlaylistAI! We\'re excited to have you on board.',
        action: {
          instructions: 'Click the button below to get started:',
          button: {
            color: '#3869D4',
            text: 'Get Started',
            link: url
          }
        },
        outro: 'Need help? Just reply to this email.'
      }
    };

    const emailData = {
      subject: 'Welcome to PixelPlaylistAI!',
      html: mailGenerator.generate(template),
      text: mailGenerator.generatePlaintext(template),
    };

    // Send email
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY!,
    });

    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.MAILGUN_FROM!,
      to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    });

    return NextResponse.json({ message: 'Email sent successfully!' });
    
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' }, 
      { status: 500 }
    );
  }
}