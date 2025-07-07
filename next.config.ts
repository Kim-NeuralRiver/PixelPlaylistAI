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
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
};



export default nextConfig;
