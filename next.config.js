/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove static export temporarily for development
  // output: 'export',
  images: {
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig