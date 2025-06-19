import path from 'path';
import type { NextConfig } from 'next';
import i18nConfig from './i18nConfig'; // Adjust the path as necessary

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@locales': path.resolve(__dirname, 'src/app/[locale]'),
    };
    return config;
  },
  i18nConfig: { // testing i18nConfig import
    locales: ['en', 'uk'],
    defaultLocale: 'en',
  }
};

export default nextConfig;
