import { Roboto_Flex } from 'next/font/google';
import React from 'react';
import './globals.css';
import { t } from 'i18next';
import { Providers } from '../providers';

const robotoFlex = Roboto_Flex({
   subsets: ['latin', 'cyrillic'],
   variable: '--font-roboto-flex',
   display: 'swap',
 });

interface IRootLayout {
  children: React.ReactNode;
}

const RootLayout: React.FC<IRootLayout> = ({ children }) => (
  <html lang="en">
    <body className={`${robotoFlex.variable} antialiased`}> {/* // ${geistSans.variable} ${geistMono.variable} */}
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
