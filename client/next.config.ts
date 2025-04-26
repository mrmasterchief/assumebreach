import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  reactStrictMode: !isDev,
  poweredByHeader: false,
  productionBrowserSourceMaps: !isDev,
  compress: !isDev,
  experimental: {
    reactCompiler: false,
  },

  output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xsuit.com',
      },
      {
        protocol: 'http',
        hostname: 'assumebreach.tech',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
      },
    ],
  },
};

export default nextConfig;
