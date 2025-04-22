import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    reactCompiler: true,
  },
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
        hostname: 'assumebreach.tech',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
      }
  
    ],
    
  },
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
};

export default nextConfig;
