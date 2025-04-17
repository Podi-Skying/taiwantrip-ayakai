/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 設定baseUrl，使網站在子路徑下正常運行
  basePath: process.env.NODE_ENV === 'production' ? '/taiwan-travel-ayakai' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/taiwan-travel-ayakai/' : '',
  trailingSlash: true,
}

module.exports = nextConfig 