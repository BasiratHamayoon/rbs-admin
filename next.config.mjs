/** @type {import('next').NextConfig} */
const nextConfig = {
     experimental: {
    appDir: true,
  },
  images: {
    domains: ['res.cloudinary.com'], // Add your Cloudinary domain
  },
};

export default nextConfig;
