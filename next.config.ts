import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@locales': path.resolve(__dirname, './locales'), // Add the alias for @locales
    };
    return config;
  },
};

export default nextConfig;
