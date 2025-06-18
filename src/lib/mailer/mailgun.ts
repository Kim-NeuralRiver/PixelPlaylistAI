import formData from 'form-data';
import Mailgun from 'mailgun.js';
import Mailgen from 'mailgen';
import { config } from '@/config/config';
import { Config } from '@/config/types';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
});

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: config.app.mailgen.product.name,
    link: config.app.mailgen.product.link,
  },
})

// Generate email content using Mailgen
export const generateEmail = (subject: string, template: Mailgen.Content) => {
  const emailBody = mailGenerator.generate(template);
  return {
    subject,
    html: emailBody,
    text: mailGenerator.generatePlaintext(template),
  };
};

// Send email using Mailgun.js
export const sendEmail = async (to: string, emailData: { subject: string; html: string; text: string }) => {
  const { subject, html, text } = emailData;

  const data = {
    from: process.env.MAILGUN_FROM!,
    to,
    subject,
    html,
    text,
  };

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN!, data);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
