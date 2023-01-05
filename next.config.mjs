/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { esmExternals: true },
  reactStrictMode: true,
  output: "standalone",
  swcMinify: true,
  pageExtensions: ["page.tsx", "page.mdx"],
};

export default nextConfig;
