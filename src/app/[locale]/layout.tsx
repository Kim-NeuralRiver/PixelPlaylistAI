import initTranslations from '@/app/i18n';
import ClientProvider from '@/components/ClientProvider';
import TranslationsProvider from '@/components/TranslationsProvider';
import { dir } from 'i18next';
import { Inter } from 'next/font/google';
import React from 'react';

import i18nConfig from '../../../i18nConfig';

const inter = Inter({ subsets: ['latin'] });

export const generateStaticParams = () => {
  return i18nConfig.locales.map((locale: string) => ({ locale }));
};

interface IRootLayout {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}
const RootLayout: React.FC<IRootLayout> = async ({ children, params }) => {
  const { locale } = await params;
  const { resources } = await initTranslations(locale, ['common', 'home', 'auth']);

  return (
    <html lang={locale} dir={dir(locale)}>
      <body className={inter.className}>
        <TranslationsProvider namespaces={[]} locale={locale} resources={resources}>
          <ClientProvider lang={locale}>{children}</ClientProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
};

export default RootLayout;
