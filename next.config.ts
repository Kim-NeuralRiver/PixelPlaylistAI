import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      '@locales': './locales',
    },
  },
};

export default nextConfig;
