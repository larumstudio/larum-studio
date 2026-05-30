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
};

export default nextConfig;