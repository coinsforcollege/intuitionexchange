/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { esmExternals: true },
  reactStrictMode: true,
  output: "standalone",
  swcMinify: true,
  pageExtensions: ["page.tsx", "page.mdx"],
  env: {
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV || "production",
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "https://api.intuitionexchange.com",
  },
};

export default nextConfig;
