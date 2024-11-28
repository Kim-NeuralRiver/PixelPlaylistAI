import { NextApiRequest, NextApiResponse } from 'next';
import { generateEmail, sendEmail } from '@/lib/mailer/mailgun';
import { welcomeEmailTemplate } from '@/lib/mailer/templates/welcome-email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.API_KEY;

  const requestKey = req.headers['x-api-key'];
  if (requestKey !== apiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { to, name, url } = req.body;

    if (!to || !name || !url) {
      return res.status(400).json({ error: 'Missing required fields: to, name, or url' });
    }

    try {
      const template = welcomeEmailTemplate(name, url); // Pass URL to the template
      const emailData = generateEmail('Welcome to Our App!', template);

      await sendEmail(to, emailData);

      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}