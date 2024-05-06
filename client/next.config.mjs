/** @type {import('next').NextConfig} */
const nextConfig = { 
    reactStrictMode: true, 
    images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },
}
    

export default nextConfig;
