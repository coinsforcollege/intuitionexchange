/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { esmExternals: true },
  reactStrictMode: true,
  output: "standalone",
  swcMinify: true,
  pageExtensions: ["page.tsx", "page.mdx"],
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  },
};

export default nextConfig;
