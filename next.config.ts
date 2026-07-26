import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'larumstudio.com',
      },
    ],
  },
  async redirects() {
    return [
      // /en/entorno → /en/area (301 permanente)
      { source: '/en/entorno', destination: '/en/area', permanent: true },
      { source: '/en/entorno/', destination: '/en/area', permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: '/landing', destination: 'https://landing-two-theta-43.vercel.app/landing' },
      { source: '/landing/:path*', destination: 'https://landing-two-theta-43.vercel.app/landing/:path*' },
      { source: '/panel', destination: 'https://landing-two-theta-43.vercel.app/landing' },
      { source: '/panel/:path*', destination: 'https://landing-two-theta-43.vercel.app/landing/:path*' },
    ];
  },
};

export default nextConfig;
