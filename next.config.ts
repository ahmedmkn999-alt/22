import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  poweredByHeader: false,

  productionBrowserSourceMaps: false,

  compress: true
};

export default nextConfig;
