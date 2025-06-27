// Layout for the Next.js application
import localFont from 'next/font/local';
import React from 'react';
import './globals.css';
import { t } from 'i18next';
import { Providers } from '../providers';
import BackgroundLayout from '@/components/BackgroundLayout';
import NavBar from '@/components/NavBar';

const pixelifySans = localFont({
  src: './fonts/PixelifySans-Medium.ttf',
  variable: '--font-pixelify-sans',
  display: 'swap',
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <body className={`${pixelifySans.variable} antialiased`}>
      <BackgroundLayout>
        <NavBar />
        <Providers>
          {children}
        </Providers>
      </BackgroundLayout>
    </body>
  );
}

export const metadata = {
  title: (t('home:title')),
  description: (t('home:description')),
};
export const dynamic = 'force-dynamic'; // Test
