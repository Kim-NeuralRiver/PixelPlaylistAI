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
};

export default nextConfig;
