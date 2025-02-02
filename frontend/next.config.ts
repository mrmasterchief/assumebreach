import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'standalone',
  images: {
    // for local development
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xsuit.com',
        port: '',
      },
  
    ],
  },
  webpack5: true,
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
};

export default nextConfig;
