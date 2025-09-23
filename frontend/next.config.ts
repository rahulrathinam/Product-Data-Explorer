import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    // keep the explicit domains you already expect
    domains: ['picsum.photos', 'via.placeholder.com'],
    // allow common remote hosts (useful during development).
    // For production, replace the wildcard with only the hosts you trust.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.example.com' },
      { protocol: 'https', hostname: 'cdn.example2.com' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/:path*`,
      },
    ];
  },

  // ✅ Add this block
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
