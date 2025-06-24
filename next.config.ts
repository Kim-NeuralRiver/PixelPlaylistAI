import path from 'path';
import type { NextConfig } from 'next';

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
  images: {
    domains: [
      'localhost',
      'images.igdb.com',
      'cdn.cloudflare.steamstatic.com',
      'isthereanydeal.com',
    ]
  }
};

export default nextConfig;
