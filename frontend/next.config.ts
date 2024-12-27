import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'digital-heaven-store.onrender.com',
        pathname: '/uploads/**', 
      },
    ],
  },
};

export default nextConfig;
