import { Roboto_Flex } from 'next/font/google';
import localFont from 'next/font/local';
import React from 'react';

import { Providers } from '../providers';
import './globals.css';

//  const geistSans = localFont({
//    src: './fonts/GeistVF.woff',
//    variable: '--font-geist-sans',
//    weight: '100 900',
//  });
// const geistMono = localFont({
//    src: './fonts/GeistMonoVF.woff',
//    variable: '--font-geist-mono',
//    weight: '100 900',
//  });
const robotoFlex = Roboto_Flex({
   subsets: ['latin', 'cyrillic'],
   variable: '--font-roboto-flex',
   display: 'swap',
 });

// Using the below for testing purposes
// const geistSans = { variable: 'sans-serif' };
//const geistMono = { variable: 'monospace' };
// const robotoFlex = { variable: 'Arial, Helvetica, sans-serif' };

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
  title: "PixelPlaylistAI",
  description: "Get AI-powered game recommendations",
};
export const dynamic = 'force-dynamic'; // Test
