import initTranslations from '@/app/i18n';
import ClientProvider from '@/components/ClientProvider';
import NavBar from '@/components/NavBar';
import TranslationsProvider from '@/components/TranslationsProvider';
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
  const { resources } = await initTranslations(locale, ['common', 'home', 'auth']);

  return (
    <html lang={locale} dir={dir(locale)}>
      <body className={robotoFlex.className}>
        <NavBar />
        <TranslationsProvider namespaces={[]} locale={locale} resources={resources}>
          <ClientProvider lang={locale}>{children}</ClientProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
};

export default RootLayout;
