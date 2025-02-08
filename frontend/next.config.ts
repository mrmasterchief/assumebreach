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
      {
        protocol: 'http',
        hostname: '192.168.68.113',
        port: '4000', 
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
      }
  
    ],
    
  },
  webpack5: true,
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
};

export default nextConfig;
