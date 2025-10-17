/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ bỏ qua ESLint khi build trên Vercel
  },
};

module.exports = nextConfig;
