import Mailgen from 'mailgen';

export const signinEmailTemplate = (name: string, actionUrl: string): Mailgen.Content => ({
  body: {
    name,
    intro: 'Welcome to Our App!',
    action: {
      instructions: 'To sign in to your account, please click here:',
      button: {
        color: '#22BC66',
        text: 'Get Started',
        link: actionUrl,
      },
    },
    outro: 'Need help, or have questions? Just reply to this email, we’d love to help.',
  },
});
