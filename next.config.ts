import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'http://localhost:8888',
      'https://8888b-firebase-studio-174752607117.zcl.dev',
      'https://8888b-firebase-studio-174752607117.zcl.cloudworkstations.dev',
      'https://3001-firebase-studio-1747526771127.cluster-joak5ukfbnbyqspq@tewa33d24.cloudworkstations.dev'
    ]
  }
};

export default nextConfig;
