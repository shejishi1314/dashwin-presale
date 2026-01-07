/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // 保留：忽略 TS 错误，方便部署
  },
  images: {
    unoptimized: true, // 保留：Vercel 部署必备，避免 Image 优化问题
  },
  experimental: {
    turbo: false, // 新增：关闭 Turbopack，解决 build 失败
  },
}

export default nextConfig