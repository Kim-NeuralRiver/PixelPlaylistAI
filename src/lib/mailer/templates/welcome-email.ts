import Mailgen from 'mailgen';

export const welcomeEmailTemplate = (name: string, actionUrl: string): Mailgen.Content => ({
  body: {
    name,
    intro: 'Welcome to Our App! We’re very excited to have you on board.',
    action: {
      instructions: 'To get started with our app, please click here:',
      button: {
        color: '#22BC66',
        text: 'Get Started',
        link: actionUrl,
      },
    },
    outro: 'Need help, or have questions? Just reply to this email, we’d love to help.',
  },
});