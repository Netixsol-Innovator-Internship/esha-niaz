/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '5000' },
      { 
        protocol: 'https',
        hostname: 'esha-week5-day2-3-backend.vercel.app',
        pathname: '/uploads/profiles/**', // allow profile uploads
      },
    ],
  },
  experimental: {
    serverActions: {},
  },
};
export default nextConfig;
