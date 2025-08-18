import { NextRequest, NextResponse } from 'next/server';
// import { generateEmail, sendEmail } from '@/lib/mailer/mailgun';
// Removed above and below to test mailgun lazy loading
// import { welcomeEmailTemplate } from '@/lib/mailer/templates/welcome-email';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import Mailgen from 'mailgen';
import { time } from 'console';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  // Initialize requestId with a default value
  let requestId = `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    // No need to regenerate requestId here as it's already initialized

    // Log the start of the request with requestId
    console.log(`[${requestId}] Email API request started`, {
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    }); 

    // Check if the request has the correct API key
    const apiKey = process.env.API_KEY;
    const requestKey = request.headers.get('x-api-key');
    
    // Check if the API key is provided and matches the expected key
    if (requestKey !== apiKey) {
      console.warn(`[${requestId}] Unauthorised access attempt`, {
        timestamp: new Date().toISOString(),
        providedKey: requestKey ? 'provided' : 'missing',
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent'),
      });
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const body = await request.json();
    const { to, name, url } = body;

    console.log(`[${requestId}] Processing email request`, {
      timestamp: new Date().toISOString(),
      to: to ? 'provided' : 'missing',
      name: name ? 'provided' : 'missing',
      url: url ? 'provided' : 'missing',
      bodySize: JSON.stringify(body).length,
    });

    if (!to || !name || !url) {
      console.error(`[${requestId}] Missing required fields`, {
        timestamp: new Date().toISOString(),
        missingFields: {
          to: !to,
          name: !name,
          url: !url,
        },
        receivedBody: body,
      });
      return NextResponse.json(
        { error: 'Missing required fields: to, name, or url' }, 
        { status: 400 }
      );
    }

    // Validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      console.error(`[${requestId}] Invalid email format`, {
        timestamp: new Date().toISOString(),
        email: to,
      });
      return NextResponse.json(
        { error: 'Invalid email format' }, 
        { status: 400 }
      );
    }

    console.log(`[${requestId}] Initialising Mailgun`, {
      timestamp: new Date().toISOString(),
    });

    // Lazy load Mailgening - only executes when API is called
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'PixelPlaylistAI',
        link: process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'https://pixelplaylistai.vercel.app',
      },
    });

    //  Create email template inline
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

    console.log(`[$requestId}] Generating email content`, {
      timestamp: new Date().toISOString(),
    });

    //  Generate email inline
    const emailData = {
      subject: 'Welcome to PixelPlaylistAI!',
      html: mailGenerator.generate(template),
      text: mailGenerator.generatePlaintext(template),
    };

    console.log(`[${requestId}] Initialising Mailgun client`, {
      timestamp: new Date().toISOString(),
      domain: process.env.MAILGUN_DOMAIN ? 'configured' : 'missing',
      apiKey: process.env.MAILGUN_API_KEY ? 'configured' : 'missing',
      fromEmail: process.env.MAILGUN_FROM ? 'configured' : 'missing',
    });

    //  Send email inline
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY!,
    });

    const sendStartTime = Date.now();
    console.log(`[$requestId}] Sending email via Mailgun`, {
      timestamp: new Date().toISOString(),
      recipient: to,
      subject: emailData.subject,
    });

    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.MAILGUN_FROM!,
      to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    });

    const sendDuration = Date.now() - sendStartTime;
    const totalDuration = Date.now() - startTime;

    console.log(`[${requestId}] Email sent successfully`, {
      timestamp: new Date().toISOString(),
      recipient: to,
      mailgunMessageId: result.id,
      sendDuration: `${sendDuration}ms`,
      totalDuration: `${totalDuration}ms`,
      status: result.status || 'sent',
    });

    return NextResponse.json({ 
      message: 'Email sent successfully!',
      messageId: result.id
    }, { status: 200 });
    
  } catch (error) {
    const totalDuration = Date.now() - startTime;;
    
    // Comprehensive error loggin

    const errorDetails = {
      timestamp: new Date().toISOString(),
      requestId: requestId || 'unknown',
      duration: `${totalDuration}ms`,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        mailgunDomain: process.env.MAILGUN_DOMAIN ? 'configured' : 'missing',
        mailgunApiKey: process.env.MAILGUN_API_KEY ? 'configured' : 'missing',
        mailgunFrom: process.env.MAILGUN_FROM ? 'configured' : 'missing',
      },
    };

    // Log different error types with appropriate levels
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('403')) {
        console.warn(`[${requestId}] Authentication/Authorization error:`, errorDetails);
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        console.error(`[${requestId}] Network error:`, errorDetails);
      } else if (error.message.includes('rate limit')) {
        console.warn(`[${requestId}] Rate limit error:`, errorDetails);
      } else {
        console.error(`[${requestId}] Unexpected error:`, errorDetails);
      }
    } else {
      console.error(`[${requestId}] Unknown error type:`, errorDetails);
    }

    return NextResponse.json(
      { 
        error: 'Failed to send email',
        requestId: requestId || undefined
      }, 
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  const requestId = `get-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  console.warn(`[${requestId}] Method GET Not Allowed`, {
    timestamp: new Date().toISOString(),
    method: 'GET',
    allowedMethods: ['POST'],
  });

  return NextResponse.json(
    { error: 'Method GET Not Allowed' }, 
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}