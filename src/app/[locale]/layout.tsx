// layout.tsx for locale-based routing in Next.js with i18n support

import initTranslations from '@/app/i18n';
import NavBar from '@/components/NavBar';
import TranslationsProvider from '@/components/TranslationsProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { dir } from 'i18next';
import { Roboto_Flex } from 'next/font/google';
import React from 'react';
import i18nConfig from '../../../i18nConfig';

const robotoFlex = Roboto_Flex({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-roboto-flex',
  display: 'swap',
});

export const generateStaticParams = () => {
  return i18nConfig.locales.map((locale: string) => ({ locale }));
};

interface IRootLayout {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const RootLayout: React.FC<IRootLayout> = async ({ children, params }) => {
  const { locale } = await params;

  // Try loading translations but continue if fails
  let resources = {};
  try {
    const translationResult = await initTranslations(locale, [
      'common', 
      'home', 
      'auth', 
      'recommendations', 
      'settings', 
      'admin', 
      'playlists', 
      'privacy-policy', 
      'contact', 
      'faq',
      'error'
    ]);
    resources = translationResult.resources || {};
  } catch (error) {
    console.error('Translation loading failed:', error);
    // Fallback resources
    resources = {
      [locale]: {
        common: {
          loading: 'Loading...',
          error: 'Something went wrong',
          navigation: {
            home: 'Home',
            recommendations: 'Recommendations',
            contactUs: 'Contact Us',
            faq: 'FAQ',
            playlists: 'Playlists',
            settings: 'Settings',
            myPlaylists: 'My Playlists',
            privacyPolicy: 'Privacy Policy',
            userAvatar: 'User Avatar',
            toggleMenu: 'Toggle Menu'
          }
        },
        auth: {
          signIn: 'Sign In',
          signUp: 'Sign Up',
          signOut: 'Sign Out'
        }
      }
    };
  }

  return (
    <html lang={locale} dir={dir(locale)}>
      <body className={robotoFlex.className}>
        <ErrorBoundary> {/* Wrap with ErrorBoundary to catch errors */}
          <TranslationsProvider 
            namespaces={[
              'common', 
              'home', 
              'auth', 
              'recommendations', 
              'settings', 
              'admin', 
              'playlists', 
              'privacy-policy', 
              'contact', 
              'faq',
              'error'
            ]} // Provide namespaces for translations
            locale={locale} 
            resources={resources}
          >
           <ErrorBoundary>
            <NavBar />
              {children}
            </ErrorBoundary>
          </TranslationsProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
};

export default RootLayout;