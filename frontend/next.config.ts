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
        hostname: 'd1fufvy4xao6k9.cloudfront.net',
        port: '',
      },
  
    ],
  },
  webpack5: true,
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
};

export default nextConfig;
