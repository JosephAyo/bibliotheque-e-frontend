/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/library/books',
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
