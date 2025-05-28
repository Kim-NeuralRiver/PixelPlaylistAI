import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@locales': path.resolve(__dirname, 'src/locales'),
    };
    return config;
  },
};

export default nextConfig;
