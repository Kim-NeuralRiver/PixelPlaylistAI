import localFont from 'next/font/local';
import React from 'react';
import './globals.css';
import { t } from 'i18next';
import { Providers } from '../providers';

const pixelifySans = localFont({
  src: './fonts/PixelifySans-Medium.ttf',
  variable: '--font-pixelify-sans',
  display: 'swap',
});

interface IRootLayout {
  children: React.ReactNode;
}

const RootLayout: React.FC<IRootLayout> = ({ children }) => (
  <html lang="en">
    <body className={`${pixelifySans.variable} antialiased`}> {/* Using PixelifySans font */}
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;

export const metadata = {
  title: (t('home:title')),
  description: (t('home:description')),
};
export const dynamic = 'force-dynamic'; // Test
