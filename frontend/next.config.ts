import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['media.burford.co.uk'],
  },
};

export default nextConfig;
