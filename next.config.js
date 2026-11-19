/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/socket.io/:path*',
        destination: 'http://localhost:4001/socket.io/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
